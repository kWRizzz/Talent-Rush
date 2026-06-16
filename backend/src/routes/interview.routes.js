const express = require('express')
const interviewController = require("../controllers/interview.controller")
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()


/** 
*
*  @route POST /api/interview/create"
*  @description create interview room 
*
*/

router.post(
    "/create",
    authMiddleware,
    interviewController.createInterview
)


/** 
*
*  @route GET /api/interview/create"
*  @description fetch the roomes by the id 
*
*/

router.get(
    "/my",
    authMiddleware,
    interviewController.getMyInterviews
)


/** 
*
*  @route GET /api/interview/get by id"
*  @description fetch the roomes by the id 
*
*/


router.get(
    '/:id',
    authMiddleware,
    interviewController.getInterviewById
)


module.exports=router
