const rooms = new Map();
const userModel= require('../models/User')
const addUser = (
    roomId,
    user
) => {

    if (!rooms.has(roomId)) {

        rooms.set(roomId, []);

    }

    rooms.get(roomId).push(user);

};

const removeUser = (
    roomId,
    socketId
) => {

    if (!rooms.has(roomId))
        return;

    const users =
    rooms.get(roomId);

    const filteredUsers =
    users.filter(
        (user)=>
        user.socketId !== socketId
    );

    rooms.set(
        roomId,
        filteredUsers
    );

};

const getUsers = (
    roomId
)=>{

    return rooms.get(roomId) || [];

};

const findRoomBySocket=(
    socketId
)=>{

    for(const [roomId,user] of rooms.entries()){
        const user= userModel.find(
            (u)=>u.socketId=== socketId
        )
        if(user){
            return roomId
        }
        
    }
    return false;
}

const deleteEmptyRoom=(
    roomId
)=>{
    const user= rooms.get(roomId);

    if( user && user.length==0){
        rooms.delete(roomId)
    }
}


module.exports = {

    addUser,

    removeUser,

    getUsers,

    findRoomBySocket,

    deleteEmptyRoom

};