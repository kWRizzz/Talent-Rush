/**
 * Video Socket Handler
 * Relays WebRTC signaling (Offer, Answer, ICE candidates) between peers
 */

const videoSocket = (io, socket) => {

    socket.on("offer", ({ interviewId, roomId, offer }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (!targetRoom || !offer) return;

        socket.to(targetRoom).emit("offer", {
            offer,
            senderId: socket.id
        });
    });

    socket.on("answer", ({ interviewId, roomId, answer, targetId }) => {
        if (!answer) return;

        if (targetId) {
            socket.to(targetId).emit("answer", {
                answer,
                senderId: socket.id
            });
        } else {
            const targetRoom = interviewId || roomId || socket.roomId;
            if (targetRoom) {
                socket.to(targetRoom).emit("answer", {
                    answer,
                    senderId: socket.id
                });
            }
        }
    });

    socket.on("ice-candidate", ({ interviewId, roomId, candidate, targetId }) => {
        if (!candidate) return;

        if (targetId) {
            socket.to(targetId).emit("ice-candidate", {
                candidate,
                senderId: socket.id
            });
        } else {
            const targetRoom = interviewId || roomId || socket.roomId;
            if (targetRoom) {
                socket.to(targetRoom).emit("ice-candidate", {
                    candidate,
                    senderId: socket.id
                });
            }
        }
    });

    socket.on("camera-toggle", ({ enabled, interviewId, roomId }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom) {
            socket.to(targetRoom).emit("peer-camera-toggle", {
                senderId: socket.id,
                enabled
            });
        }
    });

    socket.on("mic-toggle", ({ enabled, interviewId, roomId }) => {
        const targetRoom = interviewId || roomId || socket.roomId;
        if (targetRoom) {
            socket.to(targetRoom).emit("peer-mic-toggle", {
                senderId: socket.id,
                enabled
            });
        }
    });
};

module.exports = videoSocket;
module.exports.videoSocket = videoSocket;