const express = require("express")
const roleMiddleware = require("../middleware/role.middleware")
const authMiddleware = require('../middleware/auth.middleware')
const questionController= require('../controllers/question.controller')

const router = express.Router()


/**
 *  @ROUTE POST api/question/create
 *  @description create question
 */

router.post("/create",
    authMiddleware,
    roleMiddleware(
        "interviewer",
        "admin"
    ),
    questionController.createQuestion
)   


module.exports= router