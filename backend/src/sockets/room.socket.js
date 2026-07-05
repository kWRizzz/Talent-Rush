const { 
    JOIN_ROOM,
    USER_jOINED,
    LEAVE_ROOM,
    USER_LEFT

 }= require('./constants')

 const {
    addUser,
    removeUser,
    getUsers,
    findRoomBySocket,
    deleteEmptyRoom
} = require("./roomManager");

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
            const roomId= findRoomBySocket(socket.id);
            if(!roomId){
                return;
            }

            removeUser(
                roomId,
                socket.id
            )

            deleteEmptyRoom(roomId)

            const participants= getUsers(roomId);

            io.to(roomId).emit(
                USER_LEFT,
                participants
            )

            console.log(`${socket.id} dissconnected`);
        }
    )
}
module.exports=roomSocket

