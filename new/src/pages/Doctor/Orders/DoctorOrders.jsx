import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    fetchAvailableOrders,
    fetchActiveOrders,
    fetchHistoryOrders
} from '../stores/doctorService';
import { setHeaderTitle } from '../stores/doctorSlice';
import Loader from '../../../components/loader/Loader';
import OrderCard from '../components/OrderCard/OrderCard';
import OrderDetailsView from '../components/OrderDetailsView/OrderDetailsView';
import './DoctorOrders.scss';

const DoctorOrders = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const {
        availableOrders,
        activeOrders,
        historyOrders,
        loading,
        error
    } = useSelector((state) => state.doctor);

    const [activeTab, setActiveTab] = useState('available');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const isRtl = i18n.language === 'ar';

    const loadOrders = useCallback(() => {
        const userId = user?._id || user?.id;
        
        if (activeTab === 'available') {
            dispatch(fetchAvailableOrders());
        } else if (activeTab === 'active' && userId) {
            dispatch(fetchActiveOrders(userId));
        } else if (activeTab === 'history' && userId) {
            dispatch(fetchHistoryOrders(userId));
        }
    }, [activeTab, user, dispatch]);

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.orders', { defaultValue: 'My Orders' })));
    }, [dispatch, t]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const getCurrentOrders = () => {
        if (activeTab === 'available') return availableOrders;
        if (activeTab === 'active') return activeOrders;
        return historyOrders;
    };

    // Select first order by default on tab change or list update
    useEffect(() => {
        const orders = getCurrentOrders();
        if (orders.length > 0 && !selectedOrder) {
            setSelectedOrder(orders[0]);
        } else if (orders.length === 0) {
            setSelectedOrder(null);
        }
    }, [activeTab, availableOrders, activeOrders, historyOrders]);

    return (
        <div className={`doctor-orders-page ${isRtl ? 'rtl' : ''}`}>
            <div className="dashboard-header">
                <div className="tabs-container">
                    <div className="tabs-header">
                        <button 
                            className={`tab-link ${activeTab === 'available' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('available'); setSelectedOrder(null); }}
                        >
                            {t('doctor.tabs.available')}
                            {availableOrders.length > 0 && <span className="count-badge">{availableOrders.length}</span>}
                        </button>
                        <button 
                            className={`tab-link ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('active'); setSelectedOrder(null); }}
                        >
                            {t('doctor.tabs.active')}
                            {activeOrders.length > 0 && <span className="count-badge">{activeOrders.length}</span>}
                        </button>
                        <button 
                            className={`tab-link ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('history'); setSelectedOrder(null); }}
                        >
                            {t('doctor.tabs.history')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="orders-list-panel">
                    {loading && getCurrentOrders().length === 0 ? (
                        <div className="loading-state">
                            <Loader loading={true} />
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button className="retry-btn" onClick={loadOrders}>{t('common.retry')}</button>
                        </div>
                    ) : getCurrentOrders().length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-illustration">📭</div>
                            <h3>{t('doctor.no_orders_found')}</h3>
                            <p>{t('doctor.check_later')}</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {getCurrentOrders().map((order) => (
                                <OrderCard 
                                    key={order._id} 
                                    order={order} 
                                    isActive={selectedOrder?._id === order._id}
                                    onClick={setSelectedOrder}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={`order-details-panel ${selectedOrder ? 'active' : ''}`}>
                    <OrderDetailsView 
                        order={selectedOrder} 
                        onBack={() => setSelectedOrder(null)} 
                    />
                </div>
            </div>
        </div>
    );
};

export default DoctorOrders;
