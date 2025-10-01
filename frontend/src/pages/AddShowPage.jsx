// frontend/src/pages/AddShowPage.jsx
import React, { useState } from 'react';
import { createShow } from '../services/api';
import '../App.css';

function AddShowPage() {
    const [showId, setShowId] = useState('');
    const [showName, setShowName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const result = await createShow({ id: showId, name: showName });
            setMessage(`Success! ${result.message}`);
            setShowId('');
            setShowName('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container" style={{maxWidth: '600px'}}>
            <h1>Add a New Show</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={showId}
                    onChange={(e) => setShowId(e.target.value)}
                    placeholder="Show ID (e.g., sh_123)"
                    required
                />
                <input
                    type="text"
                    value={showName}
                    onChange={(e) => setShowName(e.target.value)}
                    placeholder="Show Name (e.g., Blockbuster Movie)"
                    required
                />
                <button type="submit" className="book-button">Create Show</button>
            </form>
            {message && <p style={{marginTop: '20px'}}>{message}</p>}
        </div>
    );
}

export default AddShowPage;