const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = process.env.PORT || 3002;

let channel;

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('booking_events', { durable: true });
        
        console.log('Connected to RabbitMQ, waiting for booking events...');
        
        // Start consuming messages from the queue
        channel.consume('booking_events', (msg) => {
            if (msg !== null) {
                const eventData = JSON.parse(msg.content.toString());
                console.log('[EVENT RECEIVED]: BookingConfirmed', eventData);
                console.log(eventData);
                // --- Simulate sending an email ---
                console.log(`--- Sending confirmation email to user for booking ${eventData.bookingId} ---`);

                // Acknowledge the message was processed successfully
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Failed to connect or consume from RabbitMQ', error);
    }
};

app.listen(PORT, () => {
    console.log(`Notification Service is alive on port ${PORT}`);
    connectToRabbitMQ();
});