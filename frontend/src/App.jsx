// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeatBooking from './pages/SeatBooking';
import AddShowPage from './pages/AddShowPage'; // Import
import AddSeatsPage from './pages/AddSeatsPage'; // Import
import Navbar from './components/Navbar';
import ShowSelectionPage from './pages/ShowSelectionPage';
import { useAuth } from './contexts/AuthContext';
const PrivateRoute = ({ children }) => {
    const { token } = useAuth(); // Get token from context
    return token ? children : <Navigate to="/login" />;
};
const AdminRoute = ({ children }) => {
    const { token, userRole } = useAuth();
    if (token && userRole === 'admin') {
        return children;
    }
    // Redirect to booking page if they are logged in but not an admin
    return <Navigate to={token ? "/booking" : "/login"} />;
};
function App() {
    return (
        <>
        <Navbar/>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shows" element={<PrivateRoute><ShowSelectionPage /></PrivateRoute>} /> 
                <Route
                    path="/booking/:showId"
                    element={
                        <PrivateRoute>
                            <SeatBooking />
                        </PrivateRoute>
                    }
                />
                <Route path="/admin/add-show" element={<AdminRoute><AddShowPage /></AdminRoute>} />
                <Route path="/admin/add-seats" element={<AdminRoute><AddSeatsPage /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/shows" />} />
            </Routes>
        </>
        
    );
}

export default App;