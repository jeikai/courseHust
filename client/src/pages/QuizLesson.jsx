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
import Video from "../components/Video.jsx";
import Quiz from "../components/Quiz.jsx";
import Questions from "../components/Questions.jsx";
import { getQuizById } from "../api/quiz.jsx";
import { ViewContext } from "../context/View.jsx";
import { useAPI } from "../hooks/api.jsx";
import Loader from "../components/Loader.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Axios } from "axios";

const QuizLesson = () => {
  const { id } = useParams();
  const viewContext = useContext(ViewContext);
  console.log(id);
  let responseAPI;

  // let toggle = false;

  const [lesson, setLesson] = useState(null);
  const [start, setStart] = useState(localStorage.getItem("time") || null);
  const handleStartQuiz = () => {
    console.log("Start quiz");
    // let duaration = lesson.duaration
    let duration = lesson?.duration;
    let startTime = new Date().getTime(); 
    let durationParts = duration.split(":");
    let hours = parseInt(durationParts[0]);
    let minutes = parseInt(durationParts[1]);
    let seconds = parseInt(durationParts[2]);
    let endTime = new Date(
      startTime + hours * 3600000 + minutes * 60000 + seconds * 1000
    ).getTime();
    localStorage.setItem("time", endTime);
    setStart(endTime);
  };

  useEffect(() => {
    // fetchQuestions()
    getQuizById(id)
      .then((res) => {
        console.log(res);
        setLesson(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="py-16 px-4">
      <Row gutter={24}>
        <Col span={8} push={16} className="py-2 shadow-lg h-fit">
          <Typography.Title level={4} className="text-center">
            Quiz
          </Typography.Title>
          <Collapse ghost expandIconPosition={"end"}>
            <Collapse.Panel
              header={
                <Typography.Title
                  className="w-full hover:text-[#754FFE]"
                  level={5}
                >
                  {lesson?.title}
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
                          {responseAPI?.data?.content}
                        </p>
                        <span className="text-[#6c757d]">Jan-04-2024</span>
                      </Flex>
                      <p className="text-[#6c757d] text-base font-medium">
                        {responseAPI?.data?.duration}
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
            {/* <Video video={responseAPI.data.videoURL}/> */}
            {!start ? (
              <Quiz handleStartQuiz={handleStartQuiz} />
            ) : (
              lesson && <Questions lesson={lesson} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default QuizLesson;
