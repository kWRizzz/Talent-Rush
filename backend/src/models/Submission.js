const mongoose = require('mongoose')


const submissionSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "wrong-answer",
            "runtime-error"
        ],
        default: "pending"
    },
    output: {
        type: String,
        default: ""
    }
},
{
    timestamps:true
}
)   

module.exports=mongoose.model("Submission",submissionSchema)