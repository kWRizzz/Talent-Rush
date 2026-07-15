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
    async (
        data,
        thunkAPI
    ) => {
        try {
            return await createInterview(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)

export const removeInterview =createAsyncThunk(
    "interview/removeInterview",
    async (
        data,
        thunkAPI
    ) => {
        try {
            await deleteInterview(id);
            return id
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)


const interviewSlice = createSlice({
    name:"interview",
    initialState:{
        interviews:[],
        isLoading:false,
        error:null
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(fetchMyInterviews.pending,(state)=>{
            state.isLoading=true
        })

        builder.addCase(fetchMyInterviews.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.interviews= action.payload
        })

        builder.addCase(fetchMyInterviews.rejected,(state,action)=>{
            state.isLoading=false,
            state.error=action.payload
        })
    }
})


export default interviewSlice.reducer