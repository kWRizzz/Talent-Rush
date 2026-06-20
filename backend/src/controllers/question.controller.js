const questionModel= require('../models/Question')
const  createQuestionService = require('../services/question.service')

const createQuestion= async (
    req,
    res
) => {
    try {
        const {
            title,
            difficulty,
            description,
            createdBy,
            testCases,
            example,
            constraints
        }= req.body;

        if(!req.user.userId){
            return res.status(400).json({
                message:"No user Is for the question ",
                success:false
            })
        }
        const question= await createQuestionService({
            title,
            difficulty,
            description,
            createdBy:req.user.userId,
            testCases,
            example,
            constraints
        })
        res.status(200).json({
            message:"Question asked ",
            question,
            success:true
        })
    } catch (error) {
        console.log(`cant create question ${error}`);
        res.status(500).json({
            message:`ant create question ${error}`,
            success:false
        })
    }
}


module.exports={
    createQuestion
}