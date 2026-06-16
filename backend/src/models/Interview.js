const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        participates:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        roomId: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: [
                "scheduled",
                "ongoing",
                "completed",
            ],
            default:"scheduled"
        },
        scheduledAt:{
            type:Date,
        }
    },{
        timestamps:true
    }
)

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);