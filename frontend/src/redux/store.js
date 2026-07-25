import { configureStore } from '@reduxjs/toolkit'
import authReducer  from "../redux/authReducers/authSlice.js";

import interviewReducer from "../redux/slices/interviewSlice.js"

import editorReducer from "../redux/slices/editorSlice.js"
export const store = configureStore({
  reducer: {
    auth:authReducer,
    interview: interviewReducer,
    editor: editorReducer
  },
})


