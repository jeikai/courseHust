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
  let responseAPI;

  // let toggle = false;

  const [lesson, setLesson] = useState(null);
  const [start, setStart] = useState(
    localStorage.getItem(`${id}_time`) || null
  );
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
    localStorage.setItem(`${id}_time`, endTime);
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
        <Col span={24} pull={0}>
          <div className="mb-4 mt-2">
            {/* <TimePicker onChange={(value) => console.log(value.format('hh-mm-ss'))} /> */}
            {/* <Video video={responseAPI.data.videoURL}/> */}
            {!start ? (
              <Quiz handleStartQuiz={handleStartQuiz} />
            ) : (
              lesson && <Questions lesson={lesson} quizId={id} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default QuizLesson;
