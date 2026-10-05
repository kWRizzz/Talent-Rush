let peerConnection = null;
let localStream = null;

const ICE_SERVER = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
}

export const createPeerConnection = () => {
    if (peerConnection) {
        return peerConnection
    }

    peerConnection = new RTCPeerConnection(
        ICE_SERVER
    )

    return peerConnection
}

export const getPeerConnection = () => {
    return peerConnection;
}

export const closePeerConnection = () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null
    }
}

export const getLocalStream = async () => {
    if (localStream) {
        return localStream
    }

    localStream = await navigator.mediaDevices.getUserMedia(
        {
            video: true,
            audio: true
        }
    )
}