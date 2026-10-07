const{
    OFFER,
    ANSWER,
    ICE_CANDIDATE
}= require('./constants')


const videoSocket= (io,socket)=>{

    socket.on(
        OFFER,
        ({roomId,offer})=>{
            socket.to(roomId).emit(
                OFFER,
                {offer}
            )
        }
    )

    socket.on(
        ANSWER,
        ({roomId,answer})=>{
            socket.to(roomId).emit(
                ANSWER,
                {answer}
            )
        }
    )

    socket.on(
        ICE_CANDIDATE,
        ({roomId,candidate})=>{
            ICE_CANDIDATE,
            {candidate}
        }
    )
}

const registerVideoSocket=async (io,socket) => {
    socket.on(
        OFFER,({interviewId,offer})=>{
            socket.to(interviewId).emit(OFFER,{
                offer,
                senderId:socket.roomId
            })
        }
    )
}
module.exports={
    videoSocket,
    registerVideoSocket 
    
}