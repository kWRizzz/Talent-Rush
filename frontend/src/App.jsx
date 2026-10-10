import React, { useEffect } from 'react'
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