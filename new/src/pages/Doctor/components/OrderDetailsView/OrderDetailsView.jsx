import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { 
    User, 
    MapPin, 
    Phone, 
    Mail, 
    Calendar, 
    DollarSign, 
    Activity, 
    CheckCircle,
    XCircle,
    Navigation,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { handleOrderAction } from '../../stores/doctorService';
import OrderMap from '../OrderMap/OrderMap';
import PopupConfirm from '../../../../components/common/PopupConfirm';
import './OrderDetailsView.scss';

const OrderDetailsView = ({ order, onBack }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { actionLoading } = useSelector((state) => state.doctor);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    
    const [proposedPrice, setProposedPrice] = useState(order?.price || '');
    const [description, setDescription] = useState('');

    const isRtl = i18n.language === 'ar';

    if (!order) {
        return (
            <div className="order-details-empty">
                <div className="empty-content">
                    <Navigation size={48} />
                    <h3>{t('doctor.select_order_to_view')}</h3>
                    <p>{t('doctor.select_order_desc')}</p>
                </div>
            </div>
        );
    }

    const onAction = (actionType) => {
        setPendingAction(actionType);
        setIsConfirmOpen(true);
    };

    const confirmAction = async () => {
        try {
            await dispatch(handleOrderAction({ 
                actionType: pendingAction, 
                orderId: order._id, 
                data: pendingAction === 'accept' ? { proposedPrice, description } : {} 
            })).unwrap();
            
            toast.success(t(`doctor.actions.${pendingAction}_success`));
            setIsConfirmOpen(false);
        } catch (err) {
            toast.error(err || t('common.error'));
        }
    };

    return (
        <div className={`order-details-view ${isRtl ? 'rtl' : ''}`}>
            {/* Header / Hero Section */}
            <div className="view-hero">
                <div className="hero-content">
                    <button className="mobile-back-btn" onClick={onBack}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="patient-profile">
                        <div className="avatar-large">
                            {order.patient?.avatar ? (
                                <img src={order.patient.avatar} alt="P" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <div className="profile-info">
                            <h2>{order.patient?.username}</h2>
                            <p className="order-spec">
                                {t(`medical_service.${order.medicalServiceType}`)} • {order._id.slice(-6).toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="hero-actions">
                    {order.status === 'open' && (
                        <button className="btn-primary" onClick={() => onAction('accept')}>
                            {t('doctor.express_interest')}
                        </button>
                    )}
                    {order.status === 'confirmed' && (
                        <button className="btn-primary" onClick={() => onAction('start')}>
                            {t('doctor.start_service')}
                        </button>
                    )}
                    {order.status === 'in_progress' && (
                        <div className="action-group">
                            {!order.completion?.providerArrivedAt && (
                                <button className="btn-outline" onClick={() => onAction('arrival')}>
                                    {t('doctor.mark_arrival')}
                                </button>
                            )}
                            <button className="btn-success" onClick={() => onAction('complete')}>
                                {t('doctor.mark_complete')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="view-body">
                {/* Info Grid */}
                <div className="info-main">
                    <section className="info-section">
                        <h3>{t('doctor.order_info')}</h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <Clock size={18} />
                                <div>
                                    <label>{t('doctor.requested_at')}</label>
                                    <span>{new Date(order.createdAt).toLocaleString(i18n.language)}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <DollarSign size={18} />
                                <div>
                                    <label>{t('doctor.proposed_price')}</label>
                                    <span className="highlight">{order.price} {t('common.currency')}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="info-section">
                        <h3>{t('auth.section_location')}</h3>
                        <div className="location-info">
                            <MapPin size={18} />
                            <p>{order.address}</p>
                        </div>
                    </section>
                </div>

                {/* Map Section */}
                <div className="map-panel">
                    <OrderMap 
                        latitude={order.latitude || 30.7865} 
                        longitude={order.longitude || 31.0004} 
                        patientName={order.patient?.username}
                    />
                </div>
            </div>

            {/* Confirm Dialog */}
            <PopupConfirm 
                isOpen={isConfirmOpen}
                title={t(`doctor.confirm.${pendingAction}_title`, { defaultValue: t('common.confirmation') })}
                onConfirm={confirmAction}
                onCancel={() => setIsConfirmOpen(false)}
                direction={isRtl ? 'rtl' : 'ltr'}
                message={
                    pendingAction === 'accept' ? (
                        <div className="action-form">
                            <p>{t('doctor.confirm.accept_desc')}</p>
                            <div className="form-group">
                                <label>{t('doctor.proposed_price')}</label>
                                <input 
                                    type="number" 
                                    value={proposedPrice}
                                    onChange={(e) => setProposedPrice(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('doctor.offer_description')}</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    ) : t(`doctor.confirm.${pendingAction}_desc`, { defaultValue: t('common.are_you_sure') })
                }
            />
        </div>
    );
};

export default OrderDetailsView;
