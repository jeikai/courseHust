import { Button, Flex, Image, Space, Typography } from "antd";
import React from "react";
import svgquiz from "../assets/quiz.svg";
import { useParams } from "react-router-dom";
import { useAPI } from "../hooks/api";

const Quiz = ({ handleStartQuiz }) => {
  const { id } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const responseAPI = useAPI(`/api/historyquiz/${userId}/${id}`, null);

  const formatDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const calculateRemainingDuration = (totalDuration, usedDuration) => {
    const totalSeconds = formatDuration(totalDuration);
    const usedSeconds = formatDuration(usedDuration);
    const remainingSeconds = totalSeconds - usedSeconds;

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Flex
      vertical
      className="py-12 px-4 shadow-lg"
      align="center"
      justify="center"
      gap={12}
    >
      <Image src={svgquiz} preview={false} width={400} height={400} />
      <Typography.Title level={1}>Welcome to Quiz</Typography.Title>
      <Typography.Text
        className="text-lg w-2/4 text-center"
        style={{ color: "#64748b" }}
      >
        Engage live or asynchronously with quiz and poll questions that
        participants complete at their own pace.
      </Typography.Text>
      <Button
        onClick={() => handleStartQuiz()}
        className="bg-[#754FFE] font-semibold text-white"
        size="large"
      >
        Start your quiz
      </Button>
      {responseAPI?.data?.data?.map((history, index) => (
        <div key={index} className="mt-8 p-4 w-full max-w-2xl border rounded">
          <Typography.Title level={4}>
            Quiz: {history.quizId.title}
          </Typography.Title>
          <Typography.Text>
            Correct: {history.correctCount} / {history.quizId.ques.length}
          </Typography.Text>
          <br />
          <Typography.Text>
            Remaining Duration:{" "}
            {calculateRemainingDuration(
              history.quizId.duration,
              history.duration
            )}
          </Typography.Text>
        </div>
      ))}
    </Flex>
  );
};

export default Quiz;
