import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyInterviews } from '../../redux/slices/interviewSlice';
import MainLayout from '../layout/MainLayout';
import InterviewList from './InterviewList';
import JoinRoomModal, { extractRoomId } from '../interviews/JoinRoomModal';
import { FiPlus, FiVideo, FiCode, FiUsers, FiLoader, FiLogIn, FiLink } from 'react-icons/fi';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { interviews, isLoading } = useSelector(
        (state) => state.interview
    );

    const currentUser = useSelector((state) => state.auth?.user);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [quickRoomId, setQuickRoomId] = useState('');

    useEffect(() => {
        dispatch(fetchMyInterviews());
    }, [dispatch]);

    const handleQuickJoin = (e) => {
        e?.preventDefault();
        const cleanId = extractRoomId(quickRoomId);
        if (cleanId) {
            navigate(`/interview/${cleanId}`);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Hero Banner */}
                <div className="bg-[#131313] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-neon-gradient opacity-10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-primary mb-1 block">
                                Developer Workspace
                            </span>
                            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                                Welcome back,{' '}
                                <span className="bg-neon-gradient text-transparent bg-clip-text">
                                    {currentUser?.name || 'Engineer'}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-400 mt-2 max-w-xl">
                                Conduct live coding interviews, evaluate candidate performance against LeetCode test cases, and collaborate in real-time.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="bg-[#1a1919] hover:bg-[#262626] border border-white/10 text-white px-5 py-3 rounded-full text-xs font-bold tracking-wide transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
                            >
                                <FiLogIn className="w-4 h-4 text-primary" />
                                <span>Join Room by ID</span>
                            </button>

                            <button
                                onClick={() => navigate('/create-interview')}
                                className="bg-neon-gradient hover:opacity-90 text-white px-6 py-3 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_0_32px_rgba(46,91,255,0.3)] flex items-center space-x-2 cursor-pointer"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Create Interview</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Join Input Box */}
                    <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 w-full relative">
                            <input
                                type="text"
                                value={quickRoomId}
                                onChange={(e) => setQuickRoomId(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleQuickJoin();
                                }}
                                placeholder="Paste Room ID or full Invite Link here to join directly..."
                                className="w-full bg-[#0e0e0e] border border-white/10 rounded-2xl py-3 px-4 pl-10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition-colors font-mono"
                            />
                            <FiLink className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
                        </div>
                        <button
                            onClick={handleQuickJoin}
                            disabled={!quickRoomId.trim()}
                            className="w-full sm:w-auto bg-[#1a1919] hover:bg-primary hover:text-white border border-white/10 text-gray-200 px-6 py-3 rounded-2xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                            <FiLogIn className="w-3.5 h-3.5" />
                            <span>Quick Join</span>
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                        <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                <FiVideo className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white">
                                    {interviews?.length || 0}
                                </div>
                                <div className="text-xs text-gray-400">Total Interviews</div>
                            </div>
                        </div>

                        <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                                <FiCode className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white">Live</div>
                                <div className="text-xs text-gray-400">LeetCode Sync</div>
                            </div>
                        </div>

                        <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <FiUsers className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white">P2P</div>
                                <div className="text-xs text-gray-400">WebRTC Video</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interviews List Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-display font-bold text-white tracking-tight">
                            Recent Interview Sessions
                        </h2>
                        <span className="text-xs text-gray-400">
                            {interviews?.length || 0} Rooms
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <FiLoader className="w-8 h-8 animate-spin text-primary mb-2" />
                            <p className="text-xs">Loading sessions...</p>
                        </div>
                    ) : (
                        <InterviewList interviews={interviews || []} />
                    )}
                </div>
            </div>

            <JoinRoomModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
            />
        </MainLayout>
    );
};

export default Dashboard;