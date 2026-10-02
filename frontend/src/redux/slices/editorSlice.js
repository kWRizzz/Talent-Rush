import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit"

const initialState = {
    language:"javascript",
    code: "",
    output: "",
    isRunning: false
}

import{
    runCode as runCodeServices
}from "../../services/compiler.service"

export const runCode= createAsyncThunk(
    "editor/runCode",
    async (_,thunkAPI) => {
        try {
            const state= thunkAPI.getState();

            const {language,code}= state.editor;

            const response= await runCodeServices({
                language,
                code
            })

            // The backend returns {success, output} where output is
            // itself {success, output} from compiler.service.
            // Extract the actual string.
            const result = response.output;
            if (typeof result === 'object' && result !== null) {
                return result.output || "";
            }
            return result || "";

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setStarterCode:(state,action)=>{
            state.code=action.payload || ""
        },
        setLanguage: (state, action) => {
            state.language = action.payload
        },
        setCode: (state, action) => {
            state.code = action.payload
        },
        setOutput: (state, action) => {
            state.output = action.payload
        },
        setRunning:(state,action)=>{
            state.isRunning=action.payload
        },
        resetEditor:(state,action)=>{
            state.language="javascript",
            state.code="",
            state.output="",
            state.isRunning=false
        }
    },

    extraReducers:(builder)=>{

        builder.addCase(runCode.pending,(state,action)=>{
            state.isRunning= true
            state.output=""
        })

        builder.addCase(runCode.fulfilled,(state,action)=>{
            state.isRunning=false
            state.output=action.payload
        })

        builder.addCase(runCode.rejected,(state,action)=>{
            state.isRunning=false;
            state.output=action.payload
        })
    }
})

export const {
    setLanguage,
    setCode,
    setOutput,
    setRunning,
    resetEditor,
    setStarterCode
} = editorSlice.actions;

export default editorSlice.reducer;