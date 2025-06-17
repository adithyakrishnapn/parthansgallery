import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseconfig';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // A nice loading spinner

// Install these helpers: npm install react-firebase-hooks react-spinners
const ProtectedRoute = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        // You can show a loading spinner here
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><ClipLoader color="#007bff" /></div>;
    }

    if (error) {
        return <div><p>Error: {error.message}</p></div>;
    }

    if (!user) {
        // If user is not logged in, redirect to the login page
        return <Navigate to="/admin/login" />;
    }

    // If user is logged in, show the protected content
    return children;
};

export default ProtectedRoute;