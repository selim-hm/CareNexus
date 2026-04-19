import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
    fetchGlobalFeed, 
    fetchCategories,
    resetPostState 
} from '../stores/postSlice';
import { setHeaderTitle } from '../stores/doctorSlice';
import { 
    User, 
    Image, 
    Video, 
    Calendar, 
    Newspaper,
    Search,
    TrendingUp,
    MessageSquare,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../../../components/PostCard/PostCard';
import CreatePostModal from '../../../components/CreatePostModal/CreatePostModal';
import './DoctorFeed.scss';

const DoctorFeed = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { globalPosts, categories, isLoading, totalPages, currentPage } = useSelector((state) => state.post);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.feed')));
        dispatch(fetchGlobalFeed(1));
        dispatch(fetchCategories());
        
        return () => {
            dispatch(resetPostState());
        };
    }, [dispatch, t]);

    const loadMore = () => {
        if (currentPage < totalPages) {
            dispatch(fetchGlobalFeed(currentPage + 1));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.1 } 
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className={`doctor-feed-container ${isRtl ? 'rtl' : ''}`}>
            <div className="feed-layout">
                {/* Left Sidebar: User Summary */}
                <aside className="feed-sidebar-left">
                    <div className="categories-card floating-card">
                        <h4>{t('posts.recent_tags', 'Recent Tags')}</h4>
                        <div className="tags-list">
                            {categories.slice(0, 5).map(cat => (
                                <div key={cat._id || cat.id} className="tag-item">
                                    <span className="hash">#</span>
                                    <span>{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content: Feed */}
                <main className="feed-main-content">
                    {/* Start Post Banner */}
                    <div className="start-post-card floating-card">
                        <div className="input-row">
                            <img src={user?.avatar || 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png'} alt="user" className="mini-avatar" />
                            <button className="trigger-btn" onClick={() => setIsCreatePostOpen(true)}>
                                {t('posts.start_post_placeholder', 'Start a post...')}
                            </button>
                        </div>
                        <div className="action-row">
                            <button className="feed-action-btn" onClick={() => setIsCreatePostOpen(true)}>
                                <Image size={20} color="#378fe9" />
                                <span>{t('posts.photo', 'Photo')}</span>
                            </button>
                            <button className="feed-action-btn" onClick={() => setIsCreatePostOpen(true)}>
                                <Video size={20} color="#5f9b41" />
                                <span>{t('posts.video', 'Video')}</span>
                            </button>
                            <button className="feed-action-btn" onClick={() => setIsCreatePostOpen(true)}>
                                <Calendar size={20} color="#c37d16" />
                                <span>{t('posts.event', 'Event')}</span>
                            </button>
                            <button className="feed-action-btn" onClick={() => setIsCreatePostOpen(true)}>
                                <Newspaper size={20} color="#e16745" />
                                <span>{t('posts.article', 'Write article')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="feed-divider">
                        <hr />
                        <span>{t('posts.sort_by', 'Sort by')}: <b>{t('posts.recent', 'Recent')}</b></span>
                    </div>

                    {/* Posts List */}
                    <motion.div 
                        className="posts-list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {globalPosts.length > 0 ? (
                            globalPosts.map(post => (
                                <motion.div key={post._id || post.id} variants={itemVariants}>
                                    <PostCard post={post} />
                                </motion.div>
                            ))
                        ) : !isLoading && (
                            <div className="empty-feed">
                                <MessageSquare size={64} />
                                <h3>{t('posts.empty_feed', 'No posts available yet.')}</h3>
                                <p>{t('posts.empty_feed_hint', 'Be the first to share something with the community!')}</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="feed-loader">
                                <div className="spinner"></div>
                            </div>
                        )}

                        {currentPage < totalPages && !isLoading && (
                            <button className="load-more-btn" onClick={loadMore}>
                                {t('common.load_more', 'Load More')}
                            </button>
                        )}
                    </motion.div>
                </main>

                {/* Right Sidebar: Trends/Suggestions */}
                <aside className="feed-sidebar-right">
                    <div className="trending-card floating-card">
                        <div className="header">
                            <h4>{t('posts.trending_now', 'Trending Now')}</h4>
                            <TrendingUp size={18} />
                        </div>
                        <div className="trending-list">
                            <div className="trend-item">
                                <p className="trend-topic">#MedicalAI</p>
                                <span className="trend-meta">1.2k posts</span>
                            </div>
                            <div className="trend-item">
                                <p className="trend-topic">#Healthcare2026</p>
                                <span className="trend-meta">850 posts</span>
                            </div>
                            <div className="trend-item">
                                <p className="trend-topic">#DoctorTips</p>
                                <span className="trend-meta">620 posts</span>
                            </div>
                        </div>
                        <button className="view-all-btn">{t('common.view_all', 'View all')}</button>
                    </div>
                </aside>
            </div>

            <CreatePostModal 
                isOpen={isCreatePostOpen} 
                onClose={() => setIsCreatePostOpen(false)} 
            />
        </div>
    );
};

export default DoctorFeed;
