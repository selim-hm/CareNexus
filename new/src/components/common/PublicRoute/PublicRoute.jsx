import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../loader/Loader';

/**
 * PublicRoute – for /auth/* pages
 * If the user is already authenticated → redirect to their role dashboard
 * Otherwise → render children (login, register, etc.)
 */

const ROLE_ROUTES = {
  doctor: '/doctor',
  nursing: '/nursing',
  patient: '/patient',
  pharmacy: '/pharmacy',
  admin: '/admin',
  shipping_company: '/shipping-company',
};

const PublicRoute = ({ children }) => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader loading={true} />;
  }

  if (token && user?.role) {
    const destination = ROLE_ROUTES[user.role] || '/';
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default PublicRoute;
