const {
    addUser,
    removeUser,
    getUsers,
    findRoomBySocket,
    deleteEmptyRoom
} = require("./roomManager");

const roomSocket = (io, socket) => {

    const handleJoin = ({ roomId, interviewId, user }) => {
        const targetRoom = roomId || interviewId;
        if (!targetRoom) return;

        socket.join(targetRoom);
        socket.roomId = targetRoom;
        socket.userData = user || { socketId: socket.id, name: "Participant" };

        const userInfo = {
            socketId: socket.id,
            ...(typeof user === "object" ? user : { name: user || "Participant" })
        };

        addUser(targetRoom, userInfo);
        console.log(`Socket ${socket.id} joined room: ${targetRoom}`);

        // Notify others in room
        socket.to(targetRoom).emit("user-joined", {
            user: userInfo,
            socketId: socket.id
        });

        // Send current room participants to all
        const participants = getUsers(targetRoom);
        io.to(targetRoom).emit("room-users", {
            roomId: targetRoom,
            users: participants
        });
    };

    const handleLeave = ({ roomId, interviewId, user }) => {
        const targetRoom = roomId || interviewId || socket.roomId;
        if (!targetRoom) return;

        socket.leave(targetRoom);
        removeUser(targetRoom, socket.id);
        deleteEmptyRoom(targetRoom);

        socket.to(targetRoom).emit("user-left", {
            socketId: socket.id,
            user: user || socket.userData
        });

        const participants = getUsers(targetRoom);
        io.to(targetRoom).emit("room-users", {
            roomId: targetRoom,
            users: participants
        });
    };

    // Support both event names
    socket.on("join-room", handleJoin);
    socket.on("join-interview", handleJoin);

    socket.on("leave-room", handleLeave);
    socket.on("leave-interview", handleLeave);

    // Question synchronization across the room
    socket.on("question-added", ({ interviewId, roomId, question }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom && question) {
            socket.to(targetRoom).emit("question-added", { question });
        }
    });

    socket.on("question-selected", ({ interviewId, roomId, question }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom && question) {
            socket.to(targetRoom).emit("question-selected", { question });
        }
    });

    // Submission notification across the room
    socket.on("solution-submitted", ({ interviewId, roomId, submission, senderName }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom && submission) {
            socket.to(targetRoom).emit("solution-submitted", {
                submission,
                senderName: senderName || "Candidate"
            });
        }
    });

    socket.on("disconnect", () => {
        const targetRoom = socket.roomId || findRoomBySocket(socket.id);
        if (targetRoom) {
            removeUser(targetRoom, socket.id);
            deleteEmptyRoom(targetRoom);

            const participants = getUsers(targetRoom);
            io.to(targetRoom).emit("user-left", {
                socketId: socket.id,
                user: socket.userData
            });
            io.to(targetRoom).emit("room-users", {
                roomId: targetRoom,
                users: participants
            });
            console.log(`Socket ${socket.id} disconnected from room: ${targetRoom}`);
        }
    });
};

module.exports = roomSocket;
