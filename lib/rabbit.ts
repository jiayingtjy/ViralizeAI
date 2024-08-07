import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq:5672";
const QUEUE_NAME = 'tiktokQueue';

let channel: amqp.Channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
}

async function sendToQueue(type: string, data: any) {
    const message = {
        type,
        data,
    };

    if (!channel) {
        await connectRabbitMQ();
    }

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
}

export { connectRabbitMQ, sendToQueue, QUEUE_NAME };
