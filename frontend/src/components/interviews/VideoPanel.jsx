import React, { useEffect, useRef } from 'react'

import {
  getLocalStream
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
      } catch (error) {
        console.log("error in camera" + error);
      }
    }

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