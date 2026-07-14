import{
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit"

import{
    getMyInterviews,
    createInterview,
    deleteInterview
}from "../../services/interview.service"


export const fetchMyInterviews= createAsyncThunk(
    "interview/fetchMyInterviews",
    async (
        _,
        thunkAPI
    ) => {
        try {
            return await getMyInterviews()
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)

export const createNewInterview =createAsyncThunk(
    "interview/createNewInterview",
    
)