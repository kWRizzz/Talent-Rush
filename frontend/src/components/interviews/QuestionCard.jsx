import React from 'react'

const QuestionCard = ({ question, index }) => {
    return (
        <div
            className="border p-3 rounded"
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