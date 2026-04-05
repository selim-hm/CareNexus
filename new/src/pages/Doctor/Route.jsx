import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
const NotFound = lazy(() => import('../public/NotFound/NotFound'));
import Loader from '../../components/loader/Loader';

// Placeholder children pages can be imported here
import DoctorLayout from './components/DoctorLayout/DoctorLayout';
import KnowledgeAI from '../public/KnowledgeAI/KnowledgeAI';
import MedicalAI from '../public/MedicalAI/MedicalAI';
const DoctorOrders = lazy(() => import('./Orders/DoctorOrders'));
const DoctorDashboard = lazy(() => import('./Dashboard/DoctorDashboard'));
const DoctorProfile = lazy(() => import('./Profile/DoctorProfile'));
const DoctorSettings = lazy(() => import('./Settings/DoctorSettings'));
const OrderDetails = lazy(() => import('./OrderDetails/OrderDetails'));
const DoctorChat = lazy(() => import('./Chat/DoctorChat'));
const DoctorReviews = lazy(() => import('./Reviews/DoctorReviews'));
const DoctorFeed = lazy(() => import('./Feed/DoctorFeed'));
const PostDetail = lazy(() => import('./Feed/PostDetail'));

import { useSelector } from 'react-redux';
import { canAccess } from './utils/permissions';

const DoctorRoute = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;

    return (
        <Suspense fallback={<Loader loading={true} />}>
            <DoctorLayout>
                <Routes>
                    <Route index element={<DoctorDashboard />} />
                    <Route path="orders" element={<DoctorOrders />} />
                    <Route path="orders/:id" element={<OrderDetails />} />
                    <Route path="feed" element={<DoctorFeed />} />
                    <Route path="feed/post/:id" element={<PostDetail />} />
                    <Route path="profile" element={<DoctorProfile />} />
                    <Route path="settings" element={<DoctorSettings />} />
                    <Route path="chat" element={<DoctorChat />} />
                    
                    {/* Role-specific or Permission-specific routes */}
                    {canAccess(role, 'reviews') && (
                        <Route path="reviews" element={<DoctorReviews />} />
                    )}
                    
                    <Route path="medical-ai" element={<MedicalAI />} />
                    <Route path="knowledge-ai" element={<KnowledgeAI />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </DoctorLayout>
        </Suspense>
    );
};

export default DoctorRoute;
