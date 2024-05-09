import React, { useEffect, useState } from "react";
import Bread from "../../components/Bread";
import { Col, Divider, Flex, Row, Space, Typography } from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  FileOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
// import QuizData from '../../db/QuizData'
import Spring from "../../components/Spring";
import { deleteQuiZ, getQuizs } from "../../api/quiz";
import { da } from "@faker-js/faker";

const Quiz = () => {
  const breadcrumb = [
    {
      title: "Home",
      href: "",
    },
    {
      title: "Quiz",
    },
  ];
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      getQuizs().then((quizs) => {
        setData(quizs);
      });
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }, []);
  const handleDeleteQuiz = async (id) => {
    debugger;
    console.log(id);
    const status = await deleteQuiZ(id);

    if (status) {
      let newData = data;
      let index = newData.findIndex((item) => item.id === id);
      newData.splice(index, 1);
      setData((prev) => [...newData]);
    }
    console.log(status);
  };
  return (
    <section>
      <Bread
        title="Quiz"
        items={breadcrumb}
        label={"Add new quiz"}
        link={"/admin/add_quiz"}
      />
      <div className="shadow-md border bg-white p-8">
        {data.map((quiz, index) => {
          return (
            <Spring index={index} key={quiz.id}>
              <Row align="middle">
                <Col span={20}>
                  <Space direction="vertical">
                    <Typography.Title level={4} style={{ marginBottom: 0 }}>
                      {quiz.title}
                    </Typography.Title>
                    <Flex gap={16}>
                      <Flex
                        align="center"
                        className="text-sm text-[#64748b]"
                        gap={4}
                      >
                        <UnorderedListOutlined />
                        <span>{quiz.numberOfQuestions} Questions</span>
                      </Flex>
                      <Flex
                        align="center"
                        className="text-sm text-[#64748b]"
                        gap={4}
                      >
                        <ClockCircleOutlined />
                        {/* <span>{quiz.duration} Minutes</span> */}
                      </Flex>
                      <Link className="group">
                        <Flex
                          align="center"
                          className="group-hover:text-[#754FFE] text-sm text-[#64748b]"
                          gap={4}
                        >
                          <FileOutlined />
                          <span>Result</span>
                        </Flex>
                      </Link>
                    </Flex>
                  </Space>
                </Col>
                <Col span={4}>
                  <Flex
                    justify="flex-end"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    <DeleteOutlined className="text-base text-red-600" />
                  </Flex>
                </Col>
                <Divider />
              </Row>
            </Spring>
          );
        })}
      </div>
    </section>
  );
};

export default Quiz;
