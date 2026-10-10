const {
    createSubmissionService,
    getSubmissionsByInterview
} = require("../services/submission.service");
const submissionModel = require('../models/Submission');
const interviewModel = require('../models/Interview');
const questionModel = require('../models/Question');
const { runTestCases } = require('../services/compiler.service');
const mongoose = require('mongoose');

const createSubmission = async (req, res) => {
    try {
        const {
            interviewId,
            questionId,
            language = "javascript",
            code
        } = req.body;

        if (!interviewId || !questionId || !code) {
            return res.status(400).json({
                success: false,
                message: "interviewId, questionId, and code are required"
            });
        }

        // Resolve Interview by _id or roomId
        let interview = null;
        if (mongoose.Types.ObjectId.isValid(interviewId)) {
            interview = await interviewModel.findById(interviewId);
        }
        if (!interview) {
            interview = await interviewModel.findOne({ roomId: interviewId });
        }

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        // Fetch question for testcases
        const question = await questionModel.findById(questionId);
        const testCases = question?.testCases || [];

        // Run evaluation against testcases
        const evalResult = await runTestCases({
            language,
            code,
            testCases
        });

        const status = evalResult.allPassed ? "accepted" : "wrong-answer";
        const passedTestCases = evalResult.passedCount || 0;
        const totalTestCases = evalResult.totalCount || 0;

        const submission = await createSubmissionService({
            interview: interview._id,
            question: questionId,
            candidate: req.user.userId,
            language,
            code,
            status,
            output: evalResult.stdout || (evalResult.allPassed ? "All test cases passed!" : "Some test cases failed."),
            passedTestCases,
            totalTestCases
        });

        return res.status(201).json({
            success: true,
            submission,
            evaluation: evalResult
        });
    } catch (error) {
        console.error("Error creating submission:", error);
        return res.status(500).json({
            success: false,
            message: `Error creating submission: ${error.message}`
        });
    }
};

const getInterviewSubmissions = async (req, res) => {
    try {
        const interviewParam = req.params.interviewId;
        let interview = null;
        if (mongoose.Types.ObjectId.isValid(interviewParam)) {
            interview = await interviewModel.findById(interviewParam);
        }
        if (!interview) {
            interview = await interviewModel.findOne({ roomId: interviewParam });
        }

        const idToSearch = interview ? interview._id : interviewParam;
        const submissions = await getSubmissionsByInterview(idToSearch);

        return res.status(200).json({
            success: true,
            submissions
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({
            success: false,
            message: `Error fetching submissions: ${error.message}`
        });
    }
};

const getMySubmissions = async (req, res) => {
    try {
        const submissions = await submissionModel.find({
            candidate: req.user.userId
        }).populate("question", "title difficulty");

        return res.status(200).json({
            success: true,
            submissions
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error getting submissions: ${error.message}`
        });
    }
};

module.exports = {
    createSubmission,
    getInterviewSubmissions,
    getMySubmissions
};