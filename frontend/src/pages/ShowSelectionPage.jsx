// frontend/src/pages/ShowSelectionPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllShows } from '../services/api';
import '../App.css';

function ShowSelectionPage() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getShows = async () => {
            try {
                const data = await fetchAllShows();
                setShows(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getShows();
    }, []);

    if (loading) return <div className="container">Loading shows...</div>;

    return (
        <div className="container">
            <h1>Select a Show</h1>
            <div className="show-list">
                {shows.map(show => (
                    <Link key={show.id} to={`/booking/${show.id}`} className="show-card">
                        <h3>{show.name}</h3>
                        <p>Click to book tickets</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ShowSelectionPage;