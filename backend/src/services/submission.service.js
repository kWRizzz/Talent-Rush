const submissionModel= require("../models/Submission")


const createSubmissionService = async (
    submissionData
) => {
    const submission= await submissionModel.create(
        submissionData
    )

    return submission
}

module.exports={
    createSubmissionService
}