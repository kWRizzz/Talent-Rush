const {
    SEND_MESSAGE,
    RECIEVE_MESSAGE
}=require("./constants")

const chatSocket= (io,socket)=>{

    socket.on(
        SEND_MESSAGE,
        ({roomId,message,sender})=>{
            socket.to(roomId).emit(
                RECIEVE_MESSAGE,
                {
                    message,
                    sender
                }
            )
        }
    )

    
}

module.exports=chatSocket   