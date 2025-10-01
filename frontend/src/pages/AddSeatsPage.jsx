// frontend/src/pages/AddSeatsPage.jsx
import React, { useState } from 'react';
import { addSeat } from '../services/api';
import '../App.css';

function AddSeatsPage() {
    const [showId, setShowId] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const result = await addSeat(showId, { seat_number: seatNumber, price: Number(price) });
            setMessage(`Success! ${result.message}`);
            setSeatNumber('');
            setPrice('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container" style={{maxWidth: '600px'}}>
            <h1>Add Seats to a Show</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={showId}
                    onChange={(e) => setShowId(e.target.value)}
                    placeholder="Show ID to add seats to (e.g., sh_123)"
                    required
                />
                <input
                    type="text"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    placeholder="Seat Number (e.g., A1, B2)"
                    required
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price (e.g., 250)"
                    required
                />
                <button type="submit" className="book-button">Add Seat</button>
            </form>
            {message && <p style={{marginTop: '20px'}}>{message}</p>}
        </div>
    );
}

export default AddSeatsPage;