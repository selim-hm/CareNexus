import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addMessage, setTyping } from '../../../store/slices/aiChatSlice';
import { GeminiAPI } from '../../../utils/gemini';
import Message from '../Message/Message';
import { Send, MessageSquare, Image as ImageIcon } from 'lucide-react';
import './ChatInterface.scss';

const ChatInterface = () => {
  const { t } = useTranslation();
  const [inputMessage, setInputMessage] = useState('');
  const dispatch = useDispatch();
  const { messages, isTyping, imageContext } = useSelector((state) => state.aiChat);
  const language = useSelector((state) => state.aiApp.language);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));
    setInputMessage('');
    dispatch(setTyping(true));

    try {
      const response = await GeminiAPI.sendMessage(inputMessage, imageContext);

      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(aiMessage));
    } catch (error) {
      console.error('Chat error:', error);
      const aiMessage = {
        id: Date.now() + 1,
        text: t('medical_ai.chat.error'),
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(aiMessage));
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface-card">
      <div className="chat-header">
        <div className="header-title">
          <MessageSquare size={20} className="icon-blue" />
          <h2>{t('medical_ai.chat.header')}</h2>
        </div>
        {imageContext.hasContext && (
          <div className="context-badge">
            <ImageIcon size={14} />
            <span>{t('medical_ai.chat.context_active')}</span>
          </div>
        )}
      </div>

      <div ref={chatContainerRef} className="chat-messages">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="typing-indicator-container">
            <div className="ai-bubble typing">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">
                {t('medical_ai.chat.typing')}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t('medical_ai.chat.input_placeholder')}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="send-btn"
        >
          <Send size={18} />
          <span>{t('medical_ai.chat.send')}</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
