import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { filterNavItems } from '../../utils/permissions';
import { logoutUser } from '../../../../pages/Auth/stores/authService';
import { 
    LayoutDashboard, 
    ClipboardList, 
    UserCircle, 
    Settings, 
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    BookOpen,
    MessageSquare,
    Star,
    Rss
} from 'lucide-react';
import { motion } from 'framer-motion';
import './DoctorSidebar.scss';

const DoctorSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const allNavItems = [
        { path: '/doctor', icon: LayoutDashboard, label: t('nav.dashboard'), feature: 'dashboard' },
        { path: '/doctor/orders', icon: ClipboardList, label: t('nav.orders'), feature: 'orders' },
        { path: '/doctor/feed', icon: Rss, label: t('nav.feed', { defaultValue: 'Social Feed' }), feature: 'feed' },
        { path: '/doctor/chat', icon: MessageSquare, label: t('nav.chat', { defaultValue: 'Messages' }), feature: 'chat' },
        { path: '/doctor/profile', icon: UserCircle, label: t('nav.profile'), feature: 'profile' },
        { path: '/doctor/reviews', icon: Star, label: t('nav.reviews', { defaultValue: 'Reviews' }), feature: 'reviews' },
        { path: '/doctor/medical-ai', icon: Sparkles, label: t('nav.medical_ai'), feature: 'medical_ai' },
        { path: '/doctor/knowledge-ai', icon: BookOpen, label: t('nav.knowledge_ai'), feature: 'knowledge_ai' },
        { path: '/doctor/settings', icon: Settings, label: t('nav.settings', { defaultValue: 'Settings' }), feature: 'settings' },
    ];

    const navItems = filterNavItems(allNavItems, role);

    return (
        <motion.aside 
            className={`doctor-sidebar ${isCollapsed ? 'collapsed' : ''}`}
            initial={false}
            animate={{ width: isCollapsed ? '80px' : '280px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="sidebar-header">
                {!isCollapsed && (
                    <motion.div 
                        className="logo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Care<span>Nexus</span>
                    </motion.div>
                )}
                <button 
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/doctor'}
                    >
                        <item.icon className="nav-icon" size={24} />
                        {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <LogOut className="nav-icon" size={24} />
                    {!isCollapsed && <span className="nav-label">{t('nav.logout')}</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default DoctorSidebar;
