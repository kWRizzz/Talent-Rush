import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { createInterview } from '../../services/interview.service';
import { addLeetCodeToInterview } from '../../services/question.service';
import {
  FiVideo,
  FiCalendar,
  FiUser,
  FiCode,
  FiCheck,
  FiLoader,
  FiArrowRight,
} from 'react-icons/fi';

const QUICK_PROBLEMS = [
  { id: 1, name: '1. Two Sum', diff: 'Easy' },
  { id: 20, name: '20. Valid Parentheses', diff: 'Easy' },
  { id: 121, name: '121. Stock Trading', diff: 'Easy' },
  { id: 53, name: '53. Maximum Subarray', diff: 'Medium' },
  { id: 70, name: '70. Climbing Stairs', diff: 'Easy' },
];

const CreateInterview = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [candidate, setCandidate] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(1);
  const [customProblem, setCustomProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an interview title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const interviewRes = await createInterview({
        title: title.trim(),
        candidate: candidate.trim() || undefined,
        scheduledAt: scheduledAt || undefined,
      });

      const newInterview = interviewRes?.interview;
      if (!newInterview || !newInterview.roomId) {
        throw new Error('Interview room creation failed');
      }

      // If a LeetCode problem was selected, attach it right away
      const problemToAttach = customProblem || selectedProblem;
      if (problemToAttach) {
        try {
          await addLeetCodeToInterview(newInterview.roomId, problemToAttach);
        } catch (attachErr) {
          console.warn('Could not pre-attach LeetCode problem:', attachErr.message);
        }
      }

      navigate(`/interview/${newInterview.roomId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs text-primary font-bold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Technical Evaluation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            Create Interview <span className="bg-neon-gradient text-transparent bg-clip-text">Session</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Generate an encrypted collaborative room with real-time video, Monaco code execution, and LeetCode test verification.
          </p>
        </div>

        {/* Card Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#131313] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex items-center">
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">
              Interview Title <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer — Live Coding Round"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#0e0e0e] text-white border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Grid: Candidate & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2 flex items-center">
                <FiUser className="mr-1.5 text-primary" /> Candidate Name or ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Chen"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                className="w-full bg-[#0e0e0e] text-white border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2 flex items-center">
                <FiCalendar className="mr-1.5 text-secondary" /> Schedule Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-[#0e0e0e] text-white border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* LeetCode Problem Pre-attachment */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center">
                <FiCode className="mr-1.5 text-emerald-400" /> Pre-load LeetCode Problem
              </label>
              <span className="text-[11px] text-gray-500">Includes live test cases</span>
            </div>

            {/* Quick Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {QUICK_PROBLEMS.map((p) => {
                const isSelected = selectedProblem === p.id && !customProblem;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      setSelectedProblem(p.id);
                      setCustomProblem('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/20 border-primary text-white shadow-[0_0_16px_rgba(46,91,255,0.2)]'
                        : 'bg-[#0e0e0e] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{p.name}</div>
                    <span className="text-[10px] text-emerald-400">{p.diff}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom problem number input */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                placeholder="Or enter any custom LeetCode # (e.g. 21, 206, 242)"
                value={customProblem}
                onChange={(e) => {
                  setCustomProblem(e.target.value);
                  if (e.target.value) setSelectedProblem(null);
                }}
                className="flex-1 bg-[#0e0e0e] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-neon-gradient hover:opacity-90 disabled:opacity-40 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_0_32px_rgba(46,91,255,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Creating Room...</span>
                </>
              ) : (
                <>
                  <span>Create & Launch Room</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateInterview;