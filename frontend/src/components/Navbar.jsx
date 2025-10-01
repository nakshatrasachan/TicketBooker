// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    background: '#2c3e50',
    color: 'white',
    marginBottom: '2rem'
};

const navLinksStyle = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
};

function Navbar() {
    const { token, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={navStyle}>
            <Link to="/booking" style={{ ...linkStyle, fontSize: '1.5rem' }}>TicketBooker</Link>
            <div style={navLinksStyle}>
                {token && userRole === 'admin' && (
                    <>
                        <Link to="/admin/add-show" style={linkStyle}>Add Show</Link>
                        <Link to="/admin/add-seats" style={linkStyle}>Add Seats</Link>
                    </>
                )}
                {token && (
                    <button onClick={handleLogout} className="book-button" style={{ backgroundColor: '#dc3545' }}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;