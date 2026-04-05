import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../loader/Loader';

/**
 * ProtectedRoute Component
 * @param {Array} allowedRoles - Roles that can access this route
 * @param {JSX.Element} children - Component to render if authorized
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    // Show spinner while AuthInitializer is restoring the session
    if (isLoading) {
        return <Loader loading={true} />;
    }

    // Not authenticated → redirect to login, remember where user was trying to go
    if (!token || !user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Authenticated but wrong role → redirect to home (public)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
