import React, { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../utils/api';

/**
 * Extract the AI reply text from the backend response.
 * Backend returns: { success: true, message: "Content Generated", data: "<ai text>" }
 */
const getBotReply = (responseData, fallbackPrompt) => {
  // responseData is the axios response.data object
  const aiText = responseData?.data;
  if (typeof aiText === 'string' && aiText.trim()) {
    return aiText.trim();
  }
  // Fallback to local replies if AI text is missing
  return getLocalReply(fallbackPrompt);
};

const getLocalReply = (text) => {
  const query = (text || '').toLowerCase();

  if (query.includes('district') && query.includes('himachal')) {
    return 'Himachal Pradesh has 12 districts: Bilaspur, Chamba, Hamirpur, Kangra, Kinnaur, Kullu, Lahaul and Spiti, Mandi, Shimla, Sirmaur, Solan, and Una.';
  }
  if (query.includes('state') && query.includes('india')) {
    return 'India has 28 states and 8 Union Territories.';
  }
  if (query.includes('how many') && query.includes('crop') && query.includes('himachal')) {
    return 'Himachal Pradesh grows many kinds of crops including cereals (wheat, maize, barley, rice), pulses (rajma, peas), vegetables (potato, cabbage, cauliflower, tomato, capsicum), and fruit crops (apple, pear, peach, plum, apricot, cherry).';
  }
  if (query.includes('winter') || query.includes('himachal')) {
    return 'For winter in Himachal Pradesh, good crop options include wheat, barley, peas, mustard, garlic, onion, cabbage, cauliflower, spinach, radish, carrot, and potato in suitable areas.';
  }
  if (query.includes('season')) {
    return 'Crop choice usually follows the season: Kharif crops grow during monsoon, Rabi crops grow in winter, and Zaid crops grow in the short summer window.';
  }
  return 'Choose crops based on your location, season, irrigation, soil type, and expected market price. For Himachal Pradesh, vegetables, cereals, pulses, and fruits all work well depending on altitude and climate.';
};

const getFriendlyError = (err) => {
  const rawMessage = err.response?.data?.message || err.message || '';
  const normalizedMessage = rawMessage.toLowerCase();

  if (err.code === 'ECONNABORTED' || normalizedMessage.includes('timeout')) {
    return '⏱ Request timed out. The AI is taking too long — please try again.';
  }

  if (err.response?.status === 429) {
    return '⚠️ AI quota exceeded. Please wait a moment and try again.';
  }

  if (!err.response) {
    return '🔌 Cannot reach the server. Make sure the backend is running on port 5000.';
  }

  if (
    normalizedMessage.includes('gemini') ||
    normalizedMessage.includes('generative') ||
    normalizedMessage.includes('generatecontent') ||
    normalizedMessage.includes('models/') ||
    normalizedMessage.includes('listmodels')
  ) {
    return '⚠️ AI service is currently unavailable because the backend Gemini model needs updating. Showing a local fallback answer for now.';
  }

  return '❌ Something went wrong. Showing a local fallback answer.';
};

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your Himachal Agrorent AI assistant. Ask me anything about farming, crops, seasons, or land leasing.' },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setError('');
    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage({ prompt: trimmed });
      const botText = getBotReply(response.data, trimmed);
      setMessages([...nextMessages, { role: 'bot', text: botText }]);
    } catch (err) {
      setError(getFriendlyError(err));

      // Always show a local reply even on error
      setMessages([...nextMessages, { role: 'bot', text: getLocalReply(trimmed) }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-chat-dots-fill me-2"></i>Chatbot
          </h2>
          <p className="mb-0 opacity-75">Ask questions and get help from the AI assistant</p>
        </div>
      </div>

      <div className="container py-4">
        {error && (
          <div className="alert alert-warning alert-dismissible mb-3" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
          </div>
        )}

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-1">AI Assistant</h5>
                <div className="text-muted small">Powered by Google Gemini</div>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle">Online</span>
            </div>

            <div
              className="p-4 bg-light"
              style={{ minHeight: 420, maxHeight: 520, overflowY: 'auto' }}
            >
              {messages.map((item, index) => {
                const isUser = item.role === 'user';
                return (
                  <div
                    key={index}
                    className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      className={`px-3 py-2 shadow-sm ${isUser ? 'bg-primary text-white' : 'bg-white text-dark border'}`}
                      style={{ maxWidth: '75%', borderRadius: 8, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="d-flex justify-content-start">
                  <div className="px-3 py-2 bg-white border shadow-sm" style={{ borderRadius: 8 }}>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-top">
              <div className="input-group">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <button
                  className="btn btn-primary fw-semibold"
                  type="submit"
                  disabled={loading || !message.trim()}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                    : <><i className="bi bi-send-fill me-2"></i>Send</>
                  }
                </button>
              </div>
              {loading && (
                <div className="text-muted small mt-1">
                  <i className="bi bi-info-circle me-1"></i>
                  AI may take up to 30 seconds to respond...
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
