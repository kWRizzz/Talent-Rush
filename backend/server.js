const express= require('express')
const dotenv= require('dotenv')
const connectDB=require('./src/lib/db')
const cors= require("cors")
const cookiepareser=require('cookie-parser')
const userRouter=require('./src/routes/user.routes')
const interviewRouter=require('./src/routes/interview.routes')
const initializeScoket= require("./src/sockets/index")
const questionRoute= require('./src/routes/question.routes')
const http=require('http')



const path=require('path')

dotenv.config()
connectDB()

const _dirname=path.resolve()
const app= express()

const server= http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true
}))

app.use(cookiepareser())

app.use('/api/user',userRouter)
app.use('/api/interview',interviewRouter)
app.use('/api/question',questionRoute)

/**
* @Route Test apis
*
*/

app.get('/test1',(req,res)=>{
    res.send("Test1")
})


/**
 * 
* @Route Test apis
*
*/

app.get('/test2',(req,res)=>{
    res.send("Test2")
})

// app for production ready state

// if(process.env.NODE_ENV==="production"){
//     app.use(express.static(path.join(_dirname,"../frontend/dist")))

//     app.get("/{*any}",(req,res)=>{
//         res.sendFile(path.join(_dirname,"..frontend","dist","index.html"))
//     })
// }

initializeScoket(server)

server.listen(process.env.PORT,()=>{
    console.log("server now started")
})