import React from 'react'
import {
  useDispatch,
  useSelector
} from "react-redux"
import {
  setCode
} from "../../redux/slices/editorSlice"
import Editor from "@monaco-editor/react"


const EditorPanel = () => {

  const { code, language } = useSelector(
    (state) => state.editor
  )
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(setCode(value || ""))
  }

  return (
    <div
      className=' h-full'
    >
      <h1>

        
        heditor    


      </h1>
      <div
        className=' h-[40rem] w-[50rem] '
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Editor
          height="50%"
          theme='vs-dark'
          language={language}
          value={code}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default EditorPanel