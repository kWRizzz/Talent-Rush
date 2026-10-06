import React, { useEffect, useRef } from 'react'

import {
  getLocalStream,
  addLocalTrack
} from "../../services/webrtc.service"

const VideoPanel = () => {

  const videoRef = useRef(null);

  useEffect(() => {

    const startCamera = async () => {
      try {
        const stream = await getLocalStream();
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
    </div>
  )
}

export default VideoPanel