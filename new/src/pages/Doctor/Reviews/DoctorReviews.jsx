import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchDoctorReviews } from '../stores/doctorService';
import { setHeaderTitle } from '../stores/doctorSlice';
import { Star, MessageCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../../../components/loader/Loader';
import './DoctorReviews.scss';

const DoctorReviews = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { reviews, reviewStats, loading, error } = useSelector(state => state.doctor);

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.reviews', { defaultValue: 'My Reviews' })));
        dispatch(fetchDoctorReviews());
    }, [dispatch, t]);

    if (loading && reviews.length === 0) return <Loader loading={true} />;

    return (
        <motion.div 
            className="doctor-reviews-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="stats-overview">
                <div className="stat-box">
                    <Star className="text-yellow-400" size={32} />
                    <div className="stat-content">
                        <h3>{reviewStats?.averageRating || 0}</h3>
                        <p>{t('doctor.average_rating', { defaultValue: 'Average Rating' })}</p>
                    </div>
                </div>
                <div className="stat-box">
                    <MessageCircle className="text-blue-500" size={32} />
                    <div className="stat-content">
                        <h3>{reviewStats?.totalReviews || 0}</h3>
                        <p>{t('doctor.total_reviews', { defaultValue: 'Total Reviews' })}</p>
                    </div>
                </div>
            </div>

            <div className="reviews-list">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state">
                        <MessageCircle size={48} />
                        <h3>{t('doctor.no_reviews', { defaultValue: 'No reviews yet' })}</h3>
                        <p>{t('doctor.no_reviews_desc', { defaultValue: 'Your patient feedback will appear here.' })}</p>
                    </div>
                ) : (
                    reviews.map((review, index) => (
                        <motion.div 
                            key={review._id} 
                            className="review-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="avatar">
                                        {review.user?.avatar ? (
                                            <img src={review.user.avatar} alt="Avatar" />
                                        ) : (
                                            <div className="avatar-placeholder">{review.user?.username?.charAt(0).toUpperCase()}</div>
                                        )}
                                    </div>
                                    <div className="details">
                                        <h4>{review.user?.username || 'Patient'}</h4>
                                        <span className="date">
                                            <Calendar size={14} />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={i < review.rating ? 'filled' : 'empty'} 
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <div className="review-body">
                                    <p>{review.comment}</p>
                                </div>
                            )}
                            <div className="review-footer">
                                <span className="service-tag">
                                    {t(`medical_service.${review.product?.medicalServiceType}`, { defaultValue: review.product?.medicalServiceType })}
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default DoctorReviews;
