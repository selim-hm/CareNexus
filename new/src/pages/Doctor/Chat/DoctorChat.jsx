import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchConversations } from '../stores/doctorService';
import { setHeaderTitle } from '../stores/doctorSlice';
import { Send, Phone, Video, Search, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../utils/axiosInstance';
import Loader from '../../../components/loader/Loader';
import './DoctorChat.scss';

const formatTimeAgo = (date) => {
    const diff = new Date() - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
};

const DoctorChat = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { conversations, loading, error } = useSelector(state => state.doctor);
    const { user } = useSelector(state => state.auth);

    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(setHeaderTitle(t('nav.chat', { defaultValue: 'Messages' })));
        dispatch(fetchConversations());
    }, [dispatch, t]);

    useEffect(() => {
        if (activeChat) {
            loadMessages(activeChat.partner._id);
        }
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async (userId) => {
        setChatLoading(true);
        try {
            const res = await axiosInstance.get(`/chat/messages/${userId}`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (err) {
            console.error("Failed to load messages", err);
        } finally {
            setChatLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const messageData = {
            to: activeChat.partner._id,
            message: newMessage,
            orderId: activeChat.order._id
        };

        const tempMessage = {
            _id: Date.now().toString(),
            from: user,
            to: activeChat.partner,
            message: newMessage,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        try {
            const res = await axiosInstance.post('/chat/send', messageData);
            if (res.data.success) {
                // Optionally update the temp message with real ID from server
            }
        } catch (err) {
            console.error("Failed to send message", err);
            // Optionally remove temp message or show error mark
        }
    };

    if (loading && conversations.length === 0) return <Loader loading={true} />;

    return (
        <div className="doctor-chat-page">
            <div className="chat-layout">
                {/* Sidebar */}
                <div className="chat-sidebar">
                    <div className="sidebar-header">
                        <div className="search-bar">
                            <Search size={18} />
                            <input type="text" placeholder={t('common.search', { defaultValue: 'Search...' })} />
                        </div>
                    </div>
                    
                    <div className="conversations-list">
                        {error && <div className="error-message">{error}</div>}
                        {conversations.length === 0 && !loading && (
                            <div className="empty-conversations">
                                <MessageSquare size={32} />
                                <p>{t('doctor.no_conversations', { defaultValue: 'No active conversations' })}</p>
                            </div>
                        )}
                        {conversations.map((conv) => (
                            <div 
                                key={conv.partner._id} 
                                className={`conversation-item ${activeChat?.partner._id === conv.partner._id ? 'active' : ''}`}
                                onClick={() => setActiveChat(conv)}
                            >
                                <div className="avatar">
                                    {conv.partner.avatar ? (
                                        <img src={conv.partner.avatar} alt="Avatar" />
                                    ) : (
                                        <div className="avatar-placeholder">{conv.partner.username?.charAt(0).toUpperCase()}</div>
                                    )}
                                </div>
                                <div className="conv-details">
                                    <div className="conv-header">
                                        <h4>{conv.partner.username}</h4>
                                        <span className="time">{formatTimeAgo(conv.lastMessageAt)}</span>
                                    </div>
                                    <div className="conv-footer">
                                        <p className="last-message">{conv.lastMessage}</p>
                                        {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="chat-main">
                    {activeChat ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-partner-info">
                                    <div className="avatar">
                                        {activeChat.partner.avatar ? (
                                            <img src={activeChat.partner.avatar} alt="Avatar" />
                                        ) : (
                                            <div className="avatar-placeholder">{activeChat.partner.username?.charAt(0).toUpperCase()}</div>
                                        )}
                                    </div>
                                    <div className="details">
                                        <h3>{activeChat.partner.username}</h3>
                                        <span className="order-context">
                                            {t(`medical_service.${activeChat.order?.medicalServiceType}`, { defaultValue: activeChat.order?.medicalServiceType })}
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-actions">
                                    <button className="action-btn"><Phone size={20} /></button>
                                    <button className="action-btn"><Video size={20} /></button>
                                </div>
                            </div>

                            <div className="messages-area">
                                {chatLoading ? (
                                    <Loader loading={true} />
                                ) : (
                                    messages.map((msg, idx) => {
                                        const currentUserId = user?._id || user?.id;
                                        const isMe = msg.from._id === currentUserId || msg.from === currentUserId;
                                        return (
                                            <motion.div 
                                                key={msg._id || idx} 
                                                className={`message-wrapper ${isMe ? 'sent' : 'received'}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="message-content">
                                                    <p>{msg.message}</p>
                                                    <span className="timestamp">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-input-area">
                                <form onSubmit={handleSendMessage}>
                                    <input 
                                        type="text" 
                                        placeholder={t('chat.type_message', { defaultValue: 'Type your message...' })}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" disabled={!newMessage.trim()} className="send-btn">
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <MessageSquare size={64} />
                            <h3>{t('doctor.select_conversation', { defaultValue: 'Select a conversation' })}</h3>
                            <p>{t('doctor.select_conversation_desc', { defaultValue: 'Choose a patient from the sidebar to view your message history and continue chatting.' })}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorChat;
