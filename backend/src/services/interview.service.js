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
    const mongoose = require('mongoose');
    let interview = null;
    if (mongoose.Types.ObjectId.isValid(interviewId)) {
        interview = await interviewModel.findById(interviewId);
    }
    if (!interview) {
        interview = await interviewModel.findOne({ roomId: interviewId });
    }

    if (!interview) {
        throw new Error("Interview not found");
    }

    const alreadyExists = interview.questions.some(q => q.toString() === questionId.toString());
    if (!alreadyExists) {
        interview.questions.push(questionId);
        await interview.save();
    }

    await interview.populate("questions");
    return interview;
}

module.exports={
    createInterviewService,
    addQuestionToInterview
}