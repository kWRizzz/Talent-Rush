import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import EditorPanel from '../../components/interviews/EditorPanel';
import QuestionPanel from '../../components/interviews/QuestionPanel';
import OutputPanel from '../../components/interviews/OutputPanel';
import ChatPanel from '../../components/interviews/ChatPanel';
import VideoPanel from '../../components/interviews/VideoPanel';
import { fetchInterviewQuestions } from '../../redux/slices/questionSlice';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from '../../services/socket.service';
import {
  FiCode,
  FiMessageSquare,
  FiVideo,
  FiTerminal,
  FiCopy,
  FiCheck,
  FiLogOut,
  FiUsers,
  FiShare2,
} from 'react-icons/fi';

const InterviewRoom = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth?.user);
  const { isTesting, isRunning, isSubmitting } = useSelector(
    (state) => state.editor
  );

  const [leftTab, setLeftTab] = useState('questions'); // "questions" | "chat"
  const [topTab, setTopTab] = useState('video'); // "video" (default on top) | "output"
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [roomParticipants, setRoomParticipants] = useState([]);

  // Auto-switch top pane to Output/Test results when tests run
  useEffect(() => {
    if (isTesting || isRunning || isSubmitting) {
      setTopTab('output');
    }
  }, [isTesting, isRunning, isSubmitting]);

  useEffect(() => {
    if (!roomId) return;

    connectSocket();
    const socket = getSocket();

    const userInfo = {
      name: currentUser?.name || 'Developer',
      role: currentUser?.role || 'interviewer',
      userId: currentUser?._id || currentUser?.userId,
    };

    socket.emit('join-interview', {
      interviewId: roomId,
      roomId,
      user: userInfo,
    });

    const handleRoomUsers = ({ users }) => {
      if (Array.isArray(users)) {
        setRoomParticipants(users);
      }
    };

    socket.on('room-users', handleRoomUsers);

    return () => {
      socket.off('room-users', handleRoomUsers);
      socket.emit('leave-interview', {
        interviewId: roomId,
        roomId,
        user: userInfo,
      });
      disconnectSocket();
    };
  }, [roomId, currentUser]);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchInterviewQuestions(roomId));
    }
  }, [roomId, dispatch]);

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyInviteLink = () => {
    if (roomId) {
      const inviteUrl = `${window.location.origin}/interview/${roomId}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleLeave = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0e0e0e] text-white overflow-hidden font-body selection:bg-primary/40 selection:text-white">
      {/* Top Navbar */}
      <header className="h-14 px-4 bg-[#131313] border-b border-white/10 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div
            onClick={() => navigate('/dashboard')}
            className="cursor-pointer flex items-center space-x-2"
          >
            <span className="font-display font-bold text-lg bg-neon-gradient text-transparent bg-clip-text">
              Talent-Rush
            </span>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>

          {/* Room ID Pill */}
          <div className="flex items-center space-x-1.5 bg-[#1a1919] border border-white/10 rounded-full px-3 py-1 text-xs">
            <span className="text-gray-400">Room:</span>
            <span className="font-mono text-primary font-bold">{roomId}</span>
            <button
              onClick={copyRoomId}
              title="Copy Room ID"
              className="text-gray-400 hover:text-white transition-colors ml-1 p-0.5 cursor-pointer"
            >
              {copied ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Share Link Button */}
          <button
            onClick={copyInviteLink}
            title="Copy full invite URL to send to candidates or co-interviewers"
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(46,91,255,0.2)]"
          >
            {copiedLink ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <FiShare2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </>
            )}
          </button>

          {/* Active Participants count */}
          {roomParticipants.length > 0 && (
            <div className="hidden md:flex items-center space-x-1 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <FiUsers className="w-3.5 h-3.5 text-primary" />
              <span>{roomParticipants.length} Connected</span>
            </div>
          )}
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center space-x-2">
          {/* User profile pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1a1919] border border-white/10 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-gray-200">{currentUser?.name || 'Interviewer'}</span>
          </div>

          {/* Leave Button */}
          <button
            onClick={handleLeave}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* Main Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden">
        {/* Left Pane (Questions or Chat) - 5 cols */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-0">
          {/* Left Pane Tabs Switcher */}
          <div className="flex items-center space-x-2 mb-2 bg-[#131313] p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setLeftTab('questions')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                leftTab === 'questions'
                  ? 'bg-neon-gradient text-white shadow-[0_0_16px_rgba(46,91,255,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiCode className="w-3.5 h-3.5" />
              <span>Problems & Test Cases</span>
            </button>

            <button
              onClick={() => setLeftTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                leftTab === 'chat'
                  ? 'bg-neon-gradient text-white shadow-[0_0_16px_rgba(46,91,255,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiMessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>
          </div>

          {/* Left Pane Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {leftTab === 'questions' ? (
              <QuestionPanel interviewId={roomId} />
            ) : (
              <ChatPanel interviewId={roomId} />
            )}
          </div>
        </div>

        {/* Right Pane: Video Call UP, Code Editor DOWN - 7 cols */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-0 space-y-2.5">
          {/* TOP HALF: Video Call Screens (with Test Output Tab) */}
          <div className="h-[270px] xl:h-[290px] shrink-0 flex flex-col min-h-0 overflow-hidden">
            {/* Top Pane Switcher */}
            <div className="flex items-center space-x-2 mb-2 bg-[#131313] p-1 rounded-xl border border-white/10 shrink-0 self-start">
              <button
                onClick={() => setTopTab('video')}
                className={`py-1 px-3 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
                  topTab === 'video'
                    ? 'bg-secondary/20 text-secondary border border-secondary/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FiVideo className="w-3.5 h-3.5" />
                <span>Video Call (Live)</span>
              </button>

              <button
                onClick={() => setTopTab('output')}
                className={`py-1 px-3 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
                  topTab === 'output'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FiTerminal className="w-3.5 h-3.5" />
                <span>Test Results & Output</span>
              </button>
            </div>

            {/* Top Content Area */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {topTab === 'video' ? (
                <VideoPanel interviewId={roomId} />
              ) : (
                <OutputPanel />
              )}
            </div>
          </div>

          {/* BOTTOM HALF: Code Editor (Down Below) */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <EditorPanel interviewId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;