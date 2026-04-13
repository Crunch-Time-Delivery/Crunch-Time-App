import { useEffect, useState } from 'react';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { HttpRequest } from '@smithy/protocol-http';
import { SignatureV4 } from '@smithy/signature-v4';
import { WebCryptoSha256 } from '@aws-crypto/sha256-browser';
import config from '#config';
import Ajv from 'ajv';

const ajv = new Ajv();

const sigv4 = async (body) => {
  const signer = new SignatureV4({
    credentials: fromCognitoIdentityPool({
      identityPoolId: config.identityPoolId,
      clientConfig: { region: config.region },
    }),
    service: 'appsync',
    region: config.region,
    sha256: WebCryptoSha256,
  });

  const url = new URL(`https://${config.httpDomain}/event`);
  const request = new HttpRequest({
    method: 'POST',
    headers: {
      accept: 'application/json, text/javascript',
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=UTF-8',
      host: url.hostname,
    },
    body: body ? JSON.stringify(body) : '{}',
    hostname: url.hostname,
    path: url.pathname,
  });

  const signedHttpRequest = await signer.sign(request);

  return {
    host: signedHttpRequest.hostname,
    ...signedHttpRequest.headers,
  };
};

async function getBase64URLEncoded(body) {
  return btoa(JSON.stringify(await sigv4(body)))
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove padding `=`
}

async function getAuthProtocol(body) {
  const header = await getBase64URLEncoded(body);
  return `header-${header}`;
}

async function reconnectingSocket(eventSchema) {
  let client;
  let isConnected = false;
  let reconnectOnClose = true;
  let messageListeners = [];
  let stateChangeListeners = [];

  function on(fn) {
    messageListeners.push(fn);
  }

  function off(fn) {
    messageListeners = messageListeners.filter((l) => l !== fn);
  }

  function onStateChange(fn) {
    stateChangeListeners.push(fn);
    return () => {
      stateChangeListeners = stateChangeListeners.filter((l) => l !== fn);
    };
  }

  const auth = await getAuthProtocol();
  const subscribeMsg = {
    type: 'subscribe',
    id: crypto.randomUUID(),
    channel: config.channel,
  };
  const signedSubscribeBody = await sigv4({ channel: config.channel });

  function start(eventSchema) {
    client = new WebSocket(`wss://${config.realtimeDomain}/event/realtime`, [
      'aws-appsync-event-ws',
      auth,
    ]);

    client.onopen = () => {
      client.send(JSON.stringify({ type: 'connection_init' }));
      client.send(
        JSON.stringify({
          ...subscribeMsg,
          authorization: signedSubscribeBody,
        })
      );
      isConnected = true;
      for (const fn of stateChangeListeners) {
        fn(true);
      }
    };

    const close = client.close;

    // Close without reconnecting
    client.close = () => {
      reconnectOnClose = false;
      close.call(client);
    };

    client.onmessage = (messageEvent) => {
      const { data } = messageEvent;
      try {
        const message = JSON.parse(data);
        if (message.type === 'connection_error') {
          console.error('connection error', message);
          return;
        }
        if (
          message.type === 'connection_ack' ||
          message.type === 'subscribe_success' ||
          message.type === 'ka'
        ) {
          console.debug('received', message);
          return;
        }
        const { event: eventRaw } = message;
        console.debug('received', eventRaw);
        const event = JSON.parse(eventRaw);
        if (eventSchema !== undefined) {
          if (!ajv.validate(eventSchema, event)) {
            console.error('invalid event', ajv.errorsText(), event);
            return;
          }
        }
        for (const fn of messageListeners) {
          fn(event);
        }
      } catch (error) {
        console.error('error', error);
      }
    };

    client.onerror = (e) => console.error(e);

    client.onclose = () => {
      isConnected = false;
      for (const fn of stateChangeListeners) {
        fn(false);
      }

      if (!reconnectOnClose) {
        console.debug('ws closed by app');
        return;
      }

      console.debug('ws closed by server');
      setTimeout(start, 3000);
    };
  }

  start(eventSchema);

  return {
    on,
    off,
    onStateChange,
    close: () => client.close(),
    getClient: () => client,
    isConnected: () => isConnected,
  };
}

const useWebsocket = ({ eventSchema }) => {
  const [messages, setMessages] = useState([]);
  const [client] = useState(() => reconnectingSocket(eventSchema));

  useEffect(() => {
    let mounted = true;

    const setupWebSocket = async () => {
      const ws = await client;
      if (!mounted) return;

      function handleMessage(message) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      ws.on(handleMessage);
      return () => ws.off(handleMessage);
    };

    const cleanup = setupWebSocket();

    return () => {
      mounted = false;
      cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
    };
  }, [client]);

  return messages;
};

export default useWebsocket;