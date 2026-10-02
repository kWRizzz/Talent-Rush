import React, { useEffect } from 'react'
import EditorPanel from '../../components/interviews/EditorPanel'
import QuestionPanel from '../../components/interviews/QuestionPanel'
import OutputPanel from '../../components/interviews/OutputPanel'
import {
  useDispatch
} from "react-redux"
import {
  useParams
} from "react-router-dom"
import { fetchInterviewQuestions } from '../../redux/slices/questionSlice'

const InterviewRoom = () => {
  const { id } = useParams()
  const dispatch = useDispatch();


  useEffect(() => {

    if (id) {
      dispatch(
        fetchInterviewQuestions(id)
      )
    }
  }, [id, dispatch])


  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Interview Room
      </h1>
      <div
        className='grid grid-cols-12 gap-4'
      >
        <div className="col-span-4">
          <QuestionPanel />
        </div>
      </div>

      <div className="col-span-8">
        <div className="h-[500px]">
          <EditorPanel />
        </div>
      </div>

      <div
        className='mt-4'
      >
          <OutputPanel/>
      </div>
    </div>
  )
}



export default InterviewRoom