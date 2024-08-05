import * as amqp from 'amqplib';
// @ts-ignore
import { connectRabbitMQ, sendToQueue, QUEUE_NAME } from '../dist/lib/rabbit';
import { Persona } from '@/models/Persona';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672';

interface MessageContent {
    userId: string;
    // Add other fields as necessary
}

async function processMessage(msg: amqp.ConsumeMessage | null): Promise<void> {
    if (msg) {
        const messageContent: MessageContent = JSON.parse(msg.content.toString());
        console.log('Processing job:', messageContent);

        // Example: Simulate a long-running task
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Mock the tags generated
        const tags = ['Singapore', 'Student', 'IT', 'Comedy'];

        try {
            const userPersona = await Persona.findOne({ user_id: messageContent.userId });
            console.log('User Persona:', userPersona);
        } catch (error) {
            console.error('Error fetching user persona:', error);
        }

        console.log('Job completed:', messageContent);

        if (channel) {
            channel.ack(msg);
        }
    }
}

let channel: amqp.Channel;

async function startWorker(): Promise<void> {
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
