import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
const snsClient = new SNSClient({});

export const handler = async (event) => {
    const { phoneNumber, message } = JSON.parse(event.body);
    const params = {
        Message: message,
        PhoneNumber: phoneNumber, // Format: +1XXXXXXXXXX
    };
    try {
        const data = await snsClient.send(new PublishCommand(params));
        return { statusCode: 200, body: JSON.stringify({ messageId: data.MessageId }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
