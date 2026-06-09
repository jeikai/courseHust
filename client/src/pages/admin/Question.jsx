import React, { useEffect, useState } from "react";
import Bread from "../../components/Bread";
import { Button, Col, Divider, Flex, Row, Space, Typography } from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  FileOutlined,
  UnorderedListOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
// import QuizData from '../../db/QuizData'
import Spring from "../../components/Spring";
import { deleteQuiZ, getQuizs } from "../../api/quiz";

import Loader from "../../components/Loader";
import { useAPI } from "../../hooks/api";
import Axios from "axios";

const Question = () => {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const [isLoading, setIsLoading] = useState(true);
  const breadcrumb = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Manage Questions",
    },
  ];
  const [data, setData] = useState([]);
  async function fetchData(userId) {
    try {
      const responseAPI = await Axios({
        url: `/api/question/${userId}/all`,
        method: "GET",
      });

      const arrayFormatData = [];
      responseAPI.data.data.map((question) => {
        if (question._id != null) {
          arrayFormatData.push({
            id: question._id,
            title: question.question,
            level: question.level,
            category: question.categoryId ? question.categoryId.title : "",
            subCategory: question.subcategoryId
              ? question.subcategoryId.title
              : "",
          });
        } else {
          console.log("null question", question);
        }
      });

      setData(arrayFormatData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData(userId);
  }, []);
  if (isLoading) return <Loader />;

  return (
    <section>
      {/* <Bread
        title="Question"
        items={breadcrumb}
        label={["Create Question", "AutoQuiz"]}
        link={["/admin_main/add_quiz", "/admin_main/auto_quiz"]}
      /> */}
      <div className="shadow-md border bg-white p-8">
        {data.map((question, index) => {
          return (
            <Spring index={index} key={question.id}>
              <Row align="middle">
                <Col span={20}>
                  <Space direction="vertical">
                    <Typography.Title level={4} style={{ marginBottom: 0 }}>
                      {question.title}
                    </Typography.Title>
                    <Flex gap={16} vertical={true}>
                      <Flex
                        align="center"
                        className="text-sm text-[#64748b]"
                        gap={4}
                      >
                        <UnorderedListOutlined />
                        Level: <span>{question.level}</span>
                      </Flex>

                      <Flex
                        vertical={false}
                        gap={4}
                        align="center"
                        className="text-sm text-[#64748b]"
                      >
                        <ProductOutlined />
                        Category:{" "}
                        {question.category != "" && (
                          <span className="px-2 py-1 bg-slate-400 rounded-md text-white">
                            {question.category}
                          </span>
                        )}
                        {question.subCategory != "" && (
                          <span className="px-2 py-1 bg-slate-400 rounded-md text-white">
                            {question.subCategory}
                          </span>
                        )}
                      </Flex>
                    </Flex>
                  </Space>
                </Col>
                <Col span={4}>
                  <Flex gap={5} wrap="wrap" align="center">
                    <Flex justify="flex-end" onClick={() => question.id}>
                      <Button
                        className="text-base text-blue-500 border-blue-400"
                        href={`/admin_main/edit_question/${question.id}`}
                      >
                        Update
                      </Button>
                    </Flex>
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

export default Question;
