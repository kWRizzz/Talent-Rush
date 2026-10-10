import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiCopy, FiCheck } from 'react-icons/fi';

const InterviewCard = ({ interview }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/interview/${interview.roomId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#131313] border border-white/10 hover:border-primary/40 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-xl hover:shadow-[0_0_24px_rgba(46,91,255,0.15)] group">
            <div className="space-y-1">
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {interview.status || 'Scheduled'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                        Room: <span className="text-primary font-bold">{interview.roomId}</span>
                    </span>
                    {interview.candidateName && (
                        <span className="text-xs text-gray-400">
                            • Candidate: <span className="text-gray-300 font-medium">{interview.candidateName}</span>
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {interview.title}
                </h3>

                <p className="text-xs text-gray-500 flex items-center">
                    <FiCalendar className="mr-1.5" />
                    {interview.scheduledAt
                        ? new Date(interview.scheduledAt).toLocaleString()
                        : 'Immediate Session'}
                </p>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-auto">
                <button
                    onClick={handleCopyLink}
                    title="Copy invite link to clipboard"
                    className="bg-[#1a1919] hover:bg-white/10 text-gray-300 hover:text-white px-3.5 py-2.5 rounded-full text-xs font-medium border border-white/10 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                    {copied ? (
                        <>
                            <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <FiCopy className="w-3.5 h-3.5 text-primary" />
                            <span>Copy Link</span>
                        </>
                    )}
                </button>

                <Link
                    to={`/interview/${interview.roomId}`}
                    className="bg-neon-gradient hover:opacity-90 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(46,91,255,0.25)] flex items-center space-x-1.5"
                >
                    <span>Join Session</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
};

export default InterviewCard;