const express=require('express')
const userController=require('../controllers/user.controller')
const authMiddleware=require('../middleware/auth.middleware')
const router= express.Router()

/** 
*
*  @route POST api/user/register
*  @description User Register
*
*/


router.post('/register',userController.userRegister)

/**
 * 
 * @route POST api/user/login
 * @description User Login  
 */


router.post('/login',userController.userLogin)


/**
 * 
 * @route GET api/user/logout
 * @description User Logout Also THe token is blackListed  
 */


router.get('/logout' , userController.userLogout )


/**
 *  @route Get api/user/my
 *  @description fetching the profile 
 */

router.get('/my', authMiddleware, userController.getProfile)

module.exports=router