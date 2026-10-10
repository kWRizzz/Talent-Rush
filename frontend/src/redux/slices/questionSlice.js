import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";
import { getInterviewById } from "../../services/interview.service";
import {
    addLeetCodeToInterview as addLeetCodeService,
    fetchLeetCodeQuestion as fetchLeetCodeService
} from "../../services/question.service";

export const fetchInterviewQuestions = createAsyncThunk(
    "question/fetchInterviewQuestions",
    async (interviewId, thunkAPI) => {
        try {
            const response = await getInterviewById(interviewId);
            return response.questions || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addLeetCodeQuestion = createAsyncThunk(
    "question/addLeetCodeQuestion",
    async ({ interviewId, questionNumber }, thunkAPI) => {
        try {
            const response = await addLeetCodeService(interviewId, questionNumber);
            return response.question;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const previewLeetCodeQuestion = createAsyncThunk(
    "question/previewLeetCodeQuestion",
    async (questionNumber, thunkAPI) => {
        try {
            const response = await fetchLeetCodeService(questionNumber);
            return response.question;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    question: [],
    selectedQuestion: null,
    searchedQuestion: null,
    isLoading: false,
    isAddingLeetCode: false,
    isSearchingLeetCode: false,
    error: null,
    leetCodeError: null
};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        selectedQuestion: (state, action) => {
            state.selectedQuestion = action.payload;
            state.searchedQuestion = null;
        },
        setSearchedQuestion: (state, action) => {
            state.searchedQuestion = action.payload;
        },
        clearSearchedQuestion: (state) => {
            state.searchedQuestion = null;
        },
        addQuestionToState: (state, action) => {
            const idx = state.question.findIndex(q => q._id === action.payload._id);
            if (idx !== -1) {
                state.question[idx] = action.payload;
            } else {
                state.question.push(action.payload);
            }
            if (!state.selectedQuestion || state.selectedQuestion._id === action.payload._id) {
                state.selectedQuestion = action.payload;
            }
        },
        clearQuestions: (state) => {
            state.question = [];
            state.selectedQuestion = null;
            state.searchedQuestion = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // fetchInterviewQuestions
        builder.addCase(fetchInterviewQuestions.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchInterviewQuestions.fulfilled, (state, action) => {
            state.question = action.payload;
            state.isLoading = false;
            if (action.payload.length > 0 && !state.selectedQuestion) {
                state.selectedQuestion = action.payload[0];
            }
        });
        builder.addCase(fetchInterviewQuestions.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });

        // addLeetCodeQuestion
        builder.addCase(addLeetCodeQuestion.pending, (state) => {
            state.isAddingLeetCode = true;
            state.leetCodeError = null;
        });
        builder.addCase(addLeetCodeQuestion.fulfilled, (state, action) => {
            state.isAddingLeetCode = false;
            const idx = state.question.findIndex(q => q._id === action.payload._id);
            if (idx !== -1) {
                state.question[idx] = action.payload;
            } else {
                state.question.push(action.payload);
            }
            state.selectedQuestion = action.payload;
            state.searchedQuestion = null;
        });
        builder.addCase(addLeetCodeQuestion.rejected, (state, action) => {
            state.isAddingLeetCode = false;
            state.leetCodeError = action.payload;
        });

        // previewLeetCodeQuestion
        builder.addCase(previewLeetCodeQuestion.pending, (state) => {
            state.isSearchingLeetCode = true;
            state.leetCodeError = null;
        });
        builder.addCase(previewLeetCodeQuestion.fulfilled, (state, action) => {
            state.isSearchingLeetCode = false;
            state.searchedQuestion = action.payload;
            state.selectedQuestion = action.payload;
        });
        builder.addCase(previewLeetCodeQuestion.rejected, (state, action) => {
            state.isSearchingLeetCode = false;
            state.leetCodeError = action.payload;
        });
    }
});

export const {
    selectedQuestion,
    setSearchedQuestion,
    clearSearchedQuestion,
    addQuestionToState,
    clearQuestions
} = questionSlice.actions;

export default questionSlice.reducer;