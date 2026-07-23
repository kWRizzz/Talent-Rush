import {
    createSlice
} from "@reduxjs/toolkit"

const initialState = {
    language="javascript",
    code: "",
    output: "",
    isRunning: false
}


const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
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
    }
})

export const {
    setLanguage,
    setCode,
    setOutput,
    setRunning,
    resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;