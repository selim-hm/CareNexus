import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
    fetchPostDetails, 
    fetchComments, 
    requestAddComment,
    resetPostState 
} from '../stores/postSlice';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import PostCard from '../../../components/PostCard/PostCard';
import CommentItem from '../../../components/CommentItem/CommentItem';
import { setHeaderTitle } from '../stores/doctorSlice';
import { motion } from 'framer-motion';
import './PostDetail.scss';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const { currentPost, comments, isLoading, isCommentLoading, user: authUser } = useSelector(state => ({
        ...state.post,
        user: state.auth.user
    }));

    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        dispatch(setHeaderTitle(t('posts.post_details', 'Post Details')));
        if (id) {
            dispatch(fetchPostDetails(id));
            dispatch(fetchComments(id));
        }

        return () => {
            // We might not want to reset the whole state if it affects the feed, 
            // but resetting currentPost and comments is good.
            // dispatch(resetPostState()); 
        };
    }, [dispatch, id, t]);

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        dispatch(requestAddComment({ 
            postId: id, 
            commentData: { text: commentText } 
        }));
        setCommentText('');
    };

    const handleReply = (parentCommentId, text) => {
        dispatch(requestAddComment({ 
            postId: id, 
            commentData: { text, parentComment: parentCommentId } 
        }));
    };

    if (isLoading && !currentPost) {
        return (
            <div className="post-detail-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!currentPost && !isLoading) {
        return (
            <div className="post-detail-error">
                <p>{t('errors.action_failed', 'Post not found')}</p>
                <button onClick={() => navigate(-1)}>{t('common.back', 'Back')}</button>
            </div>
        );
    }

    return (
        <motion.div 
            className={`post-detail-container ${isRtl ? 'rtl' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    <span>{t('common.back', 'Back')}</span>
                </button>
            </div>

            <div className="detail-content">
                {currentPost && <PostCard post={currentPost} />}

                <div className="comments-section-full">
                    <h3 className="section-title">
                        {t('posts.comments', 'Comments')} 
                        <span className="count">({comments.length})</span>
                    </h3>

                    <div className="main-comment-input">
                        <img 
                            src={authUser?.avatar || 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png'} 
                            alt="me" 
                            className="mini-avatar" 
                        />
                        <div className="input-box">
                            <textarea 
                                placeholder={t('posts.add_comment', 'Add a comment...')}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button 
                                className="send-btn" 
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="comments-list">
                        {isCommentLoading && comments.length === 0 ? (
                            <div className="loading-text">{t('posts.loading_comments', 'Loading comments...')}</div>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <CommentItem 
                                    key={comment._id || comment.id} 
                                    comment={comment} 
                                    onReply={handleReply} 
                                />
                            ))
                        ) : (
                            <div className="empty-comments">
                                <MessageSquare size={48} />
                                <p>{t('posts.empty_feed_hint', 'Be the first to comment!')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostDetail;
