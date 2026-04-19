import { Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Header from './components/header/header';
import Loader from '../../components/loader/Loader';
import PublicRoute from '../../components/common/PublicRoute/PublicRoute';

// Auth Pages (Lazy Loaded)
const Login = lazy(() => import('./Login/Login'));
const Register = lazy(() => import('./Register/Register'));
const ForgotPassword = lazy(() => import('./ForgotPassword/ForgotPassword'));
const VerifyEmail = lazy(() => import('./VerifyEmail/VerifyEmail'));
const NotFound = lazy(() => import('../public/NotFound/NotFound'));

const AuthRoutes = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<Loader loading={true} />}>
                <Routes>
                    {/* PublicRoute redirects authenticated users to their dashboard */}
                    <Route
                        path="/login"
                        element={<PublicRoute><Login /></PublicRoute>}
                    />
                    <Route
                        path="/register"
                        element={<PublicRoute><Register /></PublicRoute>}
                    />
                    <Route
                        path="/forgot-password"
                        element={<PublicRoute><ForgotPassword /></PublicRoute>}
                    />
                    {/* VerifyEmail is reachable even after login (token might be present but email unverified) */}
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AuthRoutes;
