import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { getMyInterviews, deleteInterview } from '../../services/interview.service';
import JoinRoomModal from '../../components/interviews/JoinRoomModal';
import {
  FiVideo,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiLoader,
  FiLayers,
  FiLogIn,
  FiShare2,
} from 'react-icons/fi';

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await getMyInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleCopy = (roomId) => {
    navigator.clipboard.writeText(roomId);
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLink = (roomId, e) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/interview/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(roomId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview room?')) {
      try {
        await deleteInterview(id);
        setInterviews((prev) => prev.filter((i) => i._id !== id));
      } catch (err) {
        console.error('Failed to delete interview:', err);
      }
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              My <span className="bg-neon-gradient text-transparent bg-clip-text">Interviews</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage your technical interview rooms and live collaborative sessions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-[#1a1919] hover:bg-[#262626] border border-white/10 text-white px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <FiLogIn className="w-3.5 h-3.5 text-primary" />
              <span>Join by ID</span>
            </button>

            <button
              onClick={() => navigate('/create-interview')}
              className="bg-neon-gradient hover:opacity-90 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_0_24px_rgba(46,91,255,0.3)] flex items-center space-x-2 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Interview</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FiLoader className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-xs">Loading your interview sessions...</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-[#131313] border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
              <FiLayers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Interviews Scheduled</h3>
            <p className="text-xs text-gray-400 mb-6">
              You haven&apos;t created any technical interview rooms yet. Launch your first live coding session now!
            </p>
            <button
              onClick={() => navigate('/create-interview')}
              className="bg-neon-gradient text-white text-xs px-6 py-3 rounded-full font-bold shadow-[0_0_24px_rgba(46,91,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
            >
              Create New Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map((item) => (
              <div
                key={item._id}
                className="bg-[#131313] border border-white/10 hover:border-primary/40 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xl hover:shadow-[0_0_24px_rgba(46,91,255,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status || 'Active'}
                    </span>
                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      title="Delete interview"
                      className="text-gray-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  {item.candidateName && (
                    <p className="text-xs text-gray-400 mb-2">
                      Candidate: <span className="text-gray-200 font-medium">{item.candidateName}</span>
                    </p>
                  )}

                  {/* Room ID card */}
                  <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-2.5 flex items-center justify-between mb-4">
                    <div className="text-xs">
                      <span className="text-gray-500 mr-1.5">Room:</span>
                      <span className="font-mono text-gray-200 font-bold">{item.roomId}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={(e) => handleCopyLink(item.roomId, e)}
                        title="Copy full invite link"
                        className="text-xs text-gray-400 hover:text-primary transition-colors p-1 cursor-pointer flex items-center space-x-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md"
                      >
                        {copiedLinkId === item.roomId ? (
                          <>
                            <FiCheck className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FiShare2 className="w-3 h-3" />
                            <span className="text-[10px]">Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(item.roomId)}
                        title="Copy Room ID"
                        className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                      >
                        {copiedId === item.roomId ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 flex items-center">
                    <FiCalendar className="mr-1" />
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'Just now'}
                  </span>

                  <button
                    onClick={() => navigate(`/interview/${item.roomId}`)}
                    className="bg-neon-gradient hover:opacity-90 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-[0_0_16px_rgba(46,91,255,0.25)] transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <span>Join Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </MainLayout>
  );
};

export default MyInterviews;