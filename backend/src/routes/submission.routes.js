const express =
require("express");

const router =
express.Router();

const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

const submissionController= require("../controllers/submission.controller")



/** 
*
*  @route POST /api/submission/create"
*  @description create interview room 
*
*/

router.post("/create",
    authMiddleware,
    submissionController.createSubmission
)


module.exports= router