import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/SignIn'
import Login from './pages/auth/Login'
import LandingPage from './pages/home/LandingPage'
import CreateInterview from './pages/features/CreateInterview'
import AppRoutes from './navigation/AppRoutes'


import {
  useDispatch
}from "react-redux"

import { loadUser } from './redux/authReducers/authSlice'

const App = () => {
  const dispatch=useDispatch()
  
  useEffect(() => {
      dispatch(
        loadUser()
      )
  }, [])
  
  return <AppRoutes />
}
export default App