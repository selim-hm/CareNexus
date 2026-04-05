import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, Reply } from 'lucide-react';
import './CommentItem.scss';

const CommentItem = ({ comment, onReply, depth = 0 }) => {
    const { t, i18n } = useTranslation();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const isRtl = i18n.language === 'ar';

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        onReply(comment._id || comment.id, replyText);
        setReplyText('');
        setIsReplying(false);
    };

    const timeAgo = comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : '';

    return (
        <div className={`comment-item ${isRtl ? 'rtl' : ''} depth-${depth}`}>
            <div className="comment-main">
                <img 
                    src={comment.user?.avatar || 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png'} 
                    alt="user" 
                    className="comment-avatar" 
                />
                <div className="comment-content-wrapper">
                    <div className="comment-bubble">
                        <div className="comment-header">
                            <span className="user-name">{comment.user?.username || 'User'}</span>
                            <span className="comment-date">{timeAgo}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                    </div>
                    <div className="comment-actions">
                        <button className="action-btn">{t('posts.like', 'Like')}</button>
                        <span className="divider">|</span>
                        <button 
                            className="action-btn"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            {t('posts.reply', 'Reply')}
                        </button>
                    </div>
                </div>
            </div>

            {isReplying && (
                <div className="reply-input-wrapper">
                    <input 
                        type="text" 
                        placeholder={t('posts.write_reply', 'Write a reply...')}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit()}
                    />
                    <button onClick={handleReplySubmit} disabled={!replyText.trim()}>
                        {t('posts.post_button', 'Post')}
                    </button>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    {comment.replies.map(reply => (
                        <CommentItem 
                            key={reply._id || reply.id} 
                            comment={reply} 
                            onReply={onReply} 
                            depth={depth + 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
