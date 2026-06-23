const EVENT= require('./event')

module.exports=(io)=>{

    io.on("connected",(socket)=>{
        console.log( "Connected  " + socket.id);
        
        socket.on(EVENT.JOIN_ROOM,(roomId,userId)=>{
            socket.join(roomId)
            console.log(` ${socket.id} , ${userId} && ${roomId}`);
            
            socket.to(roomId).emit(
                EVENT.USER_JOINED,
                {
                    userId
                }
            )
        })

        socket.on("disconnect",()=>{
            console.log( socket.id+ " User disconnected");
            
        })
    })
}