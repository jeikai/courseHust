import { SettingOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Collapse,
  Divider,
  Flex,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import Video from "../components/Video";
import Quiz from "../components/Quiz";
import Questions from "../components/Questions";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ViewContext } from "../context/View.jsx";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader.jsx";

const Lesson = () => {
  const { id } = useParams();
  const viewContext = useContext(ViewContext);
  const lesson =  useAPI(`/api/lesson/${id}`, null);
  console.log(lesson, id, useParams())
  let toggle = false;
  if (lesson.loading) return <Loader />;
  const handleDoneLesson = async () => {
    try {
      console.log("Done")
    } catch (error) {
      console.log(error)
      viewContext(error)
    }
  }
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
                <Typography.Title className="w-full hover:text-[#754FFE]" level={5}>
                  {lesson.data.title}
                </Typography.Title>
              }
              key="1"
            >
              <Space direction="vertical" className="w-full">
                <Flex align="center" gap={12} className="px-3 py-2 rounded-md">
                  <Checkbox onClick={handleDoneLesson}/>
                  <Link className="flex-1 group">
                    <Flex justify="space-between">
                      <Flex vertical>
                        <p className="font-semibold text-base group-hover:text-[#754FFE]">
                          {lesson.data.content}
                        </p>
                        <span className="text-[#6c757d]">{lesson.data.data_created}</span>
                      </Flex>
                      <p className="text-[#6c757d] text-base font-medium">{lesson.data.duration} second</p>
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
            <Video video={lesson.data.videoURL} />
            <Quiz />
            <Questions />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Lesson;