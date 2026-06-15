const interviewModel = require("../models/Interview")
const {
    createInterviewService
} = require("../services/interview.service")


const createInterview = async (
    req,
    res
) => {
    try {
        const {
            title,
            candidate,
            sheduledAt
        } = req.body;

        const interview = await interviewModel({
            title,
            candidate,
            sheduledAt,
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


const getInterviewById =async (
    req,
    res
) => {
    try {

        const interview= await interviewModel.findById(
            req.user.userId
        )

            if(!interview){

      return res.status(404).json({
        message:"Interview Not Found"
      });

    }

    return res.status(200).json(
      interview
    );



    } catch (error) {
        return res.status(500).json({
      message:error.message
    });

    }
}

module.exports = {
    createInterview,
    getMyInterviews,
    getInterviewById
}