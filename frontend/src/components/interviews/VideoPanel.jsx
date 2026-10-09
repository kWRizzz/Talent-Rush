import React, { useEffect, useRef } from 'react'

import {
  useSelector
} from "react-redux"


import {
  getLocalStream,
  addLocalTrack,
  createoffer,
  createAnswer,
  getPeerConnection
} from "../../services/webrtc.service"
import { getSocket } from '../../services/socket.service'

const VideoPanel = ({ interviewId }) => {

  const handleOffer = async ({ offer, senderId }) => {
    try {
      const offer = await createoffer();
      const socket = getSocket();
      const answer = await createAnswer(offer);

      socket.emit("answer", {
        interviewId,
        answer,
        targetId: senderId
      })

    } catch (error) {
      console.log(
        "acnt start offer "
        + error
      )
    }
  }

  useEffect(() => {
    const socket = getSocket();
    socket.on("offer", handleOffer);


    const handleAnswer = async ({ answer }) => {
      try {
        const peer = addLocalTrack();
        if (!peer) {
          console.error("Peer connection not initialized");
          return;
        }
        await peer.setRemoteDescription(
          new RTCSessionDescription(answer)
        )
        console.log("Remote answer set successfully");
      } catch (error) {
        console.log(error);
      }
      socket.on("answer", handleAnswer)

      return () => {
        socket.off("offer", handleOffer);
        socket.off("answer",handleAnswer);
      }
    }

  }, [interviewId])


  const videoRef = useRef(null);

  useEffect(() => {

    const startCamera = async () => {
      try {
        const stream = await getLocalStream();
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const peer=getPeerConnection();
        const socket=getSocket();
        if(peer){
          peer.onicecandidate =(event)=>{
            if(event.candidate){
              socket.emit("ice-candidate",{
                interviewId,
                candidate:event.candidate
              })
            }
          }
        }

        await addLocalTrack();
      } catch (error) {
        console.log("error in camera" + error);
      }
    }
    startCamera()
  }, [])


  return (

    <div className="border rounded p-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full"
      />
      <button
        onClick={handleOffer}
        className="border px-3 py-2 rounded mt-2"
      >
        connect
      </button>
    </div>
  )
}

export default VideoPanel