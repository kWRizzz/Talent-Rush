module.exports=(io)=>{

    io.on("connected",(socket)=>{
        console.log(socket.id);
        
        socket.on("join-room",(roomId)=>{
            socket.join(roomId)
            console.log(` ${socket.id} && ${roomId}`);
            
        })

        socket.on("disconnect",()=>{
            console.log(  "User disconnected");
            
        })
    })
}