import React from 'react'
import {
  useSelector
} from "react-redux"
import QuestionCard from './QuestionCard'


const QuestionPanel = () => {
  const {
    questions,
    isLoading,
    error
  } = useSelector(
    (state) => state.question
  )

  if (isLoading) {
    return (
      <div>
        loading ..............
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {error}
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div>
        no questions are added pls add a question
      </div>
    )
  }


  return (
    <div
      className="border p-4 overflow-y-auto"
    >

      <h1
        className="text-xl font-semibold mb-4"
      >
        Interview Questions
      </h1>
      <div
        className="space-y-3"
      >

        {
          questions.map((question, index) => (
            <QuestionCard
              key={question._id}
              question={question}
              index={index}
            />
          ))
        }

      </div>
    </div>
  )
}

export default QuestionPanel