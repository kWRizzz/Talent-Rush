const express= require('express')

const router= express.Router()

const compilerController= require('../controllers/compiler.controller')

const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')


/** 
*
*  @route POST /api/compiler/execute"
*  @description execute code 
*
*/


router.post(
    '/execute',
    compilerController.executeCode
)



module.exports=router