const {
    Server
}=require('socket.io')
const roomSocket= require('./room.socket')
const editorSocket= require('./editor.socket')
const videoSocket= require('./video.socket')
const chatSocket = require('./chat.socket')

const initializeScoket= (server)=>{
    const io= new Server(server,{
        cors:{
            origin:process.env.CLIENT_URL,
            credentials:true
        }
    })

    io.on("connection",(socket)=>{
        console.log( `Socket Connected : ${socket.id}`);
        roomSocket(io,socket);
        editorSocket(io,socket);
        videoSocket(io,socket);
        chatSocket(io,socket);
    })
}

module.exports=initializeScoket