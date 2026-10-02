import React from 'react'
import {
    useDispatch,
    useSelector
} from "react-redux"
import { runCode } from '../../redux/slices/editorSlice';


const RunButton = () => {
    
    const {isRunning}= useSelector(
        (state)=>state.editor
    )

    const dispatch= useDispatch();
    const handleRun=()=>{
        dispatch(runCode())
    }

  return (
    <div>
        <button
            onClick={handleRun}
        >
            {
                isRunning?
                "running....."
                :
                "▶ Run Code"
            }
        </button>
    </div>
  )
}

export default RunButton