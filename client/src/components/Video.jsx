import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Loader from "./Loader";

const Video = ({ video, setIsPlaying }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/video", { video });

        const data = response?.data;
        if (data.videoPath) {
          console.log(data.videoPath)
          setVideoUrl(data.videoPath);
        } else {
          console.error("Failed to fetch video URL");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    if (video) {
      fetchVideoUrl();
    }
  }, [video]);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [videoUrl]);

  if (isLoading) return <Loader />;
  return (
    <div className="max-w-[1200px] h-[720px]">
      <div>
        <video ref={videoRef} className="video-js vjs-default-skin" />
      </div>
    </div>
  );
};

export default Video;
