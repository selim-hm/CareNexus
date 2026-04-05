import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Building2, Users, Heart, ShieldCheck, BarChart3, Cloud, FileText, Smartphone, Clock, Cpu, Star, ChevronLeft, ChevronRight, Play, Pause, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SliderModule from 'react-slick';
const Slider = SliderModule.default || SliderModule;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.scss';
import Contact from '../Contact/Contact';


const Home = () => {
    const { t } = useTranslation();

    const sliderRef = React.useRef(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = React.useState(true);

    const testimonials = [
        { id: 'sarah', rating: 5 },
        { id: 'michael', rating: 5 },
        { id: 'emma', rating: 5 },
        { id: 'john', rating: 5 },
        { id: 'sophia', rating: 4 },
        { id: 'david', rating: 5 },
        { id: 'olivia', rating: 4 },
        { id: 'james', rating: 5 }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
        })
    };

    const sliderSettings = React.useMemo(() => ({
        dots: true,
        infinite: testimonials.length > 3,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: isAutoScrolling,
        autoplaySpeed: 5000,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, infinite: testimonials.length > 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1, infinite: testimonials.length > 1 } }
        ]
    }), [isAutoScrolling, testimonials.length]);

    return (
        <div className="home-page">
            {/* Ultra-Premium Hero with Abstract Layers */}
            <section className="hero-section">
                <div className="hero-background">
                    <img src="/abstract-tech.png" alt={t('home.hero_visual.nexus_alt')} className="nexus-bg" loading="lazy" />
                    <div className="hero-overlay"></div>
                </div>

                <div className="container hero-grid">
                    <div className="hero-content">
                        <h1 className="hero-title">{t('home.hero_title')}</h1>
                        <p className="hero-subtitle">{t('home.hero_subtitle')}</p>
                        <div className="hero-actions">
                            <Link to="/auth/login" className="btn btn-primary">{t('home.get_started')}</Link>
                            <Link to="/services" className="btn btn-outline">{t('home.learn_more')}</Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="image-stack">
                            <div className="stack-item main">
                                <img src="/pngwing.com (2).png" alt={t('home.hero_visual.doctor_alt')} loading="lazy" />
                            </div>
                            {/* 
                            <div className="floating-stat">
                                <span className="stat-num">{t('home.hero_visual.accuracy_value')}</span>
                                <span className="stat-label">{t('home.hero_visual.accuracy_rate')}</span>
                            </div>
                            */}
                        </div>
                    </div>
                </div>


            </section>

            {/* Statistics Section (Impact) */}
            <section className="stats-section">
                <div className="container">
                    <motion.div
                        className="stats-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="hero-badge">{t('welcome.description')}</div>
                        <h2 className="stats-title">
                            {t('home.stats.title_main')}
                            <span className="highlight">{t('home.stats.title_accent')}</span>
                        </h2>
                        <p className="stats-subtitle">{t('home.stats.subtitle')}</p>
                    </motion.div>

                    <motion.div
                        className="stats-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { icon: Building2, val: 'card1_val', label: 'card1_label', desc: 'card1_desc' },
                            { icon: Users, val: 'card2_val', label: 'card2_label', desc: 'card2_desc' },
                            { icon: Heart, val: 'card3_val', label: 'card3_label', desc: 'card3_desc' },
                            { icon: ShieldCheck, val: 'card4_val', label: 'card4_label', desc: 'card4_desc' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="stat-card"
                                custom={i}
                                variants={cardVariants}
                            >
                                <div className="icon-wrapper">
                                    <stat.icon size={24} />
                                </div>
                                <h3 className="stat-value">{t(`home.stats.${stat.val}`)}</h3>
                                <p className="stat-label">{t(`home.stats.${stat.label}`)}</p>
                                <p className="stat-desc">{t(`home.stats.${stat.desc}`)}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>


            {/* Professional Features Section */}
            <section className="features-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="feature-badge">{t('home.features.badge')}</div>
                        <h2 className="feature-title">
                            {t('home.features.title_part1')}
                            <span className="highlight">{t('home.features.title_accent')}</span>
                            <br />
                            {t('home.features.title_part2')}
                        </h2>
                        <p className="feature-subtitle">{t('home.features.subtitle')}</p>
                    </motion.div>

                    <div className="features-grid">
                        {[
                            { icon: ShieldCheck, id: 1 },
                            { icon: BarChart3, id: 2 },
                            { icon: Users, id: 3 },
                            { icon: Cloud, id: 4 },
                            { icon: FileText, id: 5 },
                            { icon: Smartphone, id: 6 },
                            { icon: Clock, id: 7 },
                            { icon: Cpu, id: 8 }
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.id}
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <div className="icon-box">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="card-title">{t(`home.features.card${feature.id}_title`)}</h3>
                                <p className="card-desc">{t(`home.features.card${feature.id}_desc`)}</p>

                                <div className="feature-highlights">
                                    {[1, 2, 3].map(hIdx => (
                                        <div key={hIdx} className="highlight-item">
                                            <CheckCircle size={14} className="check-icon" />
                                            <span>{t(`home.features.card${feature.id}_h${hIdx}`)}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="quote-icon-box">
                            <Heart size={32} />
                        </div>
                        <h2 className="section-title">{t('testimonials.title')}</h2>
                        <p className="section-subtitle">{t('testimonials.subtitle')}</p>
                    </motion.div>

                    <div className="testimonials-slider-wrapper">
                        {typeof Slider === 'function' ? (
                            <Slider ref={sliderRef} {...sliderSettings}>
                                {(Array.isArray(testimonials) ? testimonials : []).map((test) => {
                                    const name = t(`testimonials.${test.id}.name`, { defaultValue: '' });
                                    const initials = typeof name === 'string' && name.length > 0
                                        ? name.split(' ').map(n => n[0]).join('').toUpperCase()
                                        : '?';

                                    return (
                                        <div key={test.id} className="testimonial-slide">
                                            <div className="testimonial-card">
                                                <div className="rating">
                                                    {[...Array(Number.isFinite(test.rating) ? test.rating : 5)].map((_, starI) => (
                                                        <Star key={starI} size={16} fill="#f1c40f" color="#f1c40f" />
                                                    ))}
                                                </div>
                                                <p className="content">"{t(`testimonials.${test.id}.content`)}"</p>
                                                <div className="author">
                                                    <div className="avatar">
                                                        {initials}
                                                    </div>
                                                    <div className="info">
                                                        <h4 className="name">{name}</h4>
                                                        <p className="role">{t(`testimonials.${test.id}.role`)}</p>
                                                        <p className="hospital">{t(`testimonials.${test.id}.hospital`)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                        ) : (
                            <div className="slider-fallback" style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '20px' }}>
                                <p>Unable to load testimonials at this moment.</p>
                            </div>
                        )}

                        <div className="slider-controls">
                            <div className="nav-buttons">
                                <button onClick={() => sliderRef.current?.slickPrev()} className="control-btn prev">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={() => sliderRef.current?.slickNext()} className="control-btn next">
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="play-pause-toggle">
                                <button onClick={() => setIsAutoScrolling(!isAutoScrolling)} className="toggle-btn">
                                    {isAutoScrolling ? <Pause size={20} /> : <Play size={20} />}
                                    <span>{isAutoScrolling ? t('controls.pause') : t('controls.play')}</span>
                                </button>
                                <div className="progress-text">
                                    {currentSlide + 1} / {testimonials.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Contact />



        </div>
    );
};

export default Home;
