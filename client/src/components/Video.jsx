import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Loader from "./Loader";
import axios from "axios";

const Video = ({ video, setIsPlaying }) => {
  const [videoContent, setVideoContent] = useState("");
  const [isLoading, setLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const convertVideo = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/video", { video });

        const data = response?.data;
        console.log(data);
        if (data.videoContent) {
          setVideoContent(data.videoContent);
        } else {
          console.error("Failed to convert video");
        } 
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    }; 
    if (video) {
      convertVideo();
    }
  }, [video]);

  useEffect(() => {
    if (videoContent) {
      try {
        const byteCharacters = atob(videoContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        if (videoRef.current) {
          const player = videojs(videoRef.current, {
            autoplay: true,
            controls: true,
            sources: [{
              src: url,
              type: "video/mp4",
            }],
          });

          player.on('play', () => setIsPlaying(true));
          player.on('pause', () => setIsPlaying(false));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [videoContent, setIsPlaying]);

  if (isLoading) return <Loader />;
  return (
    <div className="max-w-[1200px] h-[720px]">
      <div>
        <video ref={videoRef} className="video-js" controls preload="auto" width="640" height="264" data-setup="{}">
        </video>
      </div>
    </div>
  );
};

export default Video;
