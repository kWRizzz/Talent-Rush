import React from 'react'

import {
  useSelector
} from "react-redux"

const OutputPanel = () => {

  const {output,isRunning}= useSelector(
    (state)=>state.editor
  )
  
  return (
    <div>
      <h1>
           Your OutPut here
      </h1>

      {
        isRunning ? (
            <div>
                Running
            </div>
        ): output ? (
            <pre
              className=' whitespace-pre-wrap'
            >
                {output}
            </pre>
        ):(
            <div>
                error
            </div>
        )
      }
    </div>
  )
}

export default OutputPanel