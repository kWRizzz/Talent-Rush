const rooms = new Map();

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

module.exports = {

    addUser,

    removeUser,

    getUsers

};