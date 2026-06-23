const {
    createSubmissionService,
    getSubmissionsByInterview
} = require("../services/submission.service");

const submissionModel= require('../models/Submission')

const createSubmission = async (
    req,
    res
) => {
    try {
        const {
            interviewId,
            questionId,
            language,
            code
        } = req.body;

        if (
            !interviewId ||
            !questionId ||
            !language ||
            !code
        ) return res.status(400).json({
            message:
                "All Fields Required"
        })

        const submission = await createSubmissionService({
            interview:
                interviewId,

            question:
                questionId,

            candidate:
                req.user.userId,

            language,
            code
        })

        return res.status(201)
            .json({
                success: true,
                submission
            });
    } catch (error) {
        return res.status(201)
            .json({
                message: `error while submiting ${error}`,
                success: true,

            });
    }
}
const getInterviewSubmissions = async (
    req,
    res
) => {
    try {
        const submission = await getSubmissionsByInterview(req.params.interviewId)

        return res.status(200)
            .json(submissions);
    } catch (error) {
        return res.status(201)
            .json({
                message: `error while getting your submission ${error}`,
                success: true,

            });
    }
}

const getMySubmissions = async (
    req,
    res
) => {
    try {
        const submission= await submissionModel.find({
            candidate:req.user.userId
        })

        if(!candidate)return res.status(400).json({
            message:"cant found a person for the submission",
            success:false
        })

        return res.status(200).json({
            message:"ye le tere submission",
            submission,
            success:true
        })
    } catch (error) {
        return res.status(201)
            .json({
                message: `error while getting your submission ${error}`,
                success: true,

            });
    }
}
module.exports = {
    createSubmission,
    getInterviewSubmissions
};