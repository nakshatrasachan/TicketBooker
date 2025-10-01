// frontend/src/pages/SeatBooking.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { fetchSeats, createBooking, fetchSeatStatuses } from '../services/api';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

function SeatBooking() {
    const [seats, setSeats] = useState({});
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, logout } = useAuth();
    // const showId = 'sh_123';
    const { showId } = useParams();
    const getCombinedSeatData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Fetch the static seat map (price, seat number) from the show-service
            const staticSeatMap = await fetchSeats(showId);

            // 2. Fetch the real-time statuses (available, booked) from the booking-service
            const seatStatuses = await fetchSeatStatuses(showId);

            // 3. Merge the two datasets
            const combinedSeats = {};
            for (const seatId in staticSeatMap) {
                combinedSeats[seatId] = {
                    price: staticSeatMap[seatId].price,
                    // If a seat has a status in Redis, use it. Otherwise, it's 'available'.
                    status: seatStatuses[seatId] || 'available'
                };
            }
            
            setSeats(combinedSeats);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [showId]);

    useEffect(() => {
        getCombinedSeatData();
    }, [getCombinedSeatData]);

    const handleBooking = async () => {
        if (selectedSeats.length === 0 || !token) {
            alert('Please select seats and ensure you are logged in.');
            return;
        }

        try {
            const result = await createBooking(showId, selectedSeats, token);
            alert(`Booking successful! ID: ${result.booking.bookingId}`);
            
            setSelectedSeats([]);
            getCombinedSeatData(); // Re-fetch the combined data

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleSeatClick = (seatId) => {
        if (seats[seatId]?.status === 'booked') return;
        
        setSelectedSeats(prev => 
            prev.includes(seatId) 
                ? prev.filter(id => id !== seatId) 
                : [...prev, seatId]
        );
    };

    if (loading) return <div className="container">Loading seats...</div>;
    if (error) return <div className="container">Error: {error}</div>;

    return (
        <div className="container">
            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                 <button onClick={logout} className="book-button" style={{ backgroundColor: '#dc3545', boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)' }}>
                    Logout
                 </button>
            </div> */}
            
            <h1>Movie Seat Booking</h1>
            
            <div className="seat-map-grid">
                {Object.entries(seats).map(([seatId, seatData]) => {
                    const isSelected = selectedSeats.includes(seatId);
                    const seatClass = `seat ${seatData.status} ${isSelected ? 'selected' : ''}`;
                    return (
                        <div key={seatId} className={seatClass} onClick={() => handleSeatClick(seatId)}>
                            {seatId}
                        </div>
                    );
                })}
            </div>

            <div className="legend">
                <div className="seat-info"><div className="seat available"></div>Available</div>
                <div className="seat-info"><div className="seat booked"></div>Booked</div>
                <div className="seat-info"><div className="seat selected"></div>Selected</div>
            </div>

            <button className="book-button" onClick={handleBooking} disabled={selectedSeats.length === 0}>
                Book Selected Seats
            </button>
        </div>
    );
}

export default SeatBooking;