import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // backend call yaha se
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">

      {/* Gradient Border */}
      <div className="relative w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient">
        
        {/* Card */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Enter your password"
                />
                
                {/* Toggle */}
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-gray-400 cursor-pointer hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Forgot */}
            <div className="text-right">
              <span className="text-sm text-gray-400 hover:text-pink-400 cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold hover:scale-105 transition-transform duration-300"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-gray-400 text-sm text-center mt-4">
            Don’t have an account?{" "}
            <span className="text-pink-400 cursor-pointer hover:underline">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;