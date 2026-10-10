import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authReducers/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white px-4 relative overflow-hidden font-body">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="relative w-full max-w-md p-[2px] rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-secondary shadow-2xl">
        <div className="bg-[#131313] rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-1">
            <Link to="/" className="inline-block">
              <span className="font-display font-bold text-2xl bg-neon-gradient text-transparent bg-clip-text">
                Talent-Rush
              </span>
            </Link>
            <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gray-400">Sign in to your technical interview studio</p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-[#0e0e0e] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0e0e0e] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-gradient hover:opacity-90 disabled:opacity-40 text-white py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow-[0_0_24px_rgba(46,91,255,0.3)] flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 pt-2">
            Don&apos;t have an account?{" "}
            <Link to="/signin" className="text-primary hover:text-white font-medium transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;