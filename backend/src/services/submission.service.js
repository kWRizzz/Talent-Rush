const submissionModel= require("../models/Submission")


const createSubmissionService = async (
    submissionData
) => {
    const submission= await submissionModel.create(
        submissionData
    )

    return submission
}

const getSubmissionsByInterview =async (
    interviewId
) => {
        return await submissionModel.find({
            interview:interviewId
        }).populate(
            "candidate",
            "name email"
        ).populate(
            "question",
            "title difficulty"
        )

}

module.exports={
    createSubmissionService,
    getSubmissionsByInterview
}