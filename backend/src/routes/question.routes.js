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


/**
 *  @ROUTE GET api/question/
 *  @description get the all questions
 */

router.get(
    '/',
    authMiddleware,
    questionController.getQuestions
)


/**
 *  @ROUTE GET api/question/:id
 *  @description get the all questions by the user id
 */


router.get(
    '/:id',
    authMiddleware,
    questionController.getQuestionsById
)

module.exports= router