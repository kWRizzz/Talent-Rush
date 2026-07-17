import React from 'react'
import{
    getMyInterviews,
    deleteInterview
}from "../../services/interview.service"

import{
    useDispatch,
    useSelector
}from "react-redux"
import InterviewCard from './InterviewCard'

const InterviewList = ({interviews}) => {
    
  if(!interviews.length){
    return (
        <div
            className=' h-screen w-full flex justify-center items-center'
        >
            No Interview Found Sorry Try to Create one 
        </div>
    )
  }
  else{

    return(
        <div
            className=' grid gap-2'
        >
            {
                interviews.map((interview)=>(
                    <InterviewCard
                        key={interview._id}
                        interview={interview}
                    />
                ))
            }

        </div>
    )
  }
}

export default InterviewList