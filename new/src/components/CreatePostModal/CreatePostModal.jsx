import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { X, Image as ImageIcon, Video, FileText, Smile, XCircle } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { requestCreatePost, fetchCategories } from '../../pages/Doctor/stores/postSlice';
import './CreatePostModal.scss';

const CreatePostModal = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    
    const { user } = useSelector(state => state.auth);
    const { categories, isLoading } = useSelector(state => state.post);

    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [files, setFiles] = useState([]);
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [isOpen, categories.length, dispatch]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleEmojiClick = (emojiObject) => {
        setText(prev => prev + emojiObject.emoji);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 5) {
            alert(t('posts.max_files_error', 'Maximum 5 files allowed'));
            return;
        }
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !text.trim() || !category) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', text);
        formData.append('category', category);
        formData.append('allowComments', allowComments);

        files.forEach(file => {
            formData.append('media', file);
        });

        const resultAction = await dispatch(requestCreatePost(formData));
        if (requestCreatePost.fulfilled.match(resultAction)) {
            // Reset form and close
            setText('');
            setTitle('');
            setCategory('');
            setFiles([]);
            setAllowComments(true);
            onClose();
        }
    };

    return (
        <div className="create-post-overlay">
            <div className={`create-post-modal ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
                <div className="modal-header">
                    <h3>{t('posts.create_post', 'Create a post')}</h3>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="modal-body">
                    <div className="author-info">
                        <img src={user?.avatar || 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png'} alt="author" className="author-avatar" />
                        <div className="author-details">
                            <span className="author-name">{user?.username}</span>
                            <span className="author-visibility">Anyone</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="post-form">
                        <input
                            type="text"
                            placeholder={t('posts.title_placeholder', 'Post Title...')}
                            className="post-title-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <select 
                            className="post-category-select" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="" disabled>{t('posts.select_category', 'Select Category...')}</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.text}>{cat.text}</option>
                            ))}
                        </select>

                        <div className="post-textarea-container">
                            <textarea
                                placeholder={t('posts.what_do_you_want_to_talk_about', 'What do you want to talk about?')}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="post-textarea"
                                required
                            />
                            
                            {showEmojiPicker && (
                                <div className="emoji-picker-container" ref={emojiPickerRef}>
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>

                        {files.length > 0 && (
                            <div className="files-preview">
                                {files.map((file, idx) => (
                                    <div key={idx} className="file-preview-item">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt="preview" />
                                        ) : (
                                            <div className="file-icon"><FileText size={32} /></div>
                                        )}
                                        <button type="button" onClick={() => removeFile(idx)} className="remove-file-btn">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="modal-footer">
                            <div className="attachment-tools">
                                <button type="button" className="tool-btn" onClick={() => fileInputRef.current.click()}>
                                    <ImageIcon size={20} />
                                </button>
                                <button type="button" className="tool-btn" onClick={() => fileInputRef.current.click()}>
                                    <Video size={20} />
                                </button>
                                <button type="button" className="tool-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <Smile size={20} />
                                </button>
                                <input 
                                    type="file" 
                                    multiple 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none' }} 
                                    accept="image/*,video/*,application/pdf"
                                />
                            </div>

                            <div className="right-tools">
                                <label className="comments-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={allowComments} 
                                        onChange={(e) => setAllowComments(e.target.checked)} 
                                    />
                                    <span className="toggle-label">{t('posts.allow_comments', 'Allow Comments')}</span>
                                </label>

                                <button 
                                    type="submit" 
                                    className="post-submit-btn"
                                    disabled={!text.trim() || !title.trim() || !category || isLoading}
                                >
                                    {isLoading ? t('common.loading', 'Loading...') : t('posts.post_btn', 'Post')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
