const mongoose = require("mongoose")


const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: [
            "easy",
            "medium",
            "hard"
        ],
        required:true
    },
    description:{
        type:String,
        require:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    testCases:[
        {
            input:String,
            expectedOutput:String
        }
    ],
    example:[
        {
            input:String,
            output:String,
            explaination:String
        }
    ],
    constraints:[
        String
    ]
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Question", questionSchema)