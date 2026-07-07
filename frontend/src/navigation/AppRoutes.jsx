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
import ProtectedRoute from './ProtectedRoute'


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/'
                    element={<LandingPage />}
                />
                <Route
                    path='/login'
                    element={<Login />}
                />
                <Route
                    path='/signin'
                    element={<SignIn />}
                />
                <Route
                    path='/dashboard'
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/create-interview'
                    element={
                        <ProtectedRoute>
                            <CreateInterview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/my-interviews'
                    element={
                        <ProtectedRoute>
                            <MyInterviews />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/interview/:roomId'
                    element={
                        <ProtectedRoute>
                            <InterviewRoom />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes