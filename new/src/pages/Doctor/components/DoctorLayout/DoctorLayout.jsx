import React, { useState } from 'react';
import DoctorSidebar from '../DoctorSidebar/DoctorSidebar';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import './DoctorLayout.scss';

const DoctorLayout = ({ children, title }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className={`doctor-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className={`sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`} onClick={toggleMobileMenu}></div>

            <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'show-mobile' : ''}`}>
                <DoctorSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            <div className="main-content">
                <DoctorHeader title={title} onMenuClick={toggleMobileMenu} />
                <main className="content-inner">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;
