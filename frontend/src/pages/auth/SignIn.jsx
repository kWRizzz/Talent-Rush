import React, { useState } from "react";
import { registerUser } from "../../redux/authReducers/authSlice.js";
import { useDispatch } from "react-redux";


const SignIn = () => {

  const dispatch=useDispatch()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const name= formData.name
    const email=formData.email
    const password=formData.password

    dispatch(registerUser({
      name,
      email,
      password
    }))
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">

      {/* Card */}
      <div className="relative w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient">
        
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Create Account 🚀
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="text-sm text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                placeholder="Enter your name"
              />
            </div>

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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold hover:scale-105 transition-transform duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-4">
            Already have an account?{" "}
            <span className="text-pink-400 cursor-pointer hover:underline">
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;