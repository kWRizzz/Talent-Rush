import React from 'react';
import InterviewCard from './InterviewCard';
import { FiLayers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const InterviewList = ({ interviews }) => {
  const navigate = useNavigate();

  if (!interviews || !interviews.length) {
    return (
      <div className="bg-[#131313] border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <FiLayers className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">No Active Interviews</h4>
        <p className="text-xs text-gray-400 mb-4 max-w-sm">
          You don&apos;t have any interview rooms created yet. Launch a session to start interviewing.
        </p>
        <button
          onClick={() => navigate('/create-interview')}
          className="bg-neon-gradient hover:opacity-90 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-[0_0_20px_rgba(46,91,255,0.25)] cursor-pointer"
        >
          Create Your First Interview
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {interviews.map((interview) => (
        <InterviewCard key={interview._id} interview={interview} />
      ))}
    </div>
  );
};

export default InterviewList;