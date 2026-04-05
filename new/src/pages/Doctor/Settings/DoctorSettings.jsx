import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { 
    Globe, 
    Bell, 
    Lock, 
    Eye, 
    Smartphone,
    Languages,
    X,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setHeaderTitle } from '../stores/doctorSlice';
import { changeDoctorPassword } from '../stores/doctorService';
import './DoctorSettings.scss';

const SettingToggle = ({ icon: Icon, label, description, checked, onChange }) => (
    <div className="setting-row">
        <div className="setting-info">
            <div className="icon-box">
                <Icon size={20} />
            </div>
            <div className="text-box">
                <span className="label">{label}</span>
                <span className="desc">{description}</span>
            </div>
        </div>
        <label className="switch">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider round"></span>
        </label>
    </div>
);

const DoctorSettings = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { actionLoading, error } = useSelector((state) => state.doctor);
    
    const [notifications, setNotifications] = useState({
        orders: true,
        messages: true,
        marketing: false
    });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.settings')));
    }, [dispatch, t]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return;
        }

        const result = await dispatch(changeDoctorPassword({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        }));

        if (changeDoctorPassword.fulfilled.match(result)) {
            toast.success(t('auth.password_success', { defaultValue: 'Password changed successfully!' }));
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setSuccessMessage('');
            }, 2000);
        } else if (changeDoctorPassword.rejected.match(result)) {
            toast.error(result.payload || t('common.update_error', { defaultValue: 'Failed to update' }));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            className="doctor-settings-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="settings-section">
                <div className="section-header">
                    <Globe size={22} />
                    <h3>{t('support.categories.gettingStarted.title', { defaultValue: 'General' })}</h3>
                </div>
                <div className="settings-card">
                    <div className="setting-row" onClick={toggleLanguage}>
                        <div className="setting-info">
                            <div className="icon-box">
                                <Languages size={20} />
                            </div>
                            <div className="text-box">
                                <span className="label">{t('common.switch_lang')}</span>
                                <span className="desc">{i18n.language === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}</span>
                            </div>
                        </div>
                        <div className="current-val">{i18n.language === 'ar' ? 'العربية' : 'English'}</div>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <div className="section-header">
                    <Bell size={22} />
                    <h3>{t('doctor.recent_alerts', { defaultValue: 'Notifications' })}</h3>
                </div>
                <div className="settings-card">
                    <SettingToggle 
                        icon={Smartphone}
                        label="Order Updates"
                        description="Receive push notifications for new order requests."
                        checked={notifications.orders}
                        onChange={() => setNotifications({...notifications, orders: !notifications.orders})}
                    />
                    <SettingToggle 
                        icon={Bell}
                        label="Message Alerts"
                        description="Get notified when a patient chats with you."
                        checked={notifications.messages}
                        onChange={() => setNotifications({...notifications, messages: !notifications.messages})}
                    />
                </div>
            </div>

            <div className="settings-section">
                <div className="section-header">
                    <Lock size={22} />
                    <h3>{t('auth.section_account', { defaultValue: 'Security' })}</h3>
                </div>
                <div className="settings-card">
                    <div className="setting-row">
                        <div className="setting-info">
                            <div className="icon-box">
                                <Eye size={20} />
                            </div>
                            <div className="text-box">
                                <span className="label">{t('auth.password_label', { defaultValue: 'Change Password' })}</span>
                                <span className="desc">Keep your account secure by rotating your password.</span>
                            </div>
                        </div>
                        <button className="settings-btn" onClick={() => setIsPasswordModalOpen(true)}>Update</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isPasswordModalOpen && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="settings-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="modal-header">
                                <h3>{t('auth.password_label')}</h3>
                                <button className="close-btn" onClick={() => setIsPasswordModalOpen(false)}><X size={20} /></button>
                            </div>
                            <form className="modal-form" onSubmit={handleSubmitPassword}>
                                {successMessage && <div className="success-alert">{successMessage}</div>}
                                {error && <div className="error-alert">{error}</div>}
                                
                                <div className="form-group">
                                    <label>{t('auth.old_password', { defaultValue: 'Old Password' })}</label>
                                    <input 
                                        type="password" 
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.new_password', { defaultValue: 'New Password' })}</label>
                                    <input 
                                        type="password" 
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.confirm_password', { defaultValue: 'Confirm New Password' })}</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={actionLoading || (passwordData.newPassword !== passwordData.confirmPassword)}>
                                    {actionLoading ? t('common.loading') : t('common.save')}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DoctorSettings;
