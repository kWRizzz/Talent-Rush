/**
 * Chat Socket Handler
 * Handles real-time messaging, typing indicators, and system notices within an interview room.
 */

const registerChatHandlers = (io, socket) => {

    // Primary chat message event
    socket.on("send-message", (data) => {
        try {
            const {
                interviewId,
                roomId,
                message,
                senderName = "Anonymous",
                senderRole = "participant",
                senderId
            } = data || {};

            const targetRoom = interviewId || roomId || socket.roomId;
            if (!targetRoom) {
                console.warn("send-message: No target room specified");
                return;
            }

            if (typeof message !== "string" || !message.trim()) {
                return;
            }

            const messagePayload = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                message: message.trim(),
                senderId: senderId || socket.id,
                senderName,
                senderRole,
                timestamp: new Date().toISOString()
            };

            // Broadcast to everyone else in the room
            socket.to(targetRoom).emit("receive-message", messagePayload);

            // Also emit back to the sender so both sides have identical message payload with ID and timestamp
            socket.emit("message-sent", messagePayload);

        } catch (err) {
            console.error("Error in chat send-message:", err);
        }
    });

    // Legacy / alternate constant support
    socket.on("SEND_MESSAGE", (data) => {
        const { roomId, message, sender } = data || {};
        if (roomId && message) {
            socket.to(roomId).emit("RECIEVE_MESSAGE", {
                message,
                sender,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Typing indicator
    socket.on("typing", ({ interviewId, roomId, senderName }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom) {
            socket.to(targetRoom).emit("user-typing", {
                senderId: socket.id,
                senderName
            });
        }
    });

    socket.on("stop-typing", ({ interviewId, roomId, senderName }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom) {
            socket.to(targetRoom).emit("user-stop-typing", {
                senderId: socket.id,
                senderName
            });
        }
    });
};

module.exports = registerChatHandlers;