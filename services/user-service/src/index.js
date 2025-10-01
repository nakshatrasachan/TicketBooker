// services/user-service/src/index.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db'); // Import the db module

const app = express();
const PORT = process.env.PORT || 3004;
const JWT_SECRET = 'your-super-secret-key';

app.use(cors());
app.use(express.json());

// Function to create the users table if it doesn't exist
const initializeDatabase = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'customer'
        );
    `;
    try {
        await db.query(createTableQuery);
        console.log("Users table is ready.");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
};

// User Registration Endpoint
app.post('/api/users/register', async (req, res) => {
    const { email, password, role='customer' } = req.body;
    // ... (validation remains the same)
    // console.log(email, password, role);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users(email, password_hash, role) VALUES($1, $2, $3)',
            [email, hashedPassword, role]
        );
        console.log('New user registered:', email);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'User already exists.' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login Endpoint
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ email: user.email, userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful.', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`User Service is alive on port ${PORT}`);
    initializeDatabase(); // Create the table on startup
});