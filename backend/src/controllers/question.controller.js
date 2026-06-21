const questionModel= require('../models/Question')
const  {
    createQuestionService,
    getAllquestionsServices
} = require('../services/question.service')

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


const getQuestions = async (
    req,
    res
) => {
    try {
        // if(!req.param.id) return res.status(400).json({
        //     message:"no user found "
        // })

        const questions = await getAllquestionsServices();

        res.status(200).json({
            message:"dones here is your questions ",
            questions,
            success:true
        })
        
    } catch (error) {
        console.log(`caant fetch your question ${error}`);
        res.status(404).json({
            message:`cant feetch your status ${error}`,
            success:false
        })
    }    
}

const getQuestionsById= async (
    req,
    res
) => {
    try {
        if(!req.param.id) return res.status(400).json({
            message:"no id in question fetching",
            success:false
        })

        const question= await questionModel.findById(
            req.param.id
        )

        if(!question){

         return res.status(404)
         .json({
            message:
            "Question Not Found"
         });

      }

        res.status(200).json({
            message:"here is your questions",
            question,
            success:true
        })
    } catch (error) {
        console.log(`cant fetch your questions by hte id son ${error}`);
        res.status(404).json({
            message:`cant fetch question son by id ${error}`,
            success:false
        })
    }
}

module.exports={
    createQuestion,
    getQuestions,
    getQuestionsById
}