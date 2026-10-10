import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import {
    runCode as runCodeService,
    runTestCases as runTestCasesService,
    submitSolution as submitSolutionService
} from "../../services/compiler.service";

export const runCode = createAsyncThunk(
    "editor/runCode",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const { language, code } = state.editor;

            const response = await runCodeService({
                language,
                code
            });

            const result = response.output;
            if (typeof result === 'object' && result !== null) {
                return result.output || "";
            }
            return result || "";
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const runTests = createAsyncThunk(
    "editor/runTests",
    async (testCases, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const { language, code } = state.editor;
            const currentQuestion = state.question.selectedQuestion;
            const casesToRun = testCases || currentQuestion?.testCases || [];

            const response = await runTestCasesService({
                language,
                code,
                testCases: casesToRun
            });

            return response.result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const submitSolution = createAsyncThunk(
    "editor/submitSolution",
    async ({ interviewId, questionId }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const { language, code } = state.editor;

            const response = await submitSolutionService({
                interviewId,
                questionId,
                language,
                code
            });

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    language: "javascript",
    code: "",
    output: "",
    isRunning: false,
    isTesting: false,
    isSubmitting: false,
    testResults: null,
    allPassed: null,
    submissionResult: null,
    activeTab: "tests" // "tests" | "console" | "submissions"
};

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setStarterCode: (state, action) => {
            state.code = action.payload || "";
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setCode: (state, action) => {
            state.code = action.payload;
        },
        setOutput: (state, action) => {
            state.output = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setRunning: (state, action) => {
            state.isRunning = action.payload;
        },
        clearTestResults: (state) => {
            state.testResults = null;
            state.allPassed = null;
            state.submissionResult = null;
        },
        resetEditor: (state) => {
            state.language = "javascript";
            state.code = "";
            state.output = "";
            state.isRunning = false;
            state.isTesting = false;
            state.isSubmitting = false;
            state.testResults = null;
            state.allPassed = null;
            state.submissionResult = null;
        }
    },
    extraReducers: (builder) => {
        // runCode
        builder.addCase(runCode.pending, (state) => {
            state.isRunning = true;
            state.output = "";
            state.activeTab = "console";
        });
        builder.addCase(runCode.fulfilled, (state, action) => {
            state.isRunning = false;
            state.output = action.payload;
            state.activeTab = "console";
        });
        builder.addCase(runCode.rejected, (state, action) => {
            state.isRunning = false;
            state.output = `Error: ${action.payload}`;
            state.activeTab = "console";
        });

        // runTests
        builder.addCase(runTests.pending, (state) => {
            state.isTesting = true;
            state.activeTab = "tests";
        });
        builder.addCase(runTests.fulfilled, (state, action) => {
            state.isTesting = false;
            state.testResults = action.payload?.results || [];
            state.allPassed = action.payload?.allPassed;
            if (action.payload?.stdout) {
                state.output = action.payload.stdout;
            }
            state.activeTab = "tests";
        });
        builder.addCase(runTests.rejected, (state, action) => {
            state.isTesting = false;
            state.output = `Test Error: ${action.payload}`;
            state.activeTab = "tests";
        });

        // submitSolution
        builder.addCase(submitSolution.pending, (state) => {
            state.isSubmitting = true;
            state.activeTab = "tests";
        });
        builder.addCase(submitSolution.fulfilled, (state, action) => {
            state.isSubmitting = false;
            state.submissionResult = action.payload?.submission;
            if (action.payload?.evaluation) {
                state.testResults = action.payload.evaluation.results || [];
                state.allPassed = action.payload.evaluation.allPassed;
            }
            state.activeTab = "tests";
        });
        builder.addCase(submitSolution.rejected, (state, action) => {
            state.isSubmitting = false;
            state.output = `Submission Error: ${action.payload}`;
        });
    }
});

export const {
    setLanguage,
    setCode,
    setOutput,
    setRunning,
    resetEditor,
    setStarterCode,
    setActiveTab,
    clearTestResults
} = editorSlice.actions;

export default editorSlice.reducer;