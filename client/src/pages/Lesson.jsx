import { PlayCircleFilled, PlayCircleOutlined, PlayCircleTwoTone, SettingOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Collapse,
  Divider,
  Flex,
  Row,
  Space,
  TimePicker,
  Typography,
  message
} from "antd";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import Video from "../components/Video";
import Quiz from "../components/Quiz";
import Questions from "../components/Questions";
import { getQuizById } from "../api/quiz";
import { ViewContext } from "../context/View.jsx";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { da } from "@faker-js/faker";
import ImageBanner from "../assets/banner/img-lesson-bg.png";

const Lesson = () => {
  const { lessonId, courseId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const viewContext = useContext(ViewContext);
  let responseAPI = useAPI(`/api/lesson/${lessonId}`, null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const handleDone = async () => {
    try {
      const data = {
        userId: userId,
        courseId: courseId,
        lessonId: lessonId,
      };

      const responseUpdate = await Axios({
        url: "/api/process/lesson",
        method: "PUT",
        data: data,
      });

      message.success("Congratulation, you have done this lesson.")
    } catch (error) {
      viewContext.handleError(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPlaying || time == responseAPI.data?.duration) {
        clearInterval(intervalId);
      } else if (isPlaying && time < (responseAPI.data?.duration * 2) / 3) {
        setTime((prevTime) => prevTime + 0.1);
      } else if (time >= (responseAPI.data?.duration * 2) / 3) {
        clearInterval(intervalId);
        setTime(responseAPI.data?.duration);
        handleDone();
      }
    }, 100);

    return () => clearInterval(intervalId); 
  }, [isPlaying, time, responseAPI.data?.duration]);

  if (responseAPI.loading) return <Loader />;

	return (
		<>
			<div className="mt-[64px] grid grid-cols-[400px_auto]">
				<div className="h-full p-4 shadow-lg bg-[#F8F9FF]">
					<Typography.Title level={4} className="p-3">
						Course Content
					</Typography.Title>
					<Collapse className="bg-[#DEE9F3]" ghost expandIconPosition={"end"}>
						<Collapse.Panel
							header={<Typography.Title
								className="w-full hover:text-[#754FFE]"
								level={5}
							>
								{responseAPI.data.title}
							</Typography.Title>}
							key="1"
						>
							<Space direction="vertical" className="w-full">
								<Flex align="center" gap={12} className="px-3 py-2 rounded-md">
									<Link className="flex-1 group">
										<Flex justify="space-between">
											<Flex vertical>
												<p className="font-semibold text-base group-hover:text-[#754FFE]">
													{responseAPI.data.content}
												</p>
												<span className="text-[#6c757d]">
													{responseAPI?.data?.date_created}
												</span>
											</Flex>
											<p className="text-[#6c757d] text-base font-medium">
												{responseAPI.data.duration.toFixed(2)} second
											</p>
										</Flex>
									</Link>
								</Flex>
								<Divider type="horizontal" />
							</Space>
						</Collapse.Panel>
					</Collapse>
				</div>

				<div className="p-0">
					<div className="lesson-banner absolute -z-10">
						<img className="w-[2000px]" src={ImageBanner} alt="Lesson Banner" />
					</div>

					<div className="video-container border w-[800px] h-[600px] m-auto pt-3">
						<Video
							video={responseAPI.data.videoURL}
							setIsPlaying={setIsPlaying} />

						<div className="lesson-info p-10 mt-[30px]">
							<div className="lesson-title flex gap-5 text-primary-blue">
								<PlayCircleFilled className="play-icon" style={{ fontSize: '20px' }} />
								<h3 className="text-bold">{responseAPI.data.title}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Lesson;
