const {Server} = require('socket.io')


const initializeScoket= async (server) => {
    const io= new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })
}

module.exports=  initializeScoket