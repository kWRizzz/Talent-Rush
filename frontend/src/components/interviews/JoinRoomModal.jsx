import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinInterview } from '../../services/interview.service';
import { FiLogIn, FiX, FiLink, FiLoader, FiAlertCircle } from 'react-icons/fi';

/**
 * Helper to extract Room ID from direct ID or full URL
 */
export const extractRoomId = (input) => {
  if (!input) return '';
  const trimmed = input.trim();

  // Match /interview/:roomId
  const interviewMatch = trimmed.match(/\/interview\/([a-zA-Z0-9_-]+)/i);
  if (interviewMatch) {
    return interviewMatch[1];
  }

  // Attempt URL parse
  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return segments[segments.length - 1];
    }
  } catch (e) {
    // Plain room ID
  }

  return trimmed;
};

const JoinRoomModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [roomInput, setRoomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleJoin = async (e) => {
    e?.preventDefault();
    const cleanId = extractRoomId(roomInput);

    if (!cleanId) {
      setError('Please enter a valid Room ID or paste an invite link');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate that the interview room exists
      await joinInterview(cleanId);
      onClose();
      navigate(`/interview/${cleanId}`);
    } catch (err) {
      setError(
        err.message || 'Room not found. Please verify the ID or invite link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-body">
      <div
        className="relative w-full max-w-md bg-[#131313] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-[70px] pointer-events-none -z-10"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
            <FiLogIn className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-display font-extrabold text-white tracking-tight">
              Join Interview <span className="bg-neon-gradient text-transparent bg-clip-text">Room</span>
            </h3>
            <p className="text-xs text-gray-400">
              Paste the invite link or enter the Room ID
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Room ID or Invite URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={roomInput}
                onChange={(e) => {
                  setRoomInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. 49ff5bc7 or http://.../interview/49ff5bc7"
                autoFocus
                className="w-full bg-[#1a1919] border border-white/10 rounded-2xl py-3 px-4 pl-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors font-mono"
              />
              <FiLink className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !roomInput.trim()}
              className="flex-1 py-3 rounded-xl bg-neon-gradient hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(46,91,255,0.3)] flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Checking Room...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-4 h-4" />
                  <span>Join Room</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;
