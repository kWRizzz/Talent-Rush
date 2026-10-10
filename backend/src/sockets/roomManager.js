const rooms = new Map();

const addUser = (roomId, user) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, []);
    }
    const users = rooms.get(roomId);
    const existingIdx = users.findIndex(u => u.socketId === user.socketId);
    if (existingIdx !== -1) {
        users[existingIdx] = user;
    } else {
        users.push(user);
    }
};

const removeUser = (roomId, socketId) => {
    if (!rooms.has(roomId)) return;
    const users = rooms.get(roomId);
    const filtered = users.filter(u => u.socketId !== socketId);
    rooms.set(roomId, filtered);
};

const getUsers = (roomId) => {
    return rooms.get(roomId) || [];
};

const findRoomBySocket = (socketId) => {
    for (const [roomId, users] of rooms.entries()) {
        if (Array.isArray(users) && users.some(u => u.socketId === socketId)) {
            return roomId;
        }
    }
    return null;
};

const deleteEmptyRoom = (roomId) => {
    const users = rooms.get(roomId);
    if (users && users.length === 0) {
        rooms.delete(roomId);
    }
};

module.exports = {
    addUser,
    removeUser,
    getUsers,
    findRoomBySocket,
    deleteEmptyRoom
};