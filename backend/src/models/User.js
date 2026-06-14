const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: [true, "Enter The Password"]
    },
    role: {
        type: String,
        enum: [
            "candidate",
            "interviewer",
            "admin"
        ],
        default: "candidate"
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("user", userSchema)