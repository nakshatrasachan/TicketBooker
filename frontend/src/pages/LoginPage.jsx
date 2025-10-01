// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import '../App.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Get the login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password); // Call the context login function
        } catch (err) {
            setError(err.message);
        }
    };
    
    // ... (keep the return JSX the same)

    return (
        <div className="container" style={{maxWidth: '500px'}}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', width: '100%', gap: '15px'}}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (e.g., test@example.com)"
                    required
                    style={{padding: '10px', fontSize: '1em'}}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (e.g., password123)"
                    required
                    style={{padding: '10px', fontSize: '1em'}}
                />
                <button type="submit" className="book-button">Login</button>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </form>
             <p style={{marginTop: '20px'}}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;