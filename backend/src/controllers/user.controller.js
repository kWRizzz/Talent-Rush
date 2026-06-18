const userModel = require('../models/User')
const passwordHashing = require('../utils/passwordHashing.utils')
const generateToken = require('../utils/token.utils')
const tokenModel = require('../models/tokens.model')
const bcryptjs = require("bcryptjs")
const { response, request } = require("express")


const userRegister = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password) return res.status(400).json({
            message: "ENter All Credentials"
        })

        if (password.length < 6) return res.status(400).json({
            message: "Enter A Strong Password"
        })

        const isExist = await userModel.findOne({ email })

        if (isExist) return res.status(400).json({
            message: "User Already Registered"
        })

        const hashedPassword = await passwordHashing(password)

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        const token = await generateToken(user._id, email, user.role)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        res.status(200).json({
            message: "User Is Created",
            user,
            token
        })

    } catch (error) {
        console.log(`Some Error Has Occured  ${error}`);
        res.status(400).json({
            message: `Error While Registering The User ${error}`
        })
    }
}

const userLogin = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({
            message: "Enter All Credentials"
        })

        const user = await userModel.findOne({
            email
        })

        if (!user) return res.status(404).json({
            message: "No User Has Found "
        })

        const isMatch = await bcryptjs.compare(password, user.password)

        if (!isMatch) return res.status(401).json({
            message: "not password matched "
        })

        const token = await generateToken(
            user._id,
            user.email,
            user.role
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        res.status(200).json({
            message: "My User Logged In",
            token,
            user
        })

    } catch (error) {
        console.log(`Some Error Has Occured While Loggin You In  ${error}`);
        res.status(400).json({
            message: `error in login ${error}`
        })
    }
}



const userLogout = async (req, res) => {
    try {
        const token = req.cookies.token

        if (!token) return res.status(400).json({
            message: "no Token Has Been Found From The DataBase"
        })

        await tokenModel.create({ token })

        res.clearCookie("token")
        res.status(200).json({
            message: "Cookie destroyed"
        })

    } catch (error) {
        console.log(`Some Error Has Been Found While Loggin User Out ${error}`);
        res.status(400).json({
            message: `error in logout ${error}`
        })
    }
}


const getProfile = async (request, res) => {

    try {
        const user = await userModel.findById(
            request.user.userId
        ).select("-password")

        if (!user) return res.status(400).json({
            message: 'no user find '
        })


        res.status(200).json({
            message: "My User ",

            user
        })

    } catch (error) {
        console.log(`error in getting the use  ${error}`);
        res.status(400).json({
            message: `error in getting the user ${error}`
        })
    }

}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getProfile
}