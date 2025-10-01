// services/show-service/src/index.js

const express = require('express');
const cors = require('cors');
const db = require('./db'); // You will create this file

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Function to create database tables on startup if they don't exist
const initializeDatabase = async () => {
    const createShowsTable = `
        CREATE TABLE IF NOT EXISTS shows (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
    `;
    const createSeatsTable = `
        CREATE TABLE IF NOT EXISTS seats (
            id SERIAL PRIMARY KEY,
            show_id VARCHAR(255) REFERENCES shows(id),
            seat_number VARCHAR(10) NOT NULL,
            price INT NOT NULL,
            status VARCHAR(50) DEFAULT 'available',
            UNIQUE(show_id, seat_number)
        );
    `;
    try {
        await db.query(createShowsTable);
        await db.query(createSeatsTable);
        console.log("Show and Seat tables are ready.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};


// --- "Admin" Endpoint to create a new show ---
app.post('/api/shows', async (req, res) => {
    const { id, name } = req.body;
    try {
        await db.query('INSERT INTO shows(id, name) VALUES($1, $2)', [id, name]);
        res.status(201).json({ message: 'Show created successfully', show: { id, name } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating show', error: error.message });
    }
});
app.get('/api/shows', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name FROM shows');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shows' });
    }
});


// --- "Admin" Endpoint to add a single seat to a show ---
app.post('/api/shows/:showId/seats', async (req, res) => {
    const { showId } = req.params;
    const { seat_number, price } = req.body;
    try {
        await db.query(
            'INSERT INTO seats(show_id, seat_number, price) VALUES($1, $2, $3)',
            [showId, seat_number, price]
        );
        res.status(201).json({ message: `Seat ${seat_number} added to show ${showId}` });
    } catch (error) {
        res.status(500).json({ message: 'Error adding seat', error: error.message });
    }
});


// --- Modified endpoint to get seat map (fetches from DB) ---
app.get('/api/shows/:showId/seats', async (req, res) => {
    const { showId } = req.params;
    try {
        // We will join the booking status in a later step. For now, we get the base map.
        const result = await db.query('SELECT seat_number, price, status FROM seats WHERE show_id = $1', [showId]);
        
        const seatMap = {};
        result.rows.forEach(row => {
            seatMap[row.seat_number] = { price: row.price, status: row.status };
        });

        res.status(200).json(seatMap);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seat map' });
    }
});


app.listen(PORT, () => {
    console.log(`Show Service is alive on port ${PORT}`);
    initializeDatabase();
});