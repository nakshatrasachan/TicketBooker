// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser as apiLogin } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
        }
    }, [token]);
    const login = async (email, password) => {
        const data = await apiLogin({ email, password });
        localStorage.setItem('authToken', data.token);
        const decodedToken = jwtDecode(data.token);
        setUserRole(decodedToken.role);
        setToken(data.token);
        navigate('/booking');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUserRole(null);
        navigate('/login');
    };

    const value = { token, userRole, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};