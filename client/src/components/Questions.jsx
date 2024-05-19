import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Pagination,
  Popconfirm,
  Progress,
  Radio,
  Space,
  Typography,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import Question from "./Question";
import { getQuizById } from "../api/quiz";
import { ViewContext } from "../context/View";
import { useContext } from "react";

const Questions = ({ lesson, quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [duration, setDuration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const viewContext = useContext(ViewContext);

  useEffect(() => {
    // fetchQuestions()
    console.log(lesson);
    let newListAnswers = lesson?.questions.map((question) => {
      return {
        id: question.id,
        choices: [],
      };
    });
    console.log(newListAnswers);
    setAnswers(newListAnswers);
    setQuiz(lesson);
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz?.questions?.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleCalculateScore = (lesson, answers) => {
    try {
      let diemSo = 0;
      let soCauDung = 0;
      const soCauHoi = lesson.length;
      for (const cauHoiLesson of lesson) {
        for (const cauTraLoiAnswer of answers) {
          if (cauHoiLesson.id === cauTraLoiAnswer.id) {
            if (cauTraLoiAnswer.choices[0] === cauHoiLesson.answer) {
              soCauDung++;
              break;
            }
          }
        }
      }

      diemSo = (soCauDung / soCauHoi) * 10;
      return diemSo.toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };
  const handleOk = () => {
    handleCalculateScore(lesson.questions, answers);
    showModal();
    setConfirmLoading(true);
    setOpen(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleOkModal = async () => {
    try {
      setIsModalOpen(false);
    } catch (error) {
      viewContext.handleError(error.toString());
    }
  };
  const handleCancelModal = () => {
    setIsModalOpen(false);
  };
  const handleGetTime = () => {
    let endTime = localStorage.getItem(`${quizId}_time`);
    console.log(endTime);
    let now = new Date().getTime();
    let time = endTime - now;

    if (time.toString() === "00:00:00") {
      // handleSubmit Question
      // handleOk()

      localStorage.removeItem(`${quizId}_time`);
      return;
    }

    let hours = Math.floor(time / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    setDuration(formattedTime);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      handleGetTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 shadow-lg text-base">
      <Flex align="center" justify="space-between">
        <Typography.Title level={3}>{quiz?.title}</Typography.Title>
        <Flex align="center" justify="center" gap={6} className="text-red-500">
          <ClockCircleOutlined />
          <p>{duration}</p>
        </Flex>
      </Flex>
      <Divider />
      <Flex align="center" justify="space-between" className="mb-2">
        <p>Exam process: </p>
        <p>
          Question {currentQuestion} out of {quiz?.questions?.length}{" "}
        </p>
      </Flex>
      <Progress
        percent={(currentQuestion / quiz?.questions.length).toFixed(2) * 100}
      />
      {quiz && (
        <Question
          question={quiz?.questions[currentQuestion - 1]}
          answers={answers}
          current={currentQuestion}
          setAnswers={setAnswers}
        />
      )}
      <Modal
        title="My score"
        open={isModalOpen}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
      >
        <p>{handleCalculateScore(lesson.questions, answers)}/10</p>
      </Modal>
      <Flex justify="space-between" align="center" className="mt-4">
        <Button
          onClick={() => handlePrev()}
          className="bg-[#754FFE] text-white px-8"
          size="large"
        >
          Prev
        </Button>
        <Pagination
          style={{ marginBottom: 0 }}
          onChange={(e) => setCurrentQuestion(e)}
          total={quiz?.questions?.length}
          defaultPageSize={currentQuestion}
          current={currentQuestion}
        />

        {currentQuestion < quiz?.questions?.length && (
          <Button
            onClick={() => handleNext()}
            className="bg-[#754FFE] text-white px-8"
            size="large"
          >
            Next
          </Button>
        )}

        {currentQuestion === quiz?.questions?.length && (
          <Popconfirm
            title="Bạn có chắc chắn nộp bài không?"
            description=""
            open={open}
            onConfirm={() => handleOk()}
            okButtonProps={{
              loading: confirmLoading,
            }}
            onCancel={() => handleCancel()}
          >
            <Button
              onClick={showPopconfirm}
              className="bg-[#754FFE] text-white px-8"
              size="large"
            >
              Submit
            </Button>
          </Popconfirm>
        )}
      </Flex>
    </div>
  );
};

export default Questions;
