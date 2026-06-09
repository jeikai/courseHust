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
import { getQuizByIdWithoutFormatTime } from "../api/quiz.jsx";
import { ViewContext } from "../context/View.jsx";
import { useAPI } from "../hooks/api.jsx";
import Loader from "../components/Loader.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Axios } from "axios";

const QuizLesson = () => {
  const { id, courseId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const viewContext = useContext(ViewContext);
  let responseAPI;

  // let toggle = false;

  const [lesson, setLesson] = useState(null);
  const [start, setStart] = useState(
    localStorage.getItem(`${userId}_${id}_time`) || null
  );
  const handleStartQuiz = () => {
    console.log("Start quiz"); 
    let duration = lesson?.duration;
    let startTime = new Date().getTime();
    let durationParts = duration.split(":"); 
    let hours = parseInt(durationParts[0]);
    let minutes = parseInt(durationParts[1]);
    let seconds = parseInt(durationParts[2]);
    let endTime = new Date(
      startTime + hours * 3600000 + minutes * 60000 + seconds * 1000
    ).getTime();
    localStorage.setItem(`${userId}_${id}_time`, endTime);
    setStart(endTime);
  };

  useEffect(() => {
    // fetchQuestions()
    getQuizByIdWithoutFormatTime(id)
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
            {!start ? (
              <Quiz handleStartQuiz={handleStartQuiz} />
            ) : (
              lesson && <Questions lesson={lesson} quizId={id} courseId={courseId} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default QuizLesson;
