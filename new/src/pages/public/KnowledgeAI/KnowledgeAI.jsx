import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { searchKnowledge } from '../stores/knowledgeService';
import { addUserMessage, addAiMessage } from '../stores/knowledgeSlice';
import { setHeaderTitle } from '../../Doctor/stores/doctorSlice';
import './KnowledgeAI.scss';
import { Send, Stethoscope } from 'lucide-react';

const KnowledgeAI = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { chatHistory, isLoading } = useSelector((state) => state.knowledge);
    const [query, setQuery] = useState('');
    const messagesAreaRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTo({
                top: messagesAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(setHeaderTitle(t('nav.knowledge_ai', { defaultValue: 'Knowledge AI' })));
    }, [dispatch, t]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const currentQuery = query.trim();
        setQuery('');

        // 1. Add User Message
        dispatch(addUserMessage(currentQuery));

        // 2. Perform Search
        const resultAction = await dispatch(searchKnowledge({ query: currentQuery, lang: i18n.language }));

        if (searchKnowledge.fulfilled.match(resultAction)) {
            const results = resultAction.payload.results;

            // 3. Add AI Response
            let aiResponseText = t('knowledge.found_results', 'لقد وجدت بعض المعلومات المتعلقة ببحثك:');
            if (results.length === 0) {
                aiResponseText = t('knowledge.no_results', 'عذراً، لم أجد معلومات واضحة حول هذا الموضوع في قاعدة بياناتي حالياً.');
            }

            dispatch(addAiMessage({
                text: aiResponseText,
                results: results
            }));
        } else {
            dispatch(addAiMessage({
                text: t('knowledge.error', 'حدث خطأ أثناء محاولة البحث. يرجى المحاولة مرة أخرى.'),
                results: []
            }));
        }
    };

    return (
        <div className="knowledge-ai-page">
            <div className="knowledge-container">
                <div className="chat-header">
                    <div className="ai-icon">
                        <Stethoscope size={26} />
                    </div>
                    <div className="header-info">
                        <h2>{t('knowledge.title', 'المساعد الطبي الذكي')}</h2>
                        <p className="status-line">
                            <span className="status-dot" />
                            {t('knowledge.status', 'متاح لمساعدتك 24/7')}
                        </p>
                    </div>
                </div>

                <div ref={messagesAreaRef} className="messages-area">
                    {chatHistory.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <div className="msg-bubble">
                                {msg.text === 'WELCOME_KEY' ? t('knowledge.welcome_message') : msg.text}

                                {msg.results && msg.results.length > 0 && (
                                    <div className="results-grid">
                                        {msg.results.map((res, idx) => (
                                            <div key={idx} className="result-card">
                                                <span className="source-tag">{res.source}</span>
                                                <h4>{res.title}</h4>
                                                <p>{res.content}</p>
                                                {res.externalLink && (
                                                    <a href={res.externalLink} target="_blank" rel="noopener noreferrer" className="view-more">
                                                        {t('knowledge.read_more', 'اقرأ المزيد')} →
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai">
                            <div className="msg-bubble flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                </div>

                <form className="chat-input-area" onSubmit={handleSearch}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder={t('knowledge.input_placeholder', 'اسأل عن دواء، مرض، أو نصيحة طبية...')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            className="send-btn" disabled={isLoading || !query.trim()}>
                            <Send size={18} />
                            <span>{t('medical_ai.chat.send')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KnowledgeAI;
