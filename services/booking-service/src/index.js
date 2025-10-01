const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('redis');
const amqp = require('amqplib');

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

// --- Redis Connection ---
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// --- RabbitMQ Connection ---
let channel;
const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('booking_events', { durable: true });
        console.log('Connected to RabbitMQ successfully!');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        // In a real app, you might want to retry or exit if the connection fails
    }
};

// --- API Routes ---

// NEW: Endpoint to get the real-time status of all seats for a show
app.get('/api/bookings/status/:showId', async (req, res) => {
    const { showId } = req.params;
    const statusKey = `status:${showId}`;
    
    const seatStatuses = await redisClient.hGetAll(statusKey);
    res.status(200).json(seatStatuses);
});

// MODIFIED: Booking endpoint now only manages status
app.post('/api/bookings', async (req, res) => {
    const { showId, seatsToBook, userId } = req.body;
    const statusKey = `status:${showId}`;
    // console.log('UserId:', userId);
    // console.log('ReqBody',req.body);
    await redisClient.watch(statusKey);

    try {
        const seatStatusPromises = seatsToBook.map(seatId => redisClient.hGet(statusKey, seatId));
        const currentStatuses = await Promise.all(seatStatusPromises);

        for (let i = 0; i < currentStatuses.length; i++) {
            // A seat is available if its status is not 'booked'
            if (currentStatuses[i] === 'booked') {
                await redisClient.unwatch();
                return res.status(409).json({ message: `Seat ${seatsToBook[i]} is not available.` });
            }
        }
        
        const transaction = redisClient.multi();
        seatsToBook.forEach(seatId => {
            transaction.hSet(statusKey, seatId, 'booked');
        });
        const result = await transaction.exec();

        if (result === null) {
            return res.status(409).json({ message: 'Booking conflict. Please try again.' });
        }

        if (!channel) {
            throw new Error("RabbitMQ channel is not available.");
        }
        
        const bookingId = `bk_${crypto.randomBytes(8).toString('hex')}`;
        const eventData = { bookingId, showId, seats: seatsToBook, status: 'confirmed' };
        
        channel.sendToQueue('booking_events', Buffer.from(JSON.stringify(eventData)));
        
        console.log(`[EVENT PUBLISHED]: BookingConfirmed`, eventData);
        res.status(201).json({ message: 'Booking confirmed! Processing...', booking: eventData });

    } catch (error) {
        console.error("--- BOOKING FAILED ---", error);
        await redisClient.unwatch();
        res.status(500).json({ message: 'An error occurred during booking.' });
    }
}); 

// --- Start Server ---
const startServer = async () => {
    await redisClient.connect();
    console.log('Connected to Redis successfully!');
    await connectToRabbitMQ();

    app.listen(PORT, () => {
        console.log(`Booking Service is running on port ${PORT}`);
    });
};

startServer();