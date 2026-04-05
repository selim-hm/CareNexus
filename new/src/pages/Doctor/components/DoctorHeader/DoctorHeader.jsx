import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
    Search, 
    Bell, 
    Globe, 
    User,
    Menu,
    Plus
} from 'lucide-react';
import CreatePostModal from '../../../../components/CreatePostModal/CreatePostModal';
import './DoctorHeader.scss';

const DoctorHeader = ({ title, onMenuClick }) => {
    const { t, i18n } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const { currentTitle } = useSelector((state) => state.doctor);
    const displayTitle = currentTitle || title || t('nav.dashboard');

    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    useEffect(() => {
        if (displayTitle) {
            document.title = `${displayTitle}`;
        }
    }, [displayTitle]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
    };

    return (
        <>
            <header className="doctor-header">
                <div className="left-section">
                    <button className="mobile-menu-btn" onClick={onMenuClick}>
                        <Menu size={24} />
                    </button>
                    <h2 className="page-title">{displayTitle}</h2>
                </div>

                <div className="center-section">
                </div>

                <div className="right-section">
                    <button className="action-btn" onClick={toggleLanguage} title={t('common.switch_lang')}>
                        <Globe size={20} />
                        <span className="lang-label">{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
                    </button>

                    <button 
                        className="action-btn create-post-btn" 
                        onClick={() => setIsCreatePostOpen(true)}
                        title={t('posts.create_post', 'Create Post')}
                    >
                        <Plus size={20} />
                    </button>

                    <button className="action-btn notification-btn">
                        <Bell size={20} />
                        <span className="badge"></span>
                    </button>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">{user?.username || 'Doctor'}</span>
                            <span className="user-role">{t('auth.role_doctor')}</span>
                        </div>
                        <div className="user-avatar">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <CreatePostModal 
                isOpen={isCreatePostOpen} 
                onClose={() => setIsCreatePostOpen(false)} 
            />
        </>
    );
};

export default DoctorHeader;
