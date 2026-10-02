import React, { useEffect } from 'react'
import EditorPanel from '../../components/interviews/EditorPanel'
import QuestionPanel from '../../components/interviews/QuestionPanel'
import{
  useDispatch
}from "react-redux"
import{
  useParams
} from "react-router-dom"
import { fetchInterviewQuestions } from '../../redux/slices/questionSlice'

const InterviewRoom = () => {
  const {id}= useParams()
  const dispatch= useDispatch();


  useEffect(() => {
    
    if(id){
      dispatch(
        fetchInterviewQuestions(id)
      )
    }  
  }, [id,dispatch])
  

  return (
    <div>
      <QuestionPanel/>
      <EditorPanel/>
    </div>
  )
}



export default InterviewRoom