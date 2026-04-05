import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { setHeaderTitle } from '../stores/doctorSlice';
import { updateDoctorProfile, uploadProfileImage } from '../stores/doctorService';
import { updateUser } from '../../Auth/stores/authSlice';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    Award, 
    Save,
    X,
    ClipboardCheck,
    Edit3,
    Camera,
    Plus,
    MessageSquare,
    Globe,
    MoreHorizontal,
    Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDoctorPosts } from '../stores/postSlice';
import CreatePostModal from '../../../components/CreatePostModal/CreatePostModal';
import PostCard from '../../../components/PostCard/PostCard';
import './DoctorProfile.scss';

const ProfileCard = ({ title, children, onEdit, isEditable = true }) => {
    const { t } = useTranslation();
    return (
        <section className="linkedin-card">
            <div className="card-header">
                <h3>{title}</h3>
                {isEditable && onEdit && (
                    <button className="icon-btn edit-pencil" onClick={onEdit} title={t('common.edit')}>
                        <Pencil size={20} />
                    </button>
                )}
            </div>
            <div className="card-content">
                {children}
            </div>
        </section>
    );
};

const DoctorProfile = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { actionLoading } = useSelector((state) => state.doctor);
    const isRtl = i18n.language === 'ar';
    
    const [isEditing, setIsEditing] = useState(false);
    const [editSection, setEditSection] = useState(null); // 'header', 'about', 'professional', 'contact'
    const [uploading, setUploading] = useState(false);
    
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        gender: user?.gender || 'male',
        specialization: user?.specialization || '',
        description: user?.description || '',
        academicDegrees: user?.academicDegrees || []
    });

    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const { posts, isLoading: isPostsLoading } = useSelector(state => state.post);

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.profile')));
        if (user?._id || user?.id) {
            dispatch(fetchDoctorPosts(user._id || user.id));
        }
    }, [dispatch, t, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // Filter out incomplete degrees before saving
        const cleanedDegrees = formData.academicDegrees.filter(degree => 
            degree.field.trim() !== '' && degree.institution.trim() !== ''
        );

        const dataToSave = {
            ...formData,
            academicDegrees: cleanedDegrees
        };

        const result = await dispatch(updateDoctorProfile({ 
            userId: user?._id || user?.id, 
            data: dataToSave 
        }));
        
        if (updateDoctorProfile.fulfilled.match(result)) {
            dispatch(updateUser(formData));
            setIsEditing(false);
            setEditSection(null);
            toast.success(t('common.update_success', { defaultValue: 'Profile updated successfully!' }));
        } else if (updateDoctorProfile.rejected.match(result)) {
            toast.error(result.payload || t('common.update_error', { defaultValue: 'Failed to update profile' }));
        }
    };

    const handleFileChange = async (e, uploadType) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await dispatch(uploadProfileImage({ 
                userId: user?._id || user?.id, 
                file, 
                uploadType 
            })).unwrap();
            
            toast.success(t('common.update_success', 'Image uploaded successfully!'));
            // Refresh after a short delay for GCS webhook
            setTimeout(() => {
                window.location.reload(); 
            }, 2000);
        } catch (error) {
            toast.error(error || t('common.update_error', 'Upload failed'));
        } finally {
            setUploading(false);
        }
    };

    const handleAddDegree = () => {
        setFormData(prev => ({
            ...prev,
            academicDegrees: [
                ...prev.academicDegrees,
                { degree: 'bachelor', field: '', institution: '', graduationYear: new Date().getFullYear() }
            ]
        }));
    };

    const handleRemoveDegree = (index) => {
        setFormData(prev => ({
            ...prev,
            academicDegrees: prev.academicDegrees.filter((_, i) => i !== index)
        }));
    };

    const handleDegreeChange = (index, field, value) => {
        const updatedDegrees = [...formData.academicDegrees];
        updatedDegrees[index] = { ...updatedDegrees[index], [field]: value };
        setFormData(prev => ({ ...prev, academicDegrees: updatedDegrees }));
    };

    const toggleEdit = (section = null) => {
        setEditSection(section);
        setIsEditing(!!section);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            className={`doctor-profile-redesign ${isRtl ? 'rtl' : ''}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="profile-layout-grid">
                {/* Main Column */}
                <div className="main-column">
                    {/* Header Card */}
                    <section className="linkedin-card header-card">
                        <div 
                            className="cover-photo" 
                            style={user?.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})`, backgroundSize: 'cover' } : {}}
                        >
                            <div className="overlay"></div>
                            <button 
                                className="edit-cover-btn" 
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Camera size={20} />
                            </button>
                            <input 
                                type="file" 
                                ref={coverInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'coverPhoto')}
                            />
                        </div>
                        <div className="header-content">
                            <div className="avatar-container">
                                <div className="avatar-circle">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <User size={80} />
                                        </div>
                                    )}
                                    <button 
                                        className="change-photo-btn"
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        <Camera size={20} />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={avatarInputRef} 
                                        style={{ display: 'none' }} 
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                    />
                                </div>
                            </div>
                            
                            <div className="identity-section">
                                <div className="top-row">
                                    <h1>{user?.username}</h1>
                                    <button className="icon-btn edit-main" onClick={() => toggleEdit('header')}>
                                        <Pencil size={20} />
                                    </button>
                                </div>
                                <p className="headline">{user?.specialization || t('doctor.specialty_placeholder', 'Medical Professional')}</p>
                                <div className="location-info">
                                    <span className="text-muted">{user?.country || 'Egypt'}</span>
                                    <span className="dot">•</span>
                                    <button className="contact-info-trigger" onClick={() => toggleEdit('contact')}>
                                        {t('doctor.contact_info', 'Contact info')}
                                    </button>
                                </div>
                                <div className="connection-count">
                                    <span className="count">500+</span>
                                    <span className="label text-muted">{t('doctor.connections', 'connections')}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Card */}
                    <ProfileCard 
                        title={t('doctor.about', 'About')} 
                        onEdit={() => toggleEdit('about')}
                    >
                        <p className="bio-text">
                            {user?.description || t('doctor.no_bio_yet', 'No bio provided yet. Add a short summary about your professional background.')}
                        </p>
                    </ProfileCard>

                    {/* Activity Card */}
                    <section className="linkedin-card activity-section">
                        <div className="card-header">
                            <div className="header-left">
                                <h3>{t('posts.activity', 'Activity')}</h3>
                                <span className="sub-header">502 {t('posts.followers', 'followers')}</span>
                            </div>
                            <button className="outline-btn" onClick={() => setIsCreatePostOpen(true)}>
                                {t('posts.create_post', 'Create a post')}
                            </button>
                        </div>
                        <div className="activity-tabs">
                            <button className="active">{t('posts.posts', 'Posts')}</button>
                            <button>{t('posts.comments', 'Comments')}</button>
                            <button>{t('posts.videos', 'Videos')}</button>
                        </div>
                        <div className="doctor-posts-feed">
                            {isPostsLoading ? (
                                <div className="loading-spinner"></div>
                            ) : posts.length > 0 ? (
                                posts.slice(0, 3).map(post => <PostCard key={post._id || post.id} post={post} />)
                            ) : (
                                <div className="no-activity">
                                    <MessageSquare size={48} />
                                    <p>{t('posts.no_posts_yet')}</p>
                                </div>
                            )}
                        </div>
                        <footer className="card-footer">
                            <button className="show-all-btn">
                                {t('common.show_all', 'Show all posts')} →
                            </button>
                        </footer>
                    </section>

                    {/* Professional Details Card */}
                    <ProfileCard 
                        title={t('doctor.professional_details', 'Professional')} 
                        onEdit={() => toggleEdit('professional')}
                    >
                        <div className="pro-info-grid">
                            <div className="info-row">
                                <Award className="icon text-muted" size={24} />
                                <div className="text">
                                    <h4>{t('doctor.specialty')}</h4>
                                    <p>{user?.specialization || '---'}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <ClipboardCheck className="icon text-muted" size={24} />
                                <div className="text">
                                    <h4>{t('doctor.kyc_status')}</h4>
                                    <p>{user?.documentation ? t('common.verified', 'Verified') : t('common.pending', 'Pending Verification')}</p>
                                </div>
                            </div>
                        </div>
                    </ProfileCard>

                    {/* Education Card */}
                    <ProfileCard 
                        title={t('doctor.education', 'Education')} 
                        onEdit={() => toggleEdit('professional')}
                    >
                        <div className="education-list">
                            {user?.academicDegrees?.length > 0 ? (
                                user.academicDegrees.map((edu, idx) => (
                                    <div key={idx} className="edu-item">
                                        <BookOpen className="edu-icon" size={32} />
                                        <div className="edu-info">
                                            <h4>{edu.institution}</h4>
                                            <p>{t(`doctor.degree_${edu.degree}`, edu.degree)} • {edu.field}</p>
                                            <span className="text-muted">{edu.graduationYear}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">{t('doctor.no_education_yet', 'No academic degrees listed.')}</p>
                            )}
                        </div>
                    </ProfileCard>
                </div>

                {/* Side Column */}
                <aside className="side-column">
                    <section className="linkedin-card language-card">
                        <div className="card-header">
                            <h3>{t('doctor.profile_language', 'Profile Language')}</h3>
                        </div>
                        <div className="card-content">
                            <p className="lang-status">{isRtl ? 'العربية' : 'English'}</p>
                        </div>
                    </section>

                    <section className="linkedin-card contact-card">
                        <div className="card-header">
                            <h3>{t('auth.section_location')}</h3>
                            <button className="icon-btn" onClick={() => toggleEdit('contact')}><Pencil size={18} /></button>
                        </div>
                        <div className="card-content contact-list">
                            <div className="contact-item">
                                <Mail size={18} className="text-muted" />
                                <span>{user?.email?.address || user?.email}</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={18} className="text-muted" />
                                <span>{user?.phone || '---'}</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={18} className="text-muted" />
                                <span>{user?.Address || '---'}</span>
                            </div>

                        </div>
                    </section>
                </aside>
            </div>

            {/* Edit Modal / Section Overlay */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        className="edit-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="edit-modal"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h3>{t('common.edit')} {editSection}</h3>
                                <button className="close-btn" onClick={() => toggleEdit(null)}><X size={24} /></button>
                            </div>
                            <div className="modal-body">
                                {editSection === 'header' && (
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>{t('doctor.specialty')}</label>
                                            <input name="specialization" value={formData.specialization} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                )}
                                {editSection === 'about' && (
                                    <div className="form-group">
                                        <label>{t('doctor.bio')}</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" />
                                    </div>
                                )}
                                {editSection === 'contact' && (
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>{t('auth.phone_label')}</label>
                                            <input name="phone" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('auth.gender_label')}</label>
                                            <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                                <option value="male">{t('auth.gender_male')}</option>
                                                <option value="female">{t('auth.gender_female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {editSection === 'professional' && (
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>{t('doctor.specialty')}</label>
                                            <input name="specialization" value={formData.specialization} onChange={handleInputChange} />
                                        </div>
                                        
                                        <div className="degrees-editor full-width">
                                            <div className="editor-header">
                                                <label>{t('doctor.education')}</label>
                                                <button className="add-btn" onClick={handleAddDegree}>
                                                    <Plus size={16} /> {t('common.add')}
                                                </button>
                                            </div>
                                            {formData.academicDegrees.map((edu, idx) => (
                                                <div key={idx} className="degree-row">
                                                    <div className="row-inputs">
                                                        <select 
                                                            value={edu.degree} 
                                                            onChange={(e) => handleDegreeChange(idx, 'degree', e.target.value)}
                                                        >
                                                            <option value="bachelor">Bachelor</option>
                                                            <option value="master">Master</option>
                                                            <option value="phd">PhD</option>
                                                            <option value="diploma">Diploma</option>
                                                            <option value="associate">Associate</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                        <input 
                                                            placeholder="Field of study" 
                                                            value={edu.field} 
                                                            onChange={(e) => handleDegreeChange(idx, 'field', e.target.value)} 
                                                        />
                                                        <input 
                                                            placeholder="Institution" 
                                                            value={edu.institution} 
                                                            onChange={(e) => handleDegreeChange(idx, 'institution', e.target.value)} 
                                                        />
                                                        <input 
                                                            type="number" 
                                                            placeholder="Year" 
                                                            value={edu.graduationYear} 
                                                            onChange={(e) => handleDegreeChange(idx, 'graduationYear', e.target.value)} 
                                                        />
                                                    </div>
                                                    <button className="remove-btn" onClick={() => handleRemoveDegree(idx)}>
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="save-btn" onClick={handleSave} disabled={actionLoading}>
                                    {actionLoading ? t('common.loading') : t('common.save_changes')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CreatePostModal 
                isOpen={isCreatePostOpen} 
                onClose={() => setIsCreatePostOpen(false)} 
            />
        </motion.div>
    );
};

export default DoctorProfile;
