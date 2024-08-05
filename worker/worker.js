const amqp = require("amqplib");
const mongoose = require("mongoose");
const {
  connectRabbitMQ,
  sendToQueue,
  QUEUE_NAME,
} = require("../dist/lib/rabbit");
const { Persona } = require("../dist/models/Persona");

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq:5672";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://mongodb:27017/viralizeai";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

async function processMessage(msg) {
  if (msg) {
    const messageContent = JSON.parse(msg.content.toString());
    console.log("Processing job:", messageContent);

    // Mock the tags generated
    const tags = ["Singapore", "Student", "IT", "Comedy"];

    try {
      const userPersona = await Persona.findOne({
        user_id: messageContent.data.user_id,
      });
      if (userPersona) {
        userPersona.tags = tags;
        await userPersona.save();
      } else {
        console.error("User persona not found");
      }
      console.log("Job completed:", messageContent);

    } catch (error) {
      console.error("Error fetching user persona:", error);
      console.error("Job Failed:");

    }
    if (channel) {
      channel.ack(msg);
    }
  }
}

let channel;

async function startWorker() {
  try {
    console.log("Starting worker...", RABBITMQ_URL);
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, processMessage, { noAck: false });

    console.log(`Worker is up and running, listening on ${QUEUE_NAME}`);
  } catch (error) {
    console.error("Failed to start worker", error);
  }
}

startWorker();
