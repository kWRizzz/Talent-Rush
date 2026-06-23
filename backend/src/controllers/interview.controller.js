const interviewModel = require("../models/Interview")
const {
    createInterviewService,
    addQuestionToInterview
} = require("../services/interview.service")


const createInterview = async (
    req,
    res
) => {
    try {
        const {
            title,
            candidate,
            scheduledAt
        } = req.body || {};

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const interview = await createInterviewService({
            title,
            candidate,
            scheduledAt,
            interviewer: req.user.userId
        });

        return res.status(201).json({
            success: true,
            interview
        });
    } catch (error) {
        console.log(`cant create interview room ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const getMyInterviews = async (
    req,
    res
) => {
    try {

        const interviews = await interviewModel.find({
            interviewer: req.user.userId
        }).populate("candidate", "name email")




        return res.status(200).json(
            interviews
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


const getInterviewById = async (
    req,
    res
) => {
    try {

        const interview = await interviewModel.findById(
            req.params.id
        ).populate(
            "candidate",
            "name email"
        ).populate(
            "questions"
        )

        
        if (!interview) {

            return res.status(404).json({
                message: "Interview Not Found"
            });

        }

        if (interview.interviewer.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Forbidden message"
            });
        }

        return res.status(200).json(
            interview
        );



    } catch (error) {
        return res.status(500).json({
            message: error.message
        });

    }
}

const deleteInterviwe = async (
    req,
    res
) => {
    try {
        const interview = await interviewModel.findById(
            req.params.id
        )

        if (!interview) {
            return res.status(404).json({
                message: "Interview Not Found"
            });
        }

        await interview.deleteOne();

        return res.status(200).json({
            message: "Interview Deleted"
        });
    } catch (error) {
        console.log(`error in deletion  ${error}`);
        return res.status(500).json({
            message: error.message
        });
    }
}

const addQuestion = async (
    req,
    res
) => {
    try {
        const { questionId } = req.body

        if (!questionId) {
            return res.status(400).json({
                message: "no ques id"
            })
        }

        const interview = await addQuestionToInterview(
            req.params.id,
            questionId
        )

        return res.status(200)
            .json({
                success: true,
                interview
            });
    } catch (error) {
        console.log(`error in adding the question to interview ${error}`);
        res.status(404).json({
            message: error.message
        })
    }
}


module.exports = {
    createInterview,
    getMyInterviews,
    getInterviewById,
    deleteInterviwe,
    addQuestion
}