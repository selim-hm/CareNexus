import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
    Users, 
    Target, 
    Award, 
    Cpu, 
    Globe, 
    Heart,
    GraduationCap,
    Linkedin
} from 'lucide-react';
import './About.scss';

const About = () => {
    const { t } = useTranslation();

    const teamMembers = [
        { 
            name: t('about.members.m1_name'), 
            role: t('about.members.m1_role'), 
            image: "/abdallah.png",
            linkedin: "https://www.linkedin.com/in/abdallah-afifi-05bb40271/"
        },
        { 
            name: t('about.members.m2_name'), 
            role: t('about.members.m2_role'), 
            image: "/selim.jpg",
            linkedin: "https://www.linkedin.com/in/mohamed-selim-31a118331/"
        },
        { 
            name: t('about.members.m3_name'), 
            role: t('about.members.m3_role'), 
            image: "/shimaa.png",
            linkedin: "https://www.linkedin.com/in/shimaa-mohamed-a4052a367/"
        },
        { 
            name: t('about.members.m4_name'), 
            role: t('about.members.m4_role'), 
            image: "/ahmed.png",
            linkedin: "https://www.linkedin.com/in/ahmed-refat-902a99343/"
        },
        { 
            name: t('about.members.m5_name'), 
            role: t('about.members.m5_role'), 
            image: "/nour.jpg",
            linkedin: "https://www.linkedin.com/in/nayera-sallam-b7607b384?utm_source=share_via&utm_content=profile&utm_medium=member_android"
        },
        { 
            name: t('about.members.m6_name'), 
            role: t('about.members.m6_role'), 
            image: "/omnia.png",
            linkedin: "https://linkedin.com/in/omnia-awad-el-deeb"
        },
    ];

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hero-content"
                    >
                        <div className="hero-badge">
                            <GraduationCap size={20} />
                            <span>{t('about.graduation_project_label') || "Graduation Project"}</span>
                        </div>
                        <h1 className="hero-title">{t('about.hero_title')}</h1>
                        <p className="hero-subtitle">{t('about.hero_subtitle')}</p>
                    </motion.div>
                </div>
                <div className="bg-decor">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </section>

            <section className="mission-section container">
                <div className="mission-card">
                    <div className="mission-content">
                        <div className="section-header">
                            <span className="label">{t('about.mission_label') || "Our Story"}</span>
                            <h2>{t('about.mission_title')}</h2>
                        </div>
                        <p className="mission-desc">{t('about.mission_desc')}</p>
                        
                        <div className="mission-features">
                            <div className="m-feat">
                                <Target className="icon" size={24} />
                                <div>
                                    <h4>{t('about.vision_title') || "Vision"}</h4>
                                    <p>{t('about.vision_desc') || "Connecting healthcare seamlessly."}</p>
                                </div>
                            </div>
                            <div className="m-feat">
                                <Award className="icon" size={24} />
                                <div>
                                    <h4>{t('about.values_title') || "Values"}</h4>
                                    <p>{t('about.values_desc') || "Integrity, Innovation, Inclusion."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mission-visual">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="nexus-circle"
                        >
                            <Cpu size={40} className="node n1" />
                            <Globe size={40} className="node n2" />
                            <Heart size={40} className="node n3" />
                            <Users size={40} className="node n4" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="team-section">
                <div className="container">
                    <div className="section-header centered">
                        <span className="label">{t('about.team_subtitle')}</span>
                        <h2>{t('about.team_title')}</h2>
                        <p>{t('about.team_desc')}</p>
                    </div>

                    <div className="team-grid">
                        {teamMembers.map((member, idx) => (
                            <motion.a 
                                key={idx}
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="team-card"
                            >
                                <div className="card-top">
                                    <div className="member-image-box">
                                        <img src={member.image} alt={member.name} />
                                        <div className="linkedin-badge">
                                            <Linkedin size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-bottom">
                                    <h3>{member.name}</h3>
                                    <p>{member.role || t('about.team_member_default_role') || "Founding Member"}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
