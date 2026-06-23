const { createSubmissionService } = require("../services/submission.service");


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
                submission
            });
    }
}

module.exports = {
    createSubmission
};