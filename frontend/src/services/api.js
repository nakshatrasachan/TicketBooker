// frontend/src/services/api.js

const USER_API_BASE_URL = 'http://localhost:3004/api/users';
const SHOW_API_BASE_URL = 'http://localhost:3003/api/shows';
const BOOKING_API_BASE_URL = 'http://localhost:3001/api/bookings';

// --- User Service Functions ---

export const loginUser = async (credentials) => {
    const response = await fetch(`${USER_API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

export const registerUser = async (credentials) => {
    const response = await fetch(`${USER_API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

export const fetchAllShows = async () => {
    const response = await fetch(SHOW_API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch shows');
    }
    return response.json();
};
// --- Show Service Functions ---

export const fetchSeats = async (showId) => {
    const response = await fetch(`${SHOW_API_BASE_URL}/${showId}/seats`);
    if (!response.ok) {
        throw new Error('Failed to fetch seats');
    }
    return response.json();
};

export const fetchSeatStatuses = async (showId) => {
    const response = await fetch(`${BOOKING_API_BASE_URL}/status/${showId}`);
    if (!response.ok) {
        // It's okay if this fails, might just mean no seats are booked yet
        return {}; 
    }
    return response.json(); // Returns { "A1": "booked", "B2": "booked" }
};
// --- Booking Service Functions ---

export const createBooking = async (showId, seatsToBook, token) => {
    const response = await fetch(BOOKING_API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the auth token
        },
        body: JSON.stringify({
            showId,
            seatsToBook,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

// --- Admin Functions for Show Service ---

export const createShow = async (showData) => {
    const response = await fetch(`${SHOW_API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(showData),
    });
    if (!response.ok) throw new Error('Failed to create show');
    return response.json();
};

export const addSeat = async (showId, seatData) => {
    const response = await fetch(`${SHOW_API_BASE_URL}/${showId}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seatData),
    });
    if (!response.ok) throw new Error('Failed to add seat');
    return response.json();
};