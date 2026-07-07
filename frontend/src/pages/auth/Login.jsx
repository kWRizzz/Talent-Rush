import React, { useState, useEffect } from "react";
import {
  useDispatch,
  useSelector
} from "react-redux"
import {
  loginUser
} from "../../redux/authReducers/authSlice"
import { useNavigate } from "react-router-dom";

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(
      loginUser(formData)
    )
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center"
    >
      <form
        onSubmit={handleSubmit}
        className="  border p-6 space-y-4 w-96"
      >
        <h1
          className=" font-bold"
        >
          Login nigga
        </h1>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border w-full p-2 rounded text-black"
        />
        <input
         type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className=" border p-2 w-full rounded text-black"
        />
        <button
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
            Submit
        </button>
      </form>
    </div>
  );
};

export default Login;