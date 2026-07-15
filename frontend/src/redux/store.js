import { configureStore } from '@reduxjs/toolkit'
import authReducer  from "../redux/authReducers/authSlice.js";

import interviewReducer from "../redux/slices/interviewSlice.js"

export const store = configureStore({
  reducer: {
    auth:authReducer,
    interview: interviewReducer
  },
})