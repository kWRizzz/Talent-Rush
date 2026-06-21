const questionModel= require("../models/Question")


const createQuestionService = async (
    questionData
) => {
    const question = await questionModel.create(
        questionData
    )
    
    console.log(question);
    return question
}

const getAllquestionsServices= async (
) => {
    return await questionModel.find().populate(
        "createdBy",
        "name email"
    )
}

module.exports= {
    createQuestionService,
    getAllquestionsServices
}