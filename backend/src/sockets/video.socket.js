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

module.exports=videoSocket