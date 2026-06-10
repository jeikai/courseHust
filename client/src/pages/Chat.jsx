import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Tooltip, Skeleton, message as antMessage } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SendOutlined,
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  sendMessage as sendChatMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from '../api/chat';

// ─── Level badge colour ───────────────────────────────────────────────────────
const LEVEL_COLORS = {
  basic: '#52c41a',
  intermediate: '#1890ff',
  advanced: '#fa8c16',
  specialized: '#722ed1',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CourseCard({ course, onClick }) {
  const fallback = 'https://placehold.co/208x112/e2e8f0/94a3b8?text=Course';
  return (
    <div
      onClick={() => onClick(course._id)}
      style={{
        flexShrink: 0,
        width: 200,
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#fff',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.15)';
        e.currentTarget.style.borderColor = '#93c5fd';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <div style={{ height: 112, overflow: 'hidden', background: '#f1f5f9' }}>
        <img
          src={course.thumbnail || fallback}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = fallback; }}
        />
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p style={{
          margin: 0,
          fontWeight: 600,
          fontSize: 13,
          color: '#1e293b',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4',
          marginBottom: 4,
        }}>
          {course.title}
        </p>
        {course.shortDes && (
          <p style={{
            margin: '0 0 6px',
            fontSize: 11,
            color: '#64748b',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {course.shortDes}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {course.level && (
            <span style={{
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 20,
              color: '#fff',
              fontWeight: 600,
              background: LEVEL_COLORS[course.level] || '#1890ff',
            }}>
              {course.level}
            </span>
          )}
          {course.categoryId?.title && (
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{course.categoryId.title}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '12px 16px' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#94a3b8',
            display: 'inline-block',
            animation: 'bounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, onCourseClick }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      marginBottom: 24,
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      {/* Avatar */}
      <div style={{
        flexShrink: 0,
        width: 34,
        height: 34,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        color: '#fff',
        background: isUser ? '#3b82f6' : '#374151',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        {isUser ? <UserOutlined style={{ fontSize: 14 }} /> : <RobotOutlined style={{ fontSize: 14 }} />}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: '72%',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        {/* Text bubble */}
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser ? '#3b82f6' : '#f1f5f9',
          color: isUser ? '#fff' : '#1e293b',
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </div>

        {/* Course recommendations */}
        {!isUser && msg.recommendedCourses && msg.recommendedCourses.length > 0 && (
          <div style={{ width: '100%' }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              📚 Recommended courses:
            </p>
            <div style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 8,
            }}>
              {msg.recommendedCourses.map((course) => (
                <CourseCard key={course._id} course={course} onClick={onCourseClick} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'I want to learn Python programming',
  'I want to become a backend developer',
  'What data science courses do you have?',
  'Help me learn web development from scratch',
];

// ─── Main Chat component ──────────────────────────────────────────────────────
export default function Chat() {
  const navigate = useNavigate();

  // Redirect if not authenticated
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  useEffect(() => {
    if (!user?.authenticated) navigate('/login');
  }, []);

  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Load conversation list on mount
  useEffect(() => {
    loadConversationList();
  }, []);

  async function loadConversationList() {
    try {
      setLoadingConvs(true);
      const data = await getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvs(false);
    }
  }

  async function loadConversation(convId) {
    try {
      setLoadingMessages(true);
      setCurrentConvId(convId);
      const data = await getConversationById(convId);
      setMessages(data.messages || []);
    } catch (err) {
      antMessage.error('Failed to load conversation');
    } finally {
      setLoadingMessages(false);
    }
  }

  function handleNewChat() {
    setCurrentConvId(null);
    setMessages([]);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function handleDeleteConversation(e, convId) {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (currentConvId === convId) {
        setCurrentConvId(null);
        setMessages([]);
      }
      antMessage.success('Conversation deleted');
    } catch {
      antMessage.error('Failed to delete conversation');
    }
  }

  async function handleSend(textOverride) {
    const text = (textOverride || inputValue).trim();
    if (!text || sending) return;

    setInputValue('');
    setSending(true);

    // Optimistic user bubble
    const tempId = 'temp-' + Date.now();
    const userBubble = {
      _id: tempId,
      role: 'user',
      content: text,
      recommendedCourses: [],
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userBubble]);

    try {
      const data = await sendChatMessage(text, currentConvId);

      // Update conversation state
      if (!currentConvId) {
        setCurrentConvId(data.conversationId);
        await loadConversationList();
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c._id === data.conversationId ? { ...c, updatedAt: new Date().toISOString() } : c
          )
        );
      }

      // Add assistant reply
      const assistantBubble = {
        _id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        recommendedCourses: data.recommendedCourses || [],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantBubble]);
    } catch (err) {
      antMessage.error('Failed to send message. Please try again.');
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

  function formatTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const sidebarStyle = {
    width: 260,
    flexShrink: 0,
    background: '#111827',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#f8fafc',
    minWidth: 0,
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* ── Sidebar ── */}
        <div style={sidebarStyle}>
          {/* New chat button */}
          <div style={{ padding: '16px 12px', borderBottom: '1px solid #1f2937' }}>
            <Button
              icon={<PlusOutlined />}
              onClick={handleNewChat}
              style={{
                width: '100%',
                background: '#3b82f6',
                borderColor: '#3b82f6',
                color: '#fff',
                borderRadius: 10,
                height: 40,
                fontWeight: 600,
              }}
            >
              New Chat
            </Button>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {loadingConvs ? (
              <div style={{ padding: '8px 4px' }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton.Button key={i} active size="small" style={{ width: '100%', height: 48, marginBottom: 8, borderRadius: 8 }} />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 16px' }}>
                <MessageOutlined style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 13 }}>No conversations yet</p>
                <p style={{ margin: '4px 0 0', fontSize: 11 }}>Start a new chat!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => loadConversation(conv._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    marginBottom: 4,
                    background: currentConvId === conv._id ? '#1f2937' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (currentConvId !== conv._id) e.currentTarget.style.background = '#1f2937';
                    e.currentTarget.querySelector('.del-btn').style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    if (currentConvId !== conv._id) e.currentTarget.style.background = 'transparent';
                    e.currentTarget.querySelector('.del-btn').style.opacity = '0';
                  }}
                >
                  <MessageOutlined style={{ fontSize: 13, color: '#9ca3af', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#f3f4f6',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {conv.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>
                      {formatTime(conv.updatedAt)}
                    </p>
                  </div>
                  <Tooltip title="Delete">
                    <DeleteOutlined
                      className="del-btn"
                      style={{ fontSize: 12, color: '#ef4444', opacity: 0, transition: 'opacity 0.15s', flexShrink: 0 }}
                      onClick={(e) => handleDeleteConversation(e, conv._id)}
                    />
                  </Tooltip>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937' }}>
            <p style={{ margin: 0, fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
              ⚡ Powered by Google Gemini AI
            </p>
          </div>
        </div>

        {/* ── Main Area ── */}
        <div style={mainStyle}>
          {/* Header bar */}
          <div style={{
            padding: '14px 24px',
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <RobotOutlined style={{ fontSize: 18, color: '#3b82f6' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1e293b' }}>
                AI Course Advisor
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Ask me anything about courses & learning paths
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {loadingMessages ? (
              <div>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <Skeleton.Avatar size="small" active />
                    <Skeleton.Input active size="small" style={{ width: i % 2 === 0 ? 200 : 320 }} />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              /* Welcome / empty state */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                paddingBottom: 40,
              }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <RobotOutlined style={{ fontSize: 36, color: '#3b82f6' }} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#1e293b' }}>
                  Hi! I&apos;m your Course Advisor
                </h3>
                <p style={{ margin: '0 0 32px', fontSize: 14, color: '#64748b', maxWidth: 420 }}>
                  Tell me what you want to learn or what career path you&apos;re aiming for —
                  I&apos;ll recommend the best courses for you.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  maxWidth: 520,
                  width: '100%',
                }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 12,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#374151',
                        transition: 'all 0.15s',
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#93c5fd';
                        e.currentTarget.style.background = '#eff6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    onCourseClick={(courseId) => navigate(`/courses/${courseId}`)}
                  />
                ))}
                {sending && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      <RobotOutlined style={{ fontSize: 14 }} />
                    </div>
                    <div style={{
                      background: '#f1f5f9',
                      borderRadius: '18px 18px 18px 4px',
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
            padding: '16px 24px',
            background: '#fff',
            borderTop: '1px solid #e5e7eb',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-end',
              maxWidth: 860,
              margin: '0 auto',
            }}>
              <div style={{ flex: 1 }}>
                <Input.TextArea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about courses, skills, or career paths…"
                  autoSize={{ minRows: 1, maxRows: 5 }}
                  disabled={sending}
                  style={{ borderRadius: 12, fontSize: 14, resize: 'none' }}
                />
              </div>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSend()}
                loading={sending}
                disabled={!inputValue.trim() || sending}
                style={{
                  background: '#3b82f6',
                  borderColor: '#3b82f6',
                  borderRadius: 12,
                  height: 40,
                  width: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
