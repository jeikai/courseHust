import React, { useState, useEffect } from "react";
import { Progress, Button, Row, Col, Card, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader";

const { Title, Text } = Typography;

const ReviewQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [percent, setPercent] = useState(0);
  const [quote, setQuote] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const responseAPI = useAPI(`/api/historyquiz/${id}`, null);
  console.log(responseAPI);

  const quotes = [
    { min: 0, max: 30, text: "Please try again!" },
    { min: 31, max: 50, text: "Not bad, but there's room for improvement." },
    { min: 51, max: 70, text: "Good job! Keep it up." },
    { min: 71, max: 90, text: "Great work! You're almost there." },
    { min: 91, max: 100, text: "Excellent! You're a star!" },
  ];

  const getQuote = (percent) => {
    const quote = quotes.find((q) => percent >= q.min && percent <= q.max);
    return quote ? quote.text : "Good effort!";
  };

  const convertToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const convertToHHMMSS = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getRemainingTime = (start, end) => {
    const startSeconds = convertToSeconds(start);
    const endSeconds = convertToSeconds(end);
    const remainingSeconds = startSeconds - endSeconds;
    return convertToHHMMSS(remainingSeconds);
  };

  const getColorForPercent = (percent) => {
    if (percent <= 30) {
      return "#ff4d4f"; // red
    } else if (percent <= 60) {
      return "#ffec3d"; // yellow
    } else if (percent <= 90) {
      return "#bae637"; // light green
    } else {
      return "#52c41a"; // green
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else { 
      navigate("/");
    }
  };

  useEffect(() => {
    if (responseAPI.data) {
      const data = responseAPI.data.data; // Assuming you want the first item
      const totalQuestions = data.quizId.ques.length;
      const correctCount = data.correctCount;
      const wrongCount = totalQuestions - correctCount;
      const scorePercent = (correctCount / totalQuestions) * 100;

      setCorrectAnswer(correctCount);
      setWrongAnswer(wrongCount);
      setPercent(scorePercent);
      setQuote(getQuote(scorePercent));
      setDuration(data.duration);
      setQuestions(data.quizId.ques);
      setAnswers(data.listOfAnswer);
    }
  }, [responseAPI.data]);

  if (responseAPI.loading) return <Loader />;
  
  if (!responseAPI.data) return <div>Something went wrong!</div>;

  return (
    <div className="py-16 px-4">
      <Card style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ textAlign: "center" }}>
            <Title level={4}>
              Your time: {getRemainingTime(responseAPI.data.data.quizId.duration, duration)}
            </Title>
            <Progress
              type="circle"
              percent={percent}
              format={(percent) => `${percent}%`}
              width={80}
              strokeColor={getColorForPercent(percent)}
              trailColor={getColorForPercent(percent)}
            />
            <Title level={5}>{quote}</Title>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Text strong>Correct</Text>
            <Title level={2} style={{ color: "green" }}>
              {correctAnswer}
            </Title>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Text strong>Incorrect</Text>
            <Title level={2} style={{ color: "red" }}>
              {wrongAnswer}
            </Title>
          </Col>
          <Col span={24}>
            <Button type="default" block onClick={handleBackClick}>
              Take again!
            </Button>
          </Col>
          <Col span={24}>
            {answers.map((answer, index) => {
              const question = answer.questionId;
              const isCorrect = answer.answer.includes(question.answer[0]);

              return (
                <Card key={index}>
                  <Title
                    level={5}
                    style={{
                      color: answer.answer.length ? (isCorrect ? "green" : "red") : "red",
                    }}
                  >
                    {question.question}
                  </Title>
                  {question.options.map((option, optionIndex) => {
                    const isUserChoice = answer.answer.includes(option);
                    const isCorrectAnswer = option === question.answer[0];

                    let color = "inherit";
                    if (isUserChoice) {
                      color = isCorrect ? "green" : "red";
                    } else if (isCorrectAnswer) {
                      color = "green";
                    }

                    return (
                      <Card.Grid
                        key={optionIndex}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px",
                        }}
                      >
                        <Text style={{ color: color }}>{option}</Text>
                      </Card.Grid>
                    );
                  })}
                </Card>
              );
            })}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ReviewQuiz;
