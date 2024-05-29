import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Flex,
  Pagination,
  Popconfirm,
  Progress,
  Radio,
  Row,
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
    setConfirmLoading(true);

    // Call api gửi đáp án

    localStorage.removeItem(`${quizId}_time`);
    setOpen(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleGetTime = () => {
    let endTime = localStorage.getItem(`${quizId}_time`);
    console.log(endTime);
    let now = new Date().getTime();
    let time = endTime - now;

    if (time <= 0) {
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
      <Row gutter={12}>
        <Col span={16}>
          <Flex align="center" justify="space-between">
            <Typography.Title level={3}>{quiz?.title}</Typography.Title>
            {/* <Flex align='center' justify='center' gap={6} className='text-red-500'>
              <ClockCircleOutlined />
              <p>{duration}</p>
            </Flex> */}
          </Flex>
          <Divider />
          <Flex align="center" justify="space-between" className="mb-2">
            <p>Exam process: </p>
            <p>
              Question {currentQuestion} out of {quiz?.questions?.length}{" "}
            </p>
          </Flex>
          <Progress
            percent={(currentQuestion / quiz?.questions.length) * 100}
          />
          {quiz && (
            <Question
              question={quiz?.questions[currentQuestion - 1]}
              answers={answers}
              current={currentQuestion}
              setAnswers={setAnswers}
            />
          )}
          <Flex justify="space-between" align="center" className="mt-4">
            <Button
              onClick={() => handlePrev()}
              className="bg-[#754FFE] text-white px-8"
              size="large"
            >
              Prev
            </Button>

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
                onConfirm={handleOk}
                okButtonProps={{
                  loading: confirmLoading,
                }}
                onCancel={handleCancel}
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
        </Col>
        <Col span={8}>
          <div className="border p-4">
            <Flex align="center" justify="space-between" className="mb-4">
              <Typography.Title level={5}>Thời gian làm bài: </Typography.Title>
              <Flex
                align="center"
                justify="center"
                gap={6}
                className="text-red-500"
              >
                <ClockCircleOutlined />
                <p>{duration}</p>
              </Flex>
            </Flex>
            <Flex align="start">
              <ul className="ant-pagination css-dev-only-do-not-override-1xg9z9n flex items-start flex-wrap">
                {/* <li title="Previous Page" class="ant-pagination-prev" aria-disabled="false">
                  <button class="ant-pagination-item-link" type="button" tabindex="-1" disabled="">
                    <span role="img" aria-label="left" class="anticon anticon-left">
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
                    </span>
                  </button>
                </li> */}
                {quiz?.questions?.map((q, index) => {
                  return (
                    <li
                      key={index}
                      class={`inline-block min-w-[32px] h-[32px] mr-2 leading-[30px] text-center list-none bg-transparent border rounded-md cursor-pointer outline-none select-none hover:bg-[rgba(0, 0, 0, 0.06)] ant-pagination-item-${
                        index + 1
                      } mb-2 ${
                        currentQuestion === index + 1
                          ? "ant-pagination-item-active text-[#1677ff] border-[#1677ff]"
                          : ""
                      }`}
                      onClick={() => setCurrentQuestion(index + 1)}
                    >
                      <a rel="nofollow">{index + 1}</a>
                    </li>
                  );
                })}
                {/* <li title="Next Page" tabindex="0" class="ant-pagination-next" aria-disabled="false">
                  <button class="ant-pagination-item-link" type="button" tabindex="-1"><span role="img" aria-label="right" class="anticon anticon-right"><svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg></span></button>
                </li> */}
              </ul>
              {/* <Pagination style={{ marginBottom: 0 }} onChange={(e) => setCurrentQuestion(e)} total={quiz?.questions?.length} defaultPageSize={currentQuestion} current={currentQuestion} /> */}
            </Flex>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Questions;
