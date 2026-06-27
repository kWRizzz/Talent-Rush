const { 
    JOIN_ROOM,
    USER_jOINED,
    LEAVE_ROOM,
    USER_LEFT

 }= require('./constants')


const roomSocket= async (
    io,
    socket
) => {
    
    socket.on(
        JOIN_ROOM,
        ({roomId,user})=>{
            socket.join(roomId)
            console.log(`${user}`);
            socket.to(roomId).emit(
                USER_jOINED,
                {
                    user
                }
            )
        }
    )

    socket.on(
        LEAVE_ROOM,
        ({roomId,user})=>{
            socket.leave(roomId);
            socket.to(roomId).emit(
                USER_LEFT,
                {
                    user
                }
            )
            console.log(`user left ${user}`)
        }
    )

    socket.on(
        "disconnect",
        ()=>{
            console.log(`user dissconnected`);
        }
    )
}
module.exports=roomSocket

