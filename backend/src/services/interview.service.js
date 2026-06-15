const interviewModel= require("../models/Interview")
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


module.exports={
    createInterviewService
}