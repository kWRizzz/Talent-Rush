const express=require('express')
const interviewController= require("../controllers/interview.controller")
const authMiddleware= require('../middleware/auth.middleware')

const router= express.Router()


/** 
*
*  @route POST /api/interview/create"
*  @description 
*
*/

router.post(
    "/create",
    authMiddleware,
    interviewController.createInterview
)
