
import { useCallback, useEffect, useRef } from "react";

import {
  getLocalStream,
  addLocalTracks,
  createOffer,
  createAnswer,
  getPeerConnection,
  closePeerConnection,
} from "../../services/webrtc.service";

import { getSocket } from "../../services/socket.service";

const VideoPanel = ({ interviewId }) => {
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const remoteSocketIdRef = useRef(null);
  const pendingLocalCandidatesRef = useRef([]);
  const pendingRemoteCandidatesRef = useRef([]);

  const ensureMedia = useCallback(async () => {
    const stream = await getLocalStream();

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const peer = await addLocalTracks();

    peer.ontrack = (event) => {
      const remoteStream = event.streams?.[0];

      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    peer.onicecandidate = (event) => {
      if (!event.candidate) return;

      const candidate = event.candidate.toJSON();
      const targetId = remoteSocketIdRef.current;

      // Offer ke answer se pehle candidates queue karo.
      if (!targetId) {
        pendingLocalCandidatesRef.current.push(candidate);
        return;
      }

      getSocket().emit("ice-candidate", {
        interviewId,
        candidate,
        targetId,
      });
    };

    return peer;
  }, [interviewId]);

  const flushLocalCandidates = useCallback(() => {
    const socket = getSocket();
    const targetId = remoteSocketIdRef.current;

    if (!targetId) return;

    const candidates = pendingLocalCandidatesRef.current.splice(0);

    candidates.forEach((candidate) => {
      socket.emit("ice-candidate", {
        interviewId,
        candidate,
        targetId,
      });
    });
  }, [interviewId]);

  const handleOffer = useCallback(
    async ({ offer, senderId }) => {
      try {
        remoteSocketIdRef.current = senderId;

        await ensureMedia();

        const answer = await createAnswer(offer);

        getSocket().emit("answer", {
          interviewId,
          answer,
          targetId: senderId,
        });

        flushLocalCandidates();
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    },
    [ensureMedia, flushLocalCandidates, interviewId]
  );

  const handleAnswer = useCallback(
    async ({ answer, senderId }) => {
      try {
        remoteSocketIdRef.current = senderId;

        const peer = getPeerConnection();

        if (!peer) {
          throw new Error("Peer connection not initialized");
        }

        await peer.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        // Remote description set hone ke baad queued ICE add karo.
        const candidates = pendingRemoteCandidatesRef.current.splice(0);

        for (const candidate of candidates) {
          await peer.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }

        flushLocalCandidates();

        console.log("Remote answer set successfully");
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    },
    [flushLocalCandidates]
  );

  const handleIceCandidate = useCallback(async ({ candidate }) => {
    try {
      const peer = getPeerConnection();

      if (!peer) return;

      if (!peer.remoteDescription) {
        pendingRemoteCandidatesRef.current.push(candidate);
        return;
      }

      await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }, []);

  const handleConnect = async () => {
    try {
      const peer = await ensureMedia();

      if (peer.signalingState !== "stable") {
        console.warn("Peer is already negotiating");
        return;
      }

      const offer = await createOffer();

      getSocket().emit("offer", {
        interviewId,
        offer,
      });

      console.log("Offer sent");
    } catch (error) {
      console.error("Could not start video connection:", error);
    }
  };

  useEffect(() => {
    const socket = getSocket();

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    const startCamera = async () => {
      try {
        await ensureMedia();
      } catch (error) {
        console.error("Could not start camera:", error);
      }
    };

    startCamera();

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);

      pendingLocalCandidatesRef.current = [];
      pendingRemoteCandidatesRef.current = [];
      remoteSocketIdRef.current = null;

      closePeerConnection();
    };
  }, [
    ensureMedia,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
  ]);

  return (
    <div className="border rounded p-3 space-y-3">
      <div>
        <p className="text-sm mb-1">Your Video</p>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded"
        />
      </div>

      <div>
        <p className="text-sm mb-1">Remote Participant</p>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded"
        />
      </div>

      <button
        onClick={handleConnect}
        className="border px-3 py-2 rounded"
      >
        Connect Video
      </button>
    </div>
  );
};

export default VideoPanel;
