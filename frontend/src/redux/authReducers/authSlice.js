import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import{
    register,
    login,
    logout,
    getUser
}from "../../services/auth.service"

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData,thunkAPI) => {
        try {
            return await login(
                userData
            )
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData,thunkAPI) => {
        try {
            return await register(
                userData
            )
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)

export const logoutUser= createAsyncThunk(
    "auth/logout",
    async (userData,thunkAPI) => {
        try {
            return await logout()
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)

export const loadUser=createAsyncThunk(
    "auth/loadUser",
    async (_,thunkAPI) => {
        try {
            return getUser()
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)

const authReducer = createSlice({
    name: "auth",

    initialState: {
        user: null,
        token: null,
        isLoading: false,
        error:null
    },

    reducers: {},

    extraReducers: (builder) => {

        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
        })

        builder.addCase(loginUser.rejected, (state) => {
            state.isLoading = false
        })

        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
        })

        builder.addCase(registerUser.rejected, (state) => {
            state.isLoading = false
        })

        builder.addCase(logoutUser.fulfilled,
            (state)=>{
                state.user=null;
                state.token=null;
            }
        )

        builder.addCase(loadUser.fulfilled,(state,action)=>{
            state.user=action.payload.user
        })
    }
})




export default authReducer.reducer