import amqp from 'amqplib';
import { QUEUE_NAME } from '../lib/rabbit';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function processMessage(msg: amqp.ConsumeMessage | null) {
    if (msg) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log('Received job:', messageContent);

        try {
            switch (messageContent.type) {
                case 'videoTags':
                    await videoTagGenerator(messageContent);
                    break;
                case 'taskType2':
                    await handleTaskType2(messageContent);
                    break;
                // Add more cases for different task types
                default:
                    console.log('Unknown task type:', messageContent.type);
                    break;
            }

            console.log('Job completed:', messageContent);
            channel.ack(msg);
        } catch (error) {
            console.error('Error processing job:', error);
            channel.nack(msg, false, false); // Do not requeue the message
        }
    }
}

async function videoTagGenerator(data: any) {
    // Example: Simulate a long-running task
    console.log('Handling task type 1:', data);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
}

async function handleTaskType2(data: any) {
    // Example: Simulate a different long-running task
    console.log('Handling task type 2:', data);
    await new Promise((resolve) => setTimeout(resolve, 3000));
}

let channel: amqp.Channel;

async function startWorker() {
    try {
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
