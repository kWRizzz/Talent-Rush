const {Server} = require('socket.io')

const interviewSocket =
require("./interview.socket");

const initializeScoket= async (server) => {
    const io= new Server(server,{
        cors:{
            origin:process.env.CLIENT_URL,
            credentials:true
        }
    })
    interviewSocket(io)
}

module.exports=  initializeScoket