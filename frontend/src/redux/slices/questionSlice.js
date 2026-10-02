import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit"
import {
    getInterviewById
} from "../../services/interview.service"

export const fetchInterviewQuestions = createAsyncThunk(
    "question/fetchInterviewQuestions",
    async (interviewId, thunkAPI) => {
        try {
            const response = await getInterviewById(interviewId);
            return response.question || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message
            )
        }
    }
)


const initialState = {
    question: [],
    isLoading: false,
    error: null
}


const questionSlice = createSlice(
    {
        name: "question",
        initialState,
        reducers: {
            clearQuestions: (state) => {
                state.question = [];
                state.error = null;
            }
        },
        extraReducers: (builder) => {

            builder.addCase(fetchInterviewQuestions.pending, (state) => {
                state.isLoading = true,
                    state.error = false
            })

            builder.addCase(fetchInterviewQuestions.fulfilled, (state, action) => {
                state.question = action.payload;
                state.isLoading = false;

            })

            builder.addCase(fetchInterviewQuestions.rejected, (state, action) => {
                state.error = action.payload;
                    state.isLoading = false;
            })
        }

    }
)

export const {
    clearQuestions
}= questionSlice.actions;

export default questionSlice.reducer;