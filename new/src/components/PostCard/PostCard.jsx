import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
    ThumbsUp, 
    MessageCircle, 
    Share2, 
    MoreHorizontal, 
    Send,
    User,
    Clock,
    Heart
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toggleLike } from '../../pages/Doctor/stores/postSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './PostCard.scss';

const PostCard = ({ post }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: authUser } = useSelector(state => state.auth);
    
    const isLiked = post.like.includes(authUser?._id || authUser?.id);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    
    const TRUNCATE_LIMIT = 180;
    const isLongDescription = (post.description || '').length > TRUNCATE_LIMIT;
    const displayDescription = isExpanded ? post.description : (post.description || '').substring(0, TRUNCATE_LIMIT) + (isLongDescription ? '...' : '');

    const handleLike = () => {
        dispatch(toggleLike({ postId: post._id || post.id, isLiked }));
    };

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.description,
            url: `${window.location.origin}/doctor/feed/post/${post._id || post.id}`
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success(t('posts.shared_success', 'Shared successfully!'));
            } else {
                await navigator.clipboard.writeText(shareData.url);
                toast.success(t('posts.link_copied', 'Link copied to clipboard!'));
            }
        } catch (err) {
            console.error('Share failed:', err);
            if (err.name !== 'AbortError') {
                toast.error(t('posts.share_failed', 'Failed to share post'));
            }
        }
    };

    const navigateToDetail = () => {
        navigate(`/doctor/feed/post/${post._id || post.id}`);
    };

    const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '';

    return (
        <div className={`post-card ${i18n.language === 'ar' ? 'rtl' : ''}`}>
            <div className="post-header">
                <div className="author-info" onClick={navigateToDetail} style={{ cursor: 'pointer' }}>
                    <div className="author-avatar">
                        {post.user?.avatar ? (
                            <img src={post.user.avatar} alt="Avatar" />
                        ) : (
                            <User size={24} />
                        )}
                    </div>
                    <div className="author-meta">
                        <h4 className="author-name">{post.user?.username || 'User'}</h4>
                        <div className="post-time">
                            <Clock size={12} />
                            <span>{timeAgo}</span>
                            <span className="dot">•</span>
                            <span className="category-tag">{post.category}</span>
                        </div>
                    </div>
                </div>
                <button className="more-btn">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="post-content" onClick={navigateToDetail} style={{ cursor: 'pointer' }}>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">
                    {displayDescription}
                    {isLongDescription && !isExpanded && (
                        <button 
                            className="see-more-btn" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(true);
                            }}
                        >
                            {t('posts.see_more', '(see more)')}
                        </button>
                    )}
                </p>
                
                {post.media && post.media.length > 0 && (
                    <div className={`post-media grid-${Math.min(post.media.length, 3)}`}>
                        {post.media.map((item, idx) => (
                            <div key={idx} className="media-item">
                                {item.resourceType === 'video' ? (
                                    <video src={item.url} controls />
                                ) : (
                                    <img src={item.url} alt="Post media" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="post-stats">
                <div className="stat-item">
                    <div className="icon-group">
                        <Heart size={14} fill={post.like.length > 0 ? "#df4d4d" : "none"} color={post.like.length > 0 ? "#df4d4d" : "#666"} />
                    </div>
                    <span>{post.like.length} {t('posts.likes', 'Likes')}</span>
                </div>
                <div className="stat-item">
                    <span>{post.comments?.length || 0} {t('posts.comments_count', 'Comments')}</span>
                </div>
            </div>

            <div className="post-actions">
                <button 
                    className={`action-btn ${isLiked ? 'liked' : ''}`} 
                    onClick={handleLike}
                >
                    <ThumbsUp size={20} />
                    <span>{isLiked ? t('posts.liked', 'Liked') : t('posts.like', 'Like')}</span>
                </button>
                
                {post.allowComments !== false && (
                    <button className="action-btn" onClick={navigateToDetail}>
                        <MessageCircle size={20} />
                        <span>{t('posts.comment', 'Comment')}</span>
                    </button>
                )}
                
                <button className="action-btn" onClick={handleShare}>
                    <Share2 size={20} />
                    <span>{t('posts.share', 'Share')}</span>
                </button>
            </div>

            {showComments && post.allowComments !== false && (
                <div className="comments-section">
                    <div className="comment-input-wrapper">
                        <img src={authUser?.avatar || 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png'} alt="user" className="mini-avatar" />
                        <div className="input-group">
                            <input type="text" placeholder={t('posts.write_comment', 'Add a comment...')} />
                            <button className="send-btn"><Send size={18} /></button>
                        </div>
                    </div>
                    {/* Comments list would go here */}
                </div>
            )}
        </div>
    );
};

export default PostCard;
