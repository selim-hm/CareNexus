import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { User, Stethoscope } from 'lucide-react';
import './OrderCard.scss';

dayjs.extend(relativeTime);

const OrderCard = ({ order, isActive, onClick }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const getStatusInfo = (status) => {
        switch (status) {
            case 'open': return { label: t('order_status.open'), class: 'open' };
            case 'confirmed': return { label: t('order_status.confirmed'), class: 'confirmed' };
            case 'in_progress': return { label: t('order_status.in_progress'), class: 'in-progress' };
            case 'completed': return { label: t('order_status.completed'), class: 'completed' };
            case 'cancelled': return { label: t('order_status.cancelled'), class: 'cancelled' };
            default: return { label: status, class: status };
        }
    };

    const statusInfo = getStatusInfo(order.status);
    const timeAgo = dayjs(order.createdAt).fromNow();

    return (
        <div 
            className={`order-list-item ${isActive ? 'active' : ''} ${isRtl ? 'rtl' : ''}`}
            onClick={() => onClick(order)}
        >
            <div className="item-avatar">
                {order.patient?.avatar ? (
                    <img src={order.patient.avatar} alt="P" />
                ) : (
                    <div className="placeholder-avatar">
                        <User size={18} />
                    </div>
                )}
            </div>
            
            <div className="item-content">
                <div className="item-header">
                    <h4 className="patient-name">{order.patient?.username || order.title}</h4>
                    <span className="time-tag">{timeAgo}</span>
                </div>
                
                <div className="item-subtitle">
                    <Stethoscope size={14} />
                    <span>{t(`medical_service.${order.medicalServiceType}`)}</span>
                </div>
                
                <div className="item-meta">
                    <span className={`status-small ${statusInfo.class}`}>
                        {statusInfo.label}
                    </span>
                    <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
