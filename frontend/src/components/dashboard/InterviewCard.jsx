import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

const InterviewCard = ({ interview }) => {
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

            <Link
                to={`/interview/${interview.roomId}`}
                className="bg-neon-gradient hover:opacity-90 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(46,91,255,0.25)] flex items-center space-x-1.5 self-end md:self-auto"
            >
                <span>Join Session</span>
                <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );
};

export default InterviewCard;