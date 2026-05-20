import { useEffect, useState, useRef } from 'react';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { HttpRequest } from '@smithy/protocol-http';
import { SignatureV4 } from '@smithy/signature-v4';
import { WebCryptoSha256 } from '@aws-crypto/sha256-browser';
import Ajv from 'ajv';
import config from '#config';

const ajv = new Ajv();

const createSigner = async () => {
  return new SignatureV4({
    credentials: fromCognitoIdentityPool({
      identityPoolId: config.identityPoolId,
      clientConfig: { region: config.region },
    }),
    service: 'appsync',
    region: config.region,
    sha256: WebCryptoSha256,
  });
};

const getAuthHeader = async () => {
  const signer = await createSigner();
  const url = new URL(`https://${config.httpDomain}/event`);
  const request = new HttpRequest({
    method: 'POST',
    headers: {
      accept: 'application/json, text/javascript',
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=UTF-8',
      host: url.hostname,
    },
    body: '', // empty body for signing, or pass payload if needed
    hostname: url.hostname,
    path: url.pathname,
  });
  const signedRequest = await signer.sign(request);
  return signedRequest.hostname;
};

const getBase64URLEncoded = async (body) => {
  const signer = await createSigner();
  const request = new HttpRequest({
    method: 'POST',
    headers: {
      accept: 'application/json, text/javascript',
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
    hostname: '', // hostname will be filled after signing
  });
  const signedRequest = await signer.sign(request);
  const str = btoa(JSON.stringify(signedRequest));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const getAuthProtocol = async (body) => {
  const header = await getBase64URLEncoded(body);
  return `header-${header}`;
};

const reconnectingSocket = async ({ eventSchema }) => {
  const messageListeners = [];
  const stateChangeListeners = [];
  const wsRef = useRef(null);
  const isConnectedRef = useRef(false);
  const reconnectOnCloseRef = useRef(true);

  const addMessageListener = (fn) => messageListeners.push(fn);
  const removeMessageListener = (fn) => {
    const index = messageListeners.indexOf(fn);
    if (index >= 0) messageListeners.splice(index, 1);
  };
  const addStateChangeListener = (fn) => {
    stateChangeListeners.push(fn);
    return () => {
      const idx = stateChangeListeners.indexOf(fn);
      if (idx >= 0) stateChangeListeners.splice(idx, 1);
    };
  };

  const start = async () => {
    const authHeader = await getAuthProtocol({ channel: config.channel });
    const ws = new WebSocket(`wss://${config.realtimeDomain}/event/realtime`, [
      'aws-appsync-event-ws',
      authHeader,
    ]);
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'connection_init' }));
      const subscribeMsg = {
        type: 'subscribe',
        id: crypto.randomUUID(),
        channel: config.channel,
      };
      ws.send(
        JSON.stringify({
          ...subscribeMsg,
          authorization: authHeader,
        })
      );
      isConnectedRef.current = true;
      stateChangeListeners.forEach((fn) => fn(true));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'connection_error') {
          console.error('Connection error:', msg);
          return;
        }
        if (
          ['connection_ack', 'subscribe_success', 'ka'].includes(msg.type)
        ) {
          // Heartbeat or ack
          return;
        }
        const { event: eventRaw } = msg;
        const event = JSON.parse(eventRaw);
        if (eventSchema && !ajv.validate(eventSchema, event)) {
          console.error('Invalid event:', ajv.errorsText());
          return;
        }
        messageListeners.forEach((fn) => fn(event));
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      isConnectedRef.current = false;
      stateChangeListeners.forEach((fn) => fn(false));
      if (!reconnectOnCloseRef.current) {
        console.log('WebSocket closed intentionally.');
        return;
      }
      console.log('WebSocket closed, reconnecting in 3s...');
      setTimeout(start, 3000);
    };
  };

  // Start connection
  start();

  return {
    on: addMessageListener,
    off: removeMessageListener,
    onStateChange: addStateChangeListener,
    close: () => {
      reconnectOnCloseRef.current = false;
      if (wsRef.current) wsRef.current.close();
    },
    getClient: () => wsRef.current,
    isConnected: () => isConnectedRef.current,
  };
};

const useWebsocket = ({ eventSchema }) => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const setup = async () => {
      const socketClient = await reconnectingSocket({ eventSchema });
      if (!mounted) return;
      setClient(socketClient);
      socketClient.on((msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    };
    setup();

    return () => {
      mounted = false;
      if (client) client.close();
    };
  }, [eventSchema]);

  return messages;
};

export default useWebsocket;