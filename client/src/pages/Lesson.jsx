import { SettingOutlined } from "@ant-design/icons";
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

const Lesson = () => {
  const { id } = useParams();
  const viewContext = useContext(ViewContext);
  let responseAPI = useAPI(`/api/lesson/${id}`, null);
  console.log(responseAPI);

  let toggle = false;
  if (responseAPI.loading) return <Loader />;
  const handleDoneLesson = async () => {
    try {
      console.log("Done");
    } catch (error) {
      console.log(error);
      viewContext(error);
    }
  };
  // const [lesson, setLesson] = useState(null);
  // const [start, setStart] = useState(localStorage.getItem("time") || null);
  // const handleStartQuiz = () => {
  //   console.log("Start quiz");
  //   // let duaration = lesson.duaration
  //   let duration = "01-00-00";
  //   let startTime = new Date().getTime();
  //   let durationParts = duration.split("-");
  //   let hours = parseInt(durationParts[0]);
  //   let minutes = parseInt(durationParts[1]);
  //   let seconds = parseInt(durationParts[2]);
  //   let endTime = new Date(
  //     startTime + hours * 3600000 + minutes * 60000 + seconds * 1000
  //   ).getTime();
  //   localStorage.setItem("time", endTime);
  //   setStart(endTime);
  // };

  // useEffect(() => {
  //   // fetchQuestions()
  //   getQuizById(1)
  //     .then((res) => {
  //       console.log(res);
  //       setLesson(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="py-16 px-4">
      <Row gutter={24}>
        <Col span={8} push={16} className="py-2 shadow-lg h-fit">
          <Typography.Title level={4} className="text-center">
            Course content
          </Typography.Title>
          <Collapse ghost expandIconPosition={"end"}>
            <Collapse.Panel
              header={
                <Typography.Title
                  className="w-full hover:text-[#754FFE]"
                  level={5}
                >
                  {responseAPI.data.title}
                </Typography.Title>
              }
              key="1"
            >
              <Space direction="vertical" className="w-full">
                <Flex align="center" gap={12} className="px-3 py-2 rounded-md">
                  <Checkbox />
                  <Link className="flex-1 group">
                    <Flex justify="space-between">
                      <Flex vertical>
                        <p className="font-semibold text-base group-hover:text-[#754FFE]">
                          {responseAPI.data.content}
                        </p>
                        <span className="text-[#6c757d]">{responseAPI?.data?.date_created}</span>
                      </Flex>
                      <p className="text-[#6c757d] text-base font-medium">
                        {(responseAPI.data.duration).toFixed(2)} second
                      </p>
                    </Flex>
                  </Link>
                </Flex>
                <Divider type="horizontal" />
              </Space>
            </Collapse.Panel>
          </Collapse>
        </Col>
        <Col span={16} pull={8}>
          <div className="mb-4 mt-2">
            {/* <TimePicker onChange={(value) => console.log(value.format('hh-mm-ss'))} /> */}
            <Video video={responseAPI.data.videoURL} />
            {/* {!start ? (
              <Quiz handleStartQuiz={handleStartQuiz} />
            ) : (
              lesson && <Questions lesson={lesson} />
            )} */}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Lesson;
