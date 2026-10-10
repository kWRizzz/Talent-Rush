import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../../services/socket.service';
import { FiSend, FiMessageSquare, FiUser } from 'react-icons/fi';

const ChatPanel = ({ interviewId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentUser = useSelector((state) => state.auth?.user);
  const currentUserName = currentUser?.name || 'You';
  const currentUserRole = currentUser?.role || 'interviewer';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleMessageSent = (msg) => {
      setMessages((prev) => {
        // avoid duplicate if already added
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    const handleUserTyping = ({ senderName }) => {
      setTypingUser(senderName);
      setIsTyping(true);
    };

    const handleUserStopTyping = () => {
      setIsTyping(false);
      setTypingUser('');
    };

    const handleSolutionSubmitted = ({ submission, senderName }) => {
      const isAccepted = submission?.status === 'accepted';
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          isSystem: true,
          message: `${senderName || 'Candidate'} submitted solution: ${
            isAccepted ? 'Accepted 🎉' : 'Wrong Answer ❌'
          } (${submission?.passedTestCases || 0}/${submission?.totalTestCases || 0} passed)`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const handleQuestionAdded = ({ question }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-q-${Date.now()}`,
          isSystem: true,
          message: `New problem added to room: ${question?.title}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('recieve-message', handleReceiveMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('solution-submitted', handleSolutionSubmitted);
    socket.on('question-added', handleQuestionAdded);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('recieve-message', handleReceiveMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('solution-submitted', handleSolutionSubmitted);
      socket.off('question-added', handleQuestionAdded);
    };
  }, [interviewId]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    const socket = getSocket();
    if (!socket) return;

    socket.emit('typing', {
      interviewId,
      senderName: currentUserName,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', {
        interviewId,
        senderName: currentUserName,
      });
    }, 1500);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const socket = getSocket();
    const payload = {
      interviewId,
      message: message.trim(),
      senderName: currentUserName,
      senderRole: currentUserRole,
      senderId: socket?.id || 'local',
      timestamp: new Date().toISOString(),
    };

    // Optimistically show own message immediately if needed
    const localId = `local-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        id: localId,
        isSelf: true,
      },
    ]);

    if (socket) {
      socket.emit('send-message', payload);
      socket.emit('stop-typing', {
        interviewId,
        senderName: currentUserName,
      });
    }

    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 bg-[#1a1919] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <FiMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live Discussion</h3>
            <p className="text-[11px] text-gray-400">Interview Room Chat</p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Connected
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
            <FiMessageSquare className="w-8 h-8 mb-2 opacity-30 text-primary" />
            <p className="text-xs">No messages yet.</p>
            <p className="text-[11px] text-gray-600 mt-1">
              Start the discussion with the candidate or interviewer!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id || idx} className="flex justify-center my-2">
                  <div className="text-[11px] bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full text-center max-w-[85%]">
                    {msg.message}
                  </div>
                </div>
              );
            }

            const isMe =
              msg.isSelf ||
              msg.senderName === currentUserName ||
              msg.senderId === getSocket()?.id;

            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 mb-1 px-1">
                  {!isMe && (
                    <span className="w-4 h-4 rounded-full bg-primary/30 text-primary flex items-center justify-center text-[9px] font-bold">
                      <FiUser />
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-gray-400">
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  {msg.senderRole && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-gray-500 uppercase">
                      {msg.senderRole}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none shadow-[0_0_16px_rgba(46,91,255,0.2)]'
                      : 'bg-[#262626] text-gray-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing notice */}
      {isTyping && (
        <div className="px-4 py-1 text-[11px] text-primary italic bg-[#1a1919]/50">
          {typingUser} is typing...
        </div>
      )}

      {/* Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#1a1919] border-t border-white/10 flex items-center space-x-2"
      >
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message... (Press Enter to send)"
          className="flex-1 bg-[#0e0e0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-neon-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-[0_0_16px_rgba(46,91,255,0.3)] flex items-center justify-center cursor-pointer"
          title="Send message"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;