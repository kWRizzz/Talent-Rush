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
        if(!req.params.id) return res.status(400).json({
            message:"no id in question fetching",
            success:false
        })

        const question= await questionModel.findById(
            req.params.id
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
        console.log(`cant fetch your questions by the id: ${error}`);
        res.status(404).json({
            message:`cant fetch question by id: ${error}`,
            success:false
        })
    }
}

const {
    fetchLeetCodeByNumber,
    getCuratedProblemsList
} = require('../services/leetcode.service');
const { addQuestionToInterview } = require('../services/interview.service');

const getLeetCodeQuestion = async (req, res) => {
    try {
        const { number } = req.params;
        const questionData = await fetchLeetCodeByNumber(number);
        return res.status(200).json({
            success: true,
            question: questionData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getCuratedLeetCodeList = async (req, res) => {
    try {
        const list = getCuratedProblemsList();
        return res.status(200).json({
            success: true,
            problems: list
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addLeetCodeToInterview = async (req, res) => {
    try {
        const { interviewId, questionNumber } = req.body;
        if (!interviewId || !questionNumber) {
            return res.status(400).json({
                success: false,
                message: "interviewId and questionNumber are required"
            });
        }

        // Fetch LeetCode details
        const lcData = await fetchLeetCodeByNumber(questionNumber);

        // Check if question already exists in DB with this leetcodeId or title
        let question = await questionModel.findOne({
            $or: [
                { leetcodeId: lcData.leetcodeId },
                { title: lcData.title },
                { title: `${lcData.leetcodeId}. ${lcData.title}` }
            ]
        });

        if (!question) {
            question = await questionModel.create({
                title: `${lcData.leetcodeId}. ${lcData.title}`,
                difficulty: lcData.difficulty,
                description: lcData.description,
                starterCode: lcData.starterCode,
                starterCodes: lcData.starterCodes || {},
                testCases: lcData.testCases || [],
                example: lcData.example || [],
                constraints: lcData.constraints || [],
                leetcodeId: lcData.leetcodeId,
                topicTags: lcData.topicTags || [],
                createdBy: req.user?.userId
            });
        } else {
            // Update question if description, testCases or starterCode were missing or empty
            let modified = false;
            if (!question.description || question.description.length < 50) {
                question.description = lcData.description;
                modified = true;
            }
            if ((!question.testCases || question.testCases.length === 0) && lcData.testCases?.length > 0) {
                question.testCases = lcData.testCases;
                modified = true;
            }
            if (!question.starterCode && lcData.starterCode) {
                question.starterCode = lcData.starterCode;
                modified = true;
            }
            if (!question.starterCodes && lcData.starterCodes) {
                question.starterCodes = lcData.starterCodes;
                modified = true;
            }
            if ((!question.example || question.example.length === 0) && lcData.example?.length > 0) {
                question.example = lcData.example;
                modified = true;
            }
            if (question.leetcodeId !== lcData.leetcodeId) {
                question.leetcodeId = lcData.leetcodeId;
                modified = true;
            }
            if (modified) {
                await question.save();
            }
        }

        // Add to interview
        const interview = await addQuestionToInterview(interviewId, question._id);

        return res.status(200).json({
            success: true,
            message: `Added LeetCode #${lcData.leetcodeId}: ${lcData.title}`,
            question,
            interview
        });
    } catch (error) {
        console.error("Error adding LeetCode question to interview:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports={
    createQuestion,
    getQuestions,
    getQuestionsById,
    getLeetCodeQuestion,
    getCuratedLeetCodeList,
    addLeetCodeToInterview
}