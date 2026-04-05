import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
    User, 
    MapPin, 
    Clock, 
    DollarSign, 
    Activity, 
    ArrowLeft,
    CheckCircle,
    Calendar,
    Phone,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchOrderById, handleOrderAction } from '../stores/doctorService';
import { setHeaderTitle } from '../stores/doctorSlice';
import Loader from '../../../components/loader/Loader';
import './OrderDetails.scss';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { currentOrder, loading, actionLoading } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentOrder) {
            dispatch(setHeaderTitle(`${t('doctor.orders_management')} #${currentOrder._id.slice(-6).toUpperCase()}`));
        }
    }, [dispatch, t, currentOrder]);

    const handleAction = async (actionType) => {
        const result = await dispatch(handleOrderAction({ actionType, orderId: id }));
        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(fetchOrderById(id));
        }
    };

    if (loading && !currentOrder) return <Loader loading={true} />;
    if (!currentOrder) return <div className="order-not-found">{t('errors.failed_to_fetch_orders')}</div>;

    const statusColors = {
        open: 'blue',
        confirmed: 'green',
        in_progress: 'orange',
        completed: 'purple',
        cancelled: 'red'
    };

    return (
        <motion.div 
            className="order-details-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="details-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    <span>{t('common.back')}</span>
                </button>
                <div className={`status-badge ${statusColors[currentOrder.status]}`}>
                    {t(`order_status.${currentOrder.status}`)}
                </div>
            </div>

            <div className="details-main-grid">
                <div className="info-column">
                    <div className="info-card patient-card">
                        <div className="card-header">
                            <User size={20} />
                            <h3>{t('auth.section_personal')}</h3>
                        </div>
                        <div className="patient-info">
                            <div className="avatar">
                                <User size={40} />
                            </div>
                            <div className="text">
                                <h4>{currentOrder.userId?.username || 'Patient'}</h4>
                                <p><Mail size={14} /> {currentOrder.userId?.email || 'N/A'}</p>
                                <p><Phone size={14} /> {currentOrder.userId?.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-card service-card">
                        <div className="card-header">
                            <Activity size={20} />
                            <h3>{t('doctor.service_type')}</h3>
                        </div>
                        <div className="service-details">
                            <div className="detail-item">
                                <span className="label">{t('doctor.service_type')}</span>
                                <span className="value">{t(`medical_service.${currentOrder.serviceType}`)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">{t('doctor.proposed_price')}</span>
                                <span className="value price">{currentOrder.price} {t('common.currency')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-card location-card">
                        <div className="card-header">
                            <MapPin size={20} />
                            <h3>{t('auth.section_location')}</h3>
                        </div>
                        <div className="location-details">
                            <p>{currentOrder.address}</p>
                            <div className="map-placeholder">
                                <MapPin size={40} />
                                <span>{t('common.coming_soon')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="actions-column">
                    <div className="info-card timeline-card">
                        <div className="card-header">
                            <Calendar size={20} />
                            <h3>Timeline</h3>
                        </div>
                        <div className="timeline-list">
                            <div className="timeline-item active">
                                <CheckCircle size={16} />
                                <div className="content">
                                    <span className="event">{t('order_status.open')}</span>
                                    <span className="time">{new Date(currentOrder.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-actions">
                        {currentOrder.status === 'confirmed' && (
                            <button 
                                className="action-btn primary" 
                                onClick={() => handleAction('start')}
                                disabled={actionLoading}
                            >
                                <Activity size={20} />
                                {t('doctor.start_service')}
                            </button>
                        )}
                        {currentOrder.status === 'in_progress' && (
                            <>
                                <button 
                                    className="action-btn info" 
                                    onClick={() => handleAction('arrival')}
                                    disabled={actionLoading}
                                >
                                    <MapPin size={20} />
                                    {t('doctor.mark_arrival')}
                                </button>
                                <button 
                                    className="action-btn success" 
                                    onClick={() => handleAction('complete')}
                                    disabled={actionLoading}
                                >
                                    <CheckCircle size={20} />
                                    {t('doctor.mark_complete')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetails;
