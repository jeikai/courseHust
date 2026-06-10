import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Tooltip, message as antMessage } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CloseOutlined,
  PlusOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import {
  sendMessage as sendChatMessage,
  getConversations,
  getConversationById,
} from '../api/chat';

// ─── Compact course card inside the popup ────────────────────────────────────
function CompactCourseCard({ course, onClick }) {
  const fallback = 'https://placehold.co/60x40/e2e8f0/94a3b8?text=C';
  return (
    <div
      onClick={() => onClick(course._id)}
      style={{
        display: 'flex',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        background: '#fff',
        cursor: 'pointer',
        flexShrink: 0,
        width: 220,
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#93c5fd';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <img
        src={course.thumbnail || fallback}
        alt={course.title}
        style={{ width: 56, height: 38, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
        onError={(e) => { e.target.src = fallback; }}
      />
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: '#1e293b',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: '1.4',
        }}>
          {course.title}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
          {course.level || course.categoryId?.title || 'Course'}
        </p>
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#94a3b8',
            display: 'inline-block',
            animation: 'chatBounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, onCourseClick }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      marginBottom: 16,
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
    }}>
      <div style={{
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        color: '#fff',
        background: isUser ? '#3b82f6' : '#374151',
      }}>
        {isUser
          ? <UserOutlined style={{ fontSize: 12 }} />
          : <RobotOutlined style={{ fontSize: 12 }} />}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: '78%',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          padding: '9px 13px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser ? '#3b82f6' : '#f1f5f9',
          color: isUser ? '#fff' : '#1e293b',
          fontSize: 13,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </div>

        {!isUser && msg.recommendedCourses && msg.recommendedCourses.length > 0 && (
          <div style={{ width: '100%' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: '#64748b', fontWeight: 500 }}>
              📚 Recommended:
            </p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {msg.recommendedCourses.map((course) => (
                <CompactCourseCard key={course._id} course={course} onClick={onCourseClick} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Suggestions shown on empty state ────────────────────────────────────────
const SUGGESTIONS = [
  'I want to learn Python',
  'Recommend web dev courses',
  'Data science for beginners',
  'Backend developer path',
];

// ─── Main ChatWidget ──────────────────────────────────────────────────────────
export default function ChatWidget() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Don't render for unauthenticated users
  if (!user?.authenticated) return null;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Load latest conversation when widget first opens
  useEffect(() => {
    if (isOpen && !initialized) {
      loadLatestConversation();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  async function loadLatestConversation() {
    try {
      const convs = await getConversations();
      if (Array.isArray(convs) && convs.length > 0) {
        const latest = convs[0]; // sorted by updatedAt desc
        setCurrentConvId(latest._id);
        const data = await getConversationById(latest._id);
        setMessages(data.messages || []);
      }
    } catch {
      // Silent — just show welcome state
    } finally {
      setInitialized(true);
    }
  }

  function handleNewChat() {
    setCurrentConvId(null);
    setMessages([]);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function handleSend(textOverride) {
    const text = (textOverride || inputValue).trim();
    if (!text || sending) return;

    setInputValue('');
    setSending(true);

    const tempId = 'temp-' + Date.now();
    setMessages((prev) => [...prev, {
      _id: tempId,
      role: 'user',
      content: text,
      recommendedCourses: [],
    }]);

    try {
      const data = await sendChatMessage(text, currentConvId);
      if (!currentConvId) setCurrentConvId(data.conversationId);
      setMessages((prev) => [...prev, {
        _id: 'asst-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        recommendedCourses: data.recommendedCourses || [],
      }]);
    } catch {
      antMessage.error('Failed to send. Please try again.');
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCourseClick(courseId) {
    setIsOpen(false);
    navigate(`/courses/${courseId}`);
  }

  function toggleOpen() {
    setIsOpen((v) => !v);
  }

  return (
    <>
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
        }
        .chat-widget-popup {
          animation: chatSlideUp 0.22s cubic-bezier(0.34,1.36,0.64,1) both;
        }
        .chat-widget-btn {
          animation: chatPulse 2.5s ease-in-out 1s 3;
        }
        .chat-msg-area::-webkit-scrollbar { width: 4px; }
        .chat-msg-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .chat-msg-area::-webkit-scrollbar-track { background: transparent; }
        .chat-course-row::-webkit-scrollbar { height: 4px; }
        .chat-course-row::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .chat-course-row::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* ── Floating button ── */}
      <div
        className="chat-widget-btn"
        onClick={toggleOpen}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: isOpen ? '#374151' : '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          transition: 'background 0.2s, transform 0.2s',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="AI Course Advisor"
      >
        {isOpen
          ? <CloseOutlined style={{ fontSize: 18 }} />
          : <RobotOutlined style={{ fontSize: 22 }} />}
      </div>

      {/* ── Popup ── */}
      {isOpen && (
        <div
          className="chat-widget-popup"
          style={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            zIndex: 9998,
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(560px, calc(100vh - 120px))',
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(59,130,246,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <RobotOutlined style={{ fontSize: 18, color: '#93c5fd' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#f8fafc' }}>
                AI Course Advisor
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
                Ask me about suitable courses
              </p>
            </div>
            <Tooltip title="New chat">
              <button
                onClick={handleNewChat}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#cbd5e1',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                <PlusOutlined style={{ fontSize: 13 }} />
              </button>
            </Tooltip>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 8,
                color: '#cbd5e1',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <CloseOutlined style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Messages area */}
          <div
            className="chat-msg-area"
            style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}
          >
            {messages.length === 0 ? (
              /* Welcome / empty state */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                paddingBottom: 16,
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <RobotOutlined style={{ fontSize: 28, color: '#3b82f6' }} />
                </div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: '#1e293b' }}>
                  Hi! I&apos;m your Course Advisor
                </p>
                <p style={{ margin: '0 0 20px', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  Tell me what you want to learn and I&apos;ll find the best courses for you.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 13px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 10,
                        background: '#f8fafc',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#374151',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#93c5fd';
                        e.currentTarget.style.background = '#eff6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                    >
                      <MessageOutlined style={{ fontSize: 12, color: '#3b82f6', flexShrink: 0 }} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg._id} msg={msg} onCourseClick={handleCourseClick} />
                ))}
                {sending && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      <RobotOutlined style={{ fontSize: 12 }} />
                    </div>
                    <div style={{
                      background: '#f1f5f9',
                      borderRadius: '16px 16px 16px 4px',
                    }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid #f1f5f9',
            background: '#fff',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <Input.TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about courses or learning paths…"
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={sending}
                style={{
                  borderRadius: 10,
                  fontSize: 13,
                  resize: 'none',
                  flex: 1,
                  borderColor: '#e5e7eb',
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSend()}
                loading={sending}
                disabled={!inputValue.trim() || sending}
                style={{
                  background: '#3b82f6',
                  borderColor: '#3b82f6',
                  borderRadius: 10,
                  height: 36,
                  width: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  padding: 0,
                  minWidth: 38,
                }}
              />
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 10, color: '#cbd5e1', textAlign: 'center' }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
