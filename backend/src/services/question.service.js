const questionModel= require("../models/Question")


module.exports= createQuestionService = async (
    questionData
) => {
    const question = await questionModel.create(
        questionData
    )
    
    console.log(question);
    return question
}
