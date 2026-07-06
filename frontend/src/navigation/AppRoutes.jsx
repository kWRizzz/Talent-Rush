import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom"
import LandingPage from '../pages/home/LandingPage'
import Login from '../pages/auth/Login'
import SignIn from '../pages/auth/SignIn'
import Dashboard from '../pages/dashboard/Dashboard'
import CreateInterview from '../pages/dashboard/CreateInterview'
import MyInterviews from '../pages/dashboard/MyInterviews'
import InterviewRoom from '../pages/interview/InterviewRoom'


const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route
                path='/'
                element={<LandingPage/>}
            />
            <Route
                path='/login'
                element={<Login/>}
            />
            <Route
                path='/signin'
                element={<SignIn/>}
            />
            <Route
                path='/dashboard'
                element={<Dashboard/>}
            />
            <Route
                path='/create-interview'
                element={<CreateInterview/>}
            />
            <Route
                path='/my-interviews'
                element={<MyInterviews/>}
            />
            <Route
                path='/interview/:roomId'
                element={<InterviewRoom/>}
            />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes