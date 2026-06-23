const express = require('express')
const interviewController = require("../controllers/interview.controller")
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

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
    roleMiddleware(
        "interviewer",
        "admin"
    ),
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


/** 
*
*  @route DELETE /api/interview/get by id"
*  @description Delete the full rooom 
*
*/

router.delete(
    '/:id',
    authMiddleware,
    interviewController.deleteInterviwe
)

/** 
*
*  @route POST /api/interview/:id/add-questions"
*  @description add All the questions  
*
*/

router.post(
    '/:id/add-question',
    authMiddleware,
    roleMiddleware(
        "interviewer",
        "admin"
    ),
    interviewController.addQuestion
)



/** 
*
*  @route POST /api/interview/:roomId by id"
*  @description join the room for interview 
*
*/


router.post(
    '/:roomid',
    authMiddleware,
    interviewController.joinInterview
)



/** 
*
*  @route POST /api/interview/:roomId by id"
*  @description join the room for interview 
*
*/


router.patch(
    '/:id/status',
    authMiddleware,
    interviewController.updateInterviewStatus
)

module.exports = router
