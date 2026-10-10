import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/authReducers/authSlice';
import { FiLogOut, FiPlus, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#131313] px-6 flex items-center justify-between z-30 sticky top-0">
      <Link to="/" className="flex items-center space-x-2">
        <span className="font-display font-bold text-2xl tracking-wide bg-neon-gradient text-transparent bg-clip-text">
          Talent-Rush
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          to="/create-interview"
          className="hidden sm:flex items-center space-x-1.5 bg-neon-gradient hover:opacity-90 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-[0_0_20px_rgba(46,91,255,0.25)]"
        >
          <FiPlus className="w-3.5 h-3.5" />
          <span>New Interview</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-white/10">
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                <FiUser className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline font-medium">{user.name || 'User'}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="text-gray-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs flex items-center space-x-1"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;