import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Stethoscope, ShoppingBag, BookOpen, Bell, ShieldCheck,
    FileText, Users, MapPin, CreditCard, Brain, Star,
    Zap, Lock, Globe, Activity, Pill, Camera, MessageSquare
} from 'lucide-react';
import './Services.scss';

const servicesData = [
    {
        id: 'medical-orders',
        icon: <Stethoscope size={40} />,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#667eea',
        tag: 'Core',
        features: [
            { icon: <MapPin size={16} />, text: 'services.medical.f1' },
            { icon: <Zap size={16} />, text: 'services.medical.f2' },
            { icon: <Users size={16} />, text: 'services.medical.f3' },
            { icon: <Activity size={16} />, text: 'services.medical.f4' },
        ],
        titleKey: 'services.medical.title',
        descKey: 'services.medical.desc',
    },
    {
        id: 'ecommerce',
        icon: <ShoppingBag size={40} />,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#f5576c',
        tag: 'E-Commerce',
        features: [
            { icon: <Pill size={16} />, text: 'services.ecommerce.f1' },
            { icon: <CreditCard size={16} />, text: 'services.ecommerce.f2' },
            { icon: <ShoppingBag size={16} />, text: 'services.ecommerce.f3' },
            { icon: <Bell size={16} />, text: 'services.ecommerce.f4' },
        ],
        titleKey: 'services.ecommerce.title',
        descKey: 'services.ecommerce.desc',
    },
    {
        id: 'knowledge',
        icon: <BookOpen size={40} />,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#4facfe',
        tag: 'AI Knowledge',
        features: [
            { icon: <Globe size={16} />, text: 'services.knowledge.f1' },
            { icon: <Pill size={16} />, text: 'services.knowledge.f2' },
            { icon: <Brain size={16} />, text: 'services.knowledge.f3' },
            { icon: <BookOpen size={16} />, text: 'services.knowledge.f4' },
        ],
        titleKey: 'services.knowledge.title',
        descKey: 'services.knowledge.desc',
    },
    {
        id: 'notification',
        icon: <Bell size={40} />,
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        color: '#43e97b',
        tag: 'Real-time',
        features: [
            { icon: <Bell size={16} />, text: 'services.notification.f1' },
            { icon: <Zap size={16} />, text: 'services.notification.f2' },
            { icon: <Users size={16} />, text: 'services.notification.f3' },
            { icon: <Activity size={16} />, text: 'services.notification.f4' },
        ],
        titleKey: 'services.notification.title',
        descKey: 'services.notification.desc',
    },
    {
        id: 'kyc',
        icon: <ShieldCheck size={40} />,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        color: '#fa709a',
        tag: 'Security',
        features: [
            { icon: <Camera size={16} />, text: 'services.kyc.f1' },
            { icon: <FileText size={16} />, text: 'services.kyc.f2' },
            { icon: <Lock size={16} />, text: 'services.kyc.f3' },
            { icon: <ShieldCheck size={16} />, text: 'services.kyc.f4' },
        ],
        titleKey: 'services.kyc.title',
        descKey: 'services.kyc.desc',
    },
    {
        id: 'social',
        icon: <MessageSquare size={40} />,
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        color: '#a18cd1',
        tag: 'Community',
        features: [
            { icon: <FileText size={16} />, text: 'services.social.f1' },
            { icon: <MessageSquare size={16} />, text: 'services.social.f2' },
            { icon: <Star size={16} />, text: 'services.social.f3' },
            { icon: <Users size={16} />, text: 'services.social.f4' },
        ],
        titleKey: 'services.social.title',
        descKey: 'services.social.desc',
    },
];

const stats = [
    { value: '6+', labelKey: 'services.stats.services' },
    { value: '99.9%', labelKey: 'services.stats.uptime' },
    { value: '256-bit', labelKey: 'services.stats.encryption' },
    { value: '24/7', labelKey: 'services.stats.support' },
];

const Services = () => {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState(null);

    return (
        <div className="services-page">
            {/* ── Hero ── */}
            <section className="services-hero">
                <div className="container">
                    <span className="hero-badge">{t('services.badge', 'Platform Services')}</span>
                    <h1>{t('services.hero.title', 'Everything Your Healthcare Journey Needs')}</h1>
                    <p>{t('services.hero.subtitle', 'CareNexus is a full-stack medical platform that connects patients, doctors, nurses, pharmacists and shipping companies — powered by AI, real-time infrastructure, and bank-grade security.')}</p>
                    <div className="stats-row">
                        {stats.map((s, i) => (
                            <div key={i} className="stat-pill">
                                <span className="stat-value">{s.value}</span>
                                <span className="stat-label">{t(s.labelKey, s.labelKey)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-decor">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </section>

            {/* ── Cards Grid ── */}
            <section className="services-grid-section">
                <div className="container">
                    <div className="services-grid">
                        {servicesData.map((svc) => (
                            <div
                                key={svc.id}
                                className={`service-card ${activeId === svc.id ? 'active' : ''}`}
                                style={{ '--card-color': svc.color }}
                                onMouseEnter={() => setActiveId(svc.id)}
                                onMouseLeave={() => setActiveId(null)}
                            >
                                <div className="card-accent" style={{ background: svc.gradient }} />
                                <div className="card-tag">{svc.tag}</div>

                                <div className="card-icon" style={{ background: svc.gradient }}>
                                    {svc.icon}
                                </div>

                                <h3>{t(svc.titleKey, svc.titleKey)}</h3>
                                <p className="card-desc">{t(svc.descKey, svc.descKey)}</p>

                                <ul className="feature-list">
                                    {svc.features.map((f, i) => (
                                        <li key={i}>
                                            <span className="feat-icon" style={{ color: svc.color }}>{f.icon}</span>
                                            {t(f.text, f.text)}
                                        </li>
                                    ))}
                                </ul>


                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="how-it-works">
                <div className="container">
                    <h2>{t('services.how.title', 'How CareNexus Works')}</h2>
                    <p className="section-sub">{t('services.how.sub', 'A seamless flow from patient request to service completion')}</p>
                    <div className="steps-row">
                        {[
                            { num: '01', icon: <Lock size={24} />, titleKey: 'services.how.s1.title', descKey: 'services.how.s1.desc' },
                            { num: '02', icon: <MapPin size={24} />, titleKey: 'services.how.s2.title', descKey: 'services.how.s2.desc' },
                            { num: '03', icon: <Zap size={24} />, titleKey: 'services.how.s3.title', descKey: 'services.how.s3.desc' },
                            { num: '04', icon: <Star size={24} />, titleKey: 'services.how.s4.title', descKey: 'services.how.s4.desc' },
                        ].map((step, i) => (
                            <div key={i} className="step">
                                <div className="step-number">{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h4>{t(step.titleKey, step.titleKey)}</h4>
                                <p>{t(step.descKey, step.descKey)}</p>
                                {i < 3 && <div className="step-connector" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Security Banner ── */}
            <section className="security-banner">
                <div className="container">
                    <div className="security-inner">
                        <div className="security-icon"><ShieldCheck size={48} /></div>
                        <div className="security-text">
                            <h3>{t('services.security.title', 'Enterprise-Grade Security')}</h3>
                            <p>{t('services.security.desc', 'Every user is verified with AI-powered KYC — face detection, liveness checks, OCR document reading, and international ID format validation via AWS Rekognition and Google Vision API.')}</p>
                        </div>
                        <div className="security-badges">
                            {['AWS Rekognition', 'Google Vision', 'Firebase FCM', 'Stripe'].map((b) => (
                                <span key={b} className="badge">{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
