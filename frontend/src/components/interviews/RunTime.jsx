import React from 'react'

import {
    useDispatch,
    useSelector
} from "react-redux"

import {
    runCode
} from "../../redux/slices/editorSlice.js"


const RunTime = () => {
    const dispatch= useDispatch();

    const {
        isRunning
    } = useSelector(
        (state)=>state.editor
    )

    const handleSumbit= ()=>{
        dispatch(runCode())
    }
    return (
        <button
            className="bg-green-600  text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isRunning}
            onClick={handleSumbit}
        >
            {
                isRunning ? 
                    "Running... ":
                    "▶ Run Code"
            }
        </button>
    )
}

export default RunTime