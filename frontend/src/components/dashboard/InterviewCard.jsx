import React from 'react'
import {
    Link
} from "react-router-dom"

const InterviewCard = ({ interview }) => {
    return (
        <div
            className=' border rounded-lg bg-gray-800 flex items-center justify-center gap-3'
        >
            <h1
                className=' text-2xl font-bold text-gray-300'
            >
                {interview.name}
            </h1>

            <p
                className=' text-xl font-semibold text-gray-300'
            >
                Status:{interview.status}
            </p>
            <p
                className=' text-xl font-semibold text-gray-300'
            >
                Room :{interview.roomId}
            </p>
            <Link
                to={`/interview/${interview.roomId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"

            >

                    JOIN-ROOM 
            </Link>
        </div>
    )
}

export default InterviewCard