import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/SignIn'
import Login from './pages/auth/Login'
import LandingPage from './pages/home/LandingPage'
import CreateInterview from './pages/features/CreateInterview'
import AppRoutes from './navigation/AppRoutes'

const App = () => {
  return (
    // <Router>
    //   <div className='min-h-screen w-full font-body bg-main-bg text-white'>
    //     <Routes>
    //       <Route path="/" element={<LandingPage />} />
    //       <Route path="/features/CreateInterview" element={<CreateInterview />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/signin" element={<SignIn />} />
    //     </Routes>
    //   </div>
    // </Router>
    <AppRoutes />
  )
}
export default App