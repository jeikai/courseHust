import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import thumbnail from "../assets/image/thumbnail.jpg";
import Loader from "./Loader";
import axios from "axios";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = ({ video, setIsPlaying }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [m3u8Url, setM3u8Url] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const convertVideo = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/video", { video });

        const data = response?.data;
        console.log(data);
        if (data.videoPath) {
          setM3u8Url(data.videoPath);
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
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        sources: [{ src: "http://localhost:5173" + m3u8Url , type: "application/x-mpegURL" }],
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [m3u8Url]);

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
