import React from 'react'
import{
    useDispatch,
    useSelector
}from "react-redux"
import { selectedQuestion } from '../../redux/slices/questionSlice'
import { setCode } from '../../redux/slices/editorSlice'


const QuestionCard = ({ question, index }) => {
    const dispatch= useDispatch();

    const {selectedQuestion}= useSelector(
        (state)=>state.question
    )

    const isSelected= selectedQuestion?._id===question.id

    const handleSelect= () => {
        dispatch(
            selectedQuestion(question)
        )
        dispatch(
            setCode(question.starterCode || "")
        )
    }

    return (
        <div
            onClick={handleSelect}
            className={`border p-3 rounded cursor-pointer ${
                isSelected?
                "border-blue-500"
                :""
            }`}

        >
            <p className="font-medium">
                {index+1}.{question.title}
            </p>
            <p className="text-sm mt-2">
                {question.description}
            </p>
        </div>  
    )
}

export default QuestionCard