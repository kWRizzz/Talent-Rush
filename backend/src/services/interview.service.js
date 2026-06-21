const interviewModel= require("../models/Interview")
const questionModel= require("../models/Question")

const crypto= require('crypto')


const createInterviewService = async (
    interviewData
) => {
    const roomId= crypto.randomBytes(4).toString("hex")

    const interview= await interviewModel.create(
        {
            ...interviewData,
            roomId
        }
    ) 

    return interview
}

const addQuestionToInterview = async (
    interviewId,
    questionId
) => {
    const interview= await interviewModel.findById(
        interviewId
    )

    if(!interview) {
        throw new Error(
            "INterview not found"
        )
    }

    interview.questions.push(
        questionId
    )
    await interview.save()
   
    return interview 
}

module.exports={
    createInterviewService,
    addQuestionToInterview
}