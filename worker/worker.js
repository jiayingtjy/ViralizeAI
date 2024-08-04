const amqp = require('amqplib');
const { connectRabbitMQ, sendToQueue, QUEUE_NAME } = require('../dist/lib/rabbit');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';

async function processMessage(msg) {
    if (msg) {
        console.log('Processing msg:', msg);
        const messageContent = JSON.parse(msg.content.toString());
        console.log('Processing job:', messageContent);

        // Example: Simulate a long-running task
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log('Job completed:', messageContent);

        channel.ack(msg);
    }
}

let channel;

async function startWorker() {
    try {
        console.log('Starting worker...', RABBITMQ_URL);
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        channel.consume(QUEUE_NAME, processMessage, { noAck: false });

        console.log(`Worker is up and running, listening on ${QUEUE_NAME}`);
    } catch (error) {
        console.error('Failed to start worker', error);
    }
}

startWorker();
