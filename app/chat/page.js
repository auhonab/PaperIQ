'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaperIQ } from '../layout';
import { MessageSquare, Send, User, Bot, AlertTriangle, Sparkles } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b1120 !important; overflow: hidden; }

  .chat-root {
    height: 100vh;
    background: #0b1120;
    font-family: 'DM Sans', sans-serif;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
  }

  /* NAV */
  .chat-nav {
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(11,17,32,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    z-index: 100;
  }
  .chat-nav-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px; color: #fff;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .chat-nav-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .chat-nav-links { display: flex; gap: 32px; list-style: none; }
  .chat-nav-links a { font-size: 14px; color: #6b7280; text-decoration: none; transition: color 0.2s; }
  .chat-nav-links a:hover { color: #fff; }
  .chat-nav-links a.active { color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 2px; }
  .chat-nav-user {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 14px 6px 8px;
    background: rgba(0,255,136,0.08);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 100px; cursor: pointer;
  }
  .chat-nav-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #00ff88, #2a7fff);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #000;
  }
  .chat-nav-user span { font-size: 13px; color: #e0e0e0; font-weight: 600; }

  /* CHAT LAYOUT */
  .chat-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 860px;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding: 0 24px;
  }

  /* CHAT HEADER */
  .chat-header {
    flex-shrink: 0;
    padding: 22px 0 18px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .chat-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .chat-header h1 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px; color: #00ff88; margin-bottom: 2px;
  }
  .chat-header p { font-size: 13px; color: #6b7280; }

  /* ERROR BANNER */
  .chat-error {
    flex-shrink: 0;
    margin: 12px 0 0;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.22);
    border-radius: 12px; padding: 12px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .chat-error-text { flex: 1; }
  .chat-error-text p { font-size: 13px; font-weight: 600; color: #ef4444; margin-bottom: 2px; }
  .chat-error-text span { font-size: 12px; color: #fca5a5; }
  .chat-error-dismiss {
    padding: 4px 12px;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 7px; color: #ef4444; font-size: 12px;
    cursor: pointer; font-family: 'DM Sans', sans-serif; flex-shrink: 0;
  }

  /* MESSAGES */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.06) transparent;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }

  /* EMPTY STATE */
  .chat-empty {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 40px 0;
  }
  .chat-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .chat-empty h2 { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 24px; }
  .chat-suggestions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 620px; }
  .chat-suggestion-btn {
    padding: 9px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px; font-size: 13px; color: #9ca3af;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .chat-suggestion-btn:hover {
    border-color: rgba(0,255,136,0.3);
    color: #e0e0e0;
    background: rgba(0,255,136,0.05);
  }

  /* MESSAGE ROWS */
  .chat-msg-row { display: flex; gap: 12px; align-items: flex-start; }
  .chat-msg-row.user { justify-content: flex-end; }
  .chat-msg-row.model { justify-content: flex-start; }

  .chat-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .chat-avatar.bot {
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.2);
  }
  .chat-avatar.usr {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .chat-bubble {
    max-width: 75%;
    padding: 13px 17px;
    font-size: 14px; line-height: 1.75;
    border-radius: 16px;
  }
  .chat-bubble.user {
    background: linear-gradient(135deg, #00ff88, #00c870);
    color: #000;
    font-weight: 500;
    border-bottom-right-radius: 4px;
  }
  .chat-bubble.model {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: #d1d5db;
    white-space: pre-wrap;
    border-bottom-left-radius: 4px;
  }

  /* TYPING INDICATOR */
  .chat-typing {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; border-bottom-left-radius: 4px;
    padding: 14px 18px;
    display: flex; gap: 5px; align-items: center;
  }
  .chat-typing-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6b7280;
    animation: typingBounce 0.9s infinite;
  }
  .chat-typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .chat-typing-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes typingBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

  /* INPUT AREA */
  .chat-input-wrap {
    flex-shrink: 0;
    padding: 16px 0 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .chat-input-row {
    display: flex; align-items: flex-end; gap: 10px;
  }
  .chat-textarea {
    flex: 1;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 13px 18px;
    font-size: 14px; color: #e0e0e0;
    font-family: 'DM Sans', sans-serif;
    resize: none; outline: none;
    line-height: 1.5;
    max-height: 140px;
    transition: border-color 0.2s;
  }
  .chat-textarea:focus { border-color: rgba(0,255,136,0.35); }
  .chat-textarea::placeholder { color: #374151; }
  .chat-textarea:disabled { opacity: 0.5; }

  .chat-send-btn {
    width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .chat-send-btn.active {
    background: linear-gradient(135deg, #00ff88, #00c870);
  }
  .chat-send-btn.inactive {
    background: rgba(255,255,255,0.05);
    cursor: not-allowed;
  }
  .chat-send-btn.active:hover { opacity: 0.85; transform: scale(1.05); }

  .chat-disclaimer {
    text-align: center; font-size: 11px; color: #374151; margin-top: 10px;
  }
`;

const SUGGESTED = [
  "What problem does this paper solve?",
  "What are the key results?",
  "What are the limitations?",
  "How was the dataset collected?",
  "What is the most controversial claim?",
  "How does this compare to prior work?",
];

export default function ChatPage() {
  const router = useRouter();
  const { pdfBase64, fileName, imageBase64, imageMimeType, incrementChatMessage, user,
    chatMessages, setChatMessages } = usePaperIQ();

  const messages = chatMessages;
  const setMessages = setChatMessages;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const handleNavClick = (path) => {
    if (path === '/elif') {
      if (!pdfBase64) {
        alert('ELIF requires a PDF. Please upload a PDF first.');
        router.push('/upload');
        return;
      }
      router.push(path);
    } else if (path === '/scholarsight') {
      if (!imageBase64) {
        alert('ScholarSight requires an image for visual analysis. Please upload an image first.');
        router.push('/upload');
        return;
      }
      router.push(path);
    } else {
      router.push(path);
    }
  };

  const handleSend = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    // Check if we have PDF or image for context
    if (!pdfBase64 && !imageBase64) {
      setError('Chat requires a PDF or image for context. Please upload a file first.');
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pdfBase64, 
          imageBase64,
          imageMimeType,
          question: q,
          history: messages 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, { role: 'model', text: data.answer }]);
      incrementChatMessage(); // Track successful message
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!pdfBase64 && !imageBase64) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="chat-root">
          <nav className="chat-nav">
            <a className="chat-nav-logo" href="#">
              <div className="chat-nav-logo-icon">📄</div>
              <span style={{ color: '#00ffe0' }}>Paper</span>IQ
            </a>
            <ul className="chat-nav-links">
              <li><a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a></li>
              <li><a onClick={() => router.push('/upload')} style={{ cursor: 'pointer' }}>Upload</a></li>
              <li><a onClick={() => handleNavClick('/elif')} style={{ cursor: 'pointer' }}>ELIF</a></li>
              <li><a onClick={() => handleNavClick('/scholarsight')} style={{ cursor: 'pointer' }}>ScholarSight</a></li>
              <li><a className="active" style={{ cursor: 'pointer' }}>Chat</a></li>
            </ul>
            <div className="chat-nav-user">
              <div className="chat-nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <span>{user?.name || 'User'}</span>
            </div>
          </nav>
          <div className="chat-layout">
            <div className="chat-empty">
              <div className="chat-empty-icon">
                <MessageSquare size={26} color="#6b7280" />
              </div>
              <h2>Upload a file first</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>Upload a PDF or image to start chatting</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="chat-root">

        {/* NAV */}
        <nav className="chat-nav">
          <a className="chat-nav-logo" href="#">
            <div className="chat-nav-logo-icon">📄</div>
            <span style={{ color: '#00ffe0' }}>Paper</span>IQ
          </a>
          <ul className="chat-nav-links">
            <li><a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a></li>
            <li><a onClick={() => router.push('/upload')} style={{ cursor: 'pointer' }}>Upload</a></li>
            <li><a onClick={() => handleNavClick('/elif')} style={{ cursor: 'pointer' }}>ELIF</a></li>
            <li><a onClick={() => handleNavClick('/scholarsight')} style={{ cursor: 'pointer' }}>ScholarSight</a></li>
            <li><a className="active" style={{ cursor: 'pointer' }}>Chat</a></li>
          </ul>
          <div className="chat-nav-user">
            <div className="chat-nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <span>{user?.name || 'User'}</span>
          </div>
        </nav>

        <div className="chat-layout">

          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-header-icon">
              <MessageSquare size={22} color="#00ff88" />
            </div>
            <div>
              <h1>Smart Chat</h1>
              <p>Chatting with <strong style={{ color: '#e0e0e0' }}>{pdfBase64 ? (fileName || 'your PDF') : 'your image'}</strong></p>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="chat-error">
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div className="chat-error-text">
                <p>Error communicating</p>
                <span>{error}</span>
              </div>
              <button className="chat-error-dismiss" onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {/* MESSAGES */}
          <div className="chat-messages">
            {messages.length === 0 && !isLoading && (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <MessageSquare size={26} color="#6b7280" />
                </div>
                <h2>What would you like to know?</h2>
                <div className="chat-suggestions">
                  {SUGGESTED.map((q, i) => (
                    <button key={i} className="chat-suggestion-btn" onClick={() => handleSend(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-msg-row ${m.role === 'user' ? 'user' : 'model'}`}>
                {m.role === 'model' && (
                  <div className="chat-avatar bot">
                    <Bot size={15} color="#00ff88" />
                  </div>
                )}
                <div className={`chat-bubble ${m.role === 'user' ? 'user' : 'model'}`}>
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="chat-avatar usr">
                    <User size={15} color="#9ca3af" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="chat-msg-row model">
                <div className="chat-avatar bot">
                  <Bot size={15} color="#00ff88" />
                </div>
                <div className="chat-typing">
                  <div className="chat-typing-dot" />
                  <div className="chat-typing-dot" />
                  <div className="chat-typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="chat-input-wrap">
            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(e); }}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about the paper..."
                rows={1}
                disabled={isLoading}
              />
              <button
                className={`chat-send-btn ${input.trim() && !isLoading ? 'active' : 'inactive'}`}
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} color={input.trim() && !isLoading ? '#000' : '#4b5563'} />
              </button>
            </div>
            <p className="chat-disclaimer">
              AI responses can be inaccurate — always refer back to the original paper.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}