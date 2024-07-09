import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Loader from "./Loader";
import axios from "axios";

const Video = ({ video, setIsPlaying }) => {
  const [m3u8Content, setM3u8Content] = useState("");
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
          setM3u8Content(data.videoContent);
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
    if (m3u8Content) {
      try {
        const blob = new Blob([m3u8Content], {
          type: "application/vnd.apple.mpegurl",
        });
        const url = URL.createObjectURL(blob);
        if (videoRef.current) {
          const player = videojs(videoRef.current);
          player.src({
            src: url,
            type: "application/x-mpegURL",
          });
          player.play();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [m3u8Content]);

  if (isLoading) return <Loader />;
  return (
    <div className="max-w-[1200px] h-[720px]">
      <div>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin"
          controls
          preload="auto"
          width="640"
          height="264"
          data-setup="{}"
        ></video>
      </div>
    </div>
  );
};

export default Video;
