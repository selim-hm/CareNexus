import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
    TrendingUp, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { fetchActiveOrders, fetchHistoryOrders, fetchAvailableOrders } from '../stores/doctorService';
import { setHeaderTitle } from '../stores/doctorSlice';
import './DoctorDashboard.scss';

const StatCard = ({ title, value, icon: Icon, color, suffix = '' }) => (
    <div className={`stat-card ${color}`}>
        <div className="stat-icon">
            <Icon size={24} />
        </div>
        <div className="stat-content">
            <span className="stat-label">{title}</span>
            <div className="stat-value">
                <span>{value?.toLocaleString() || 0}</span>
                {suffix && <span className="suffix">{suffix}</span>}
            </div>
        </div>
    </div>
);

const DoctorDashboard = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { availableOrders, activeOrders, historyOrders, loading } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.dashboard')));
        const userId = user?._id || user?.id;
        if (userId) {
            dispatch(fetchAvailableOrders());
            dispatch(fetchActiveOrders(userId));
            dispatch(fetchHistoryOrders(userId));
        }
    }, [dispatch, user?._id, t, user?.id]);

    const stats = [
        { 
            title: t('doctor.stats.active_orders', { defaultValue: 'Active Orders' }), 
            value: activeOrders.length, 
            icon: Clock, 
            color: 'blue' 
        },
        { 
            title: t('doctor.stats.completed_orders', { defaultValue: 'Completed' }), 
            value: historyOrders.filter(o => o.status === 'completed').length, 
            icon: CheckCircle, 
            color: 'green' 
        },
        { 
            title: t('doctor.stats.total_earnings', { defaultValue: 'Total Earnings' }), 
            value: historyOrders.reduce((acc, curr) => acc + (curr.price || 0), 0), 
            icon: TrendingUp, 
            color: 'purple',
            suffix: ` ${t('common.currency')}`
        }
    ];

    return (
        <div className="doctor-dashboard">
            <div className="welcome-banner">
                <div className="banner-content">
                    <div className="banner-greeting">
                        <span className="date-badge">
                            {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                            })}
                        </span>
                        <h1>{t('common.welcome_back', { name: user?.username?.split(' ')[0] })}!</h1>
                        <p>{t('doctor.dashboard_intro', { defaultValue: 'Manage your patients and orders efficiently today.' })}</p>
                        
                        <div className="banner-stats-preview">
                            <div className="mini-stat">
                                <span className="label">{t('doctor.tabs.active')}</span>
                                <span className="value">{activeOrders.length}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="mini-stat">
                                <span className="label">{t('doctor.tabs.available')}</span>
                                <span className="value">{availableOrders?.length || 0}</span>
                            </div>
                        </div>

                        <button className="banner-cta" onClick={() => navigate('/doctor/orders')}>
                            {t('doctor.orders_management')}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="banner-illustration">
                    <div className="circle-bg"></div>
                    <CheckCircle className="floating-icon" size={120} />
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            <div className="dashboard-content">
                <div className="recent-activity">
                    <div className="section-header">
                        <h3>{t('doctor.recent_alerts', { defaultValue: 'Important Alerts' })}</h3>
                    </div>
                    <div className="alerts-list">
                        {activeOrders.length > 0 ? (
                            <div className="alert-item primary">
                                <AlertCircle size={20} />
                                <div className="alert-body">
                                    <p>{t('doctor.alerts.active_task', { count: activeOrders.length, defaultValue: `You have ${activeOrders.length} tasks in progress.` })}</p>
                                    <button className="text-link">{t('common.view_all')} <ArrowRight size={14} /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-alerts">
                                <CheckCircle size={40} />
                                <p>{t('doctor.alerts.all_clear', { defaultValue: 'You are all caught up!' })}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="quick-actions">
                    <div className="section-header">
                        <h3>{t('common.quick_actions', { defaultValue: 'Quick Actions' })}</h3>
                    </div>
                    <div className="actions-grid">
                        <button className="action-tile">
                            <Clock size={24} />
                            <span>{t('doctor.tabs.available')}</span>
                        </button>
                        <button className="action-tile secondary">
                            <TrendingUp size={24} />
                            <span>{t('doctor.stats.earnings', { defaultValue: 'Earnings' })}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
