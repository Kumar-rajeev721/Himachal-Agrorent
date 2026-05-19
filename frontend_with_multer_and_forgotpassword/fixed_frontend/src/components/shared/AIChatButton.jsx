import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import sproutChatIcon from '../../assets/sprout-chat.svg';

export default function AIChatButton() {
  const { user } = useAuth();

  const getChatLink = () => {
    if (!user) return '/login';
    return '/chatbot';
  };

  const label = user ? 'Open AI assistant' : 'Login to use AI assistant';

  return (
    <Link
      to={getChatLink()}
      className="ai-chat-fab"
      aria-label={label}
      title={label}
    >
      <img src={sproutChatIcon} alt="" className="ai-chat-fab__icon" />
    </Link>
  );
}
