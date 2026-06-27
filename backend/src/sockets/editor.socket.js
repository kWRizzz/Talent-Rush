const { 
    CODE_CHANGE, 
    LANGUAGE_CHANGE

}= require('./constants')


const editSocket= async (
    io,
    socket
) => {
    socket.on(
        CODE_CHANGE,
        ({roomId,code})=>{
            socket.to(roomId).emit(
                CODE_CHANGE,
                {
                    code
                }
            )
        }
    )

    socket.on(
        LANGUAGE_CHANGE,
        ({roomId,Language})=>{
            
        }
    )
}