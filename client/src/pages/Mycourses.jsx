import React, { useState } from "react";
import Banner from "../components/Banner";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Flex,
  Image,
  Progress,
  Rate,
  Row,
  Space,
  Typography,
} from "antd";
import Sidenav from "../components/sidenav/Sidenav";
import { Link } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import Spring from "../components/Spring";
import { ViewContext } from "../context/View";
import { useContext } from "react";
import { useAPI } from "../hooks/api";
import { useEffect } from "react";
import Loader from "../components/Loader";
import Axios from "axios";
const Course = ({ course }) => {
  return (
    <Col span={24}>
      <Link to={`/courses/${course?.courseId?._id}`}>
        <Row className="cursor-pointer">
          <Col span={7}>
            <img
              src={course?.courseId?.thumbnail}
              className="w-[245px] h-[145px] cursor-pointer rounded-lg"
            />
          </Col>
          <Col span={17}>
            <Space direction="vertical" className="w-full">
              <Typography.Title level={5} style={{ color: "#676C7D" }}>
                {course.courseId.title}
              </Typography.Title>
              <div className="pr-10">
                <Progress percent={course.process} size="small" />
              </div>
              <Flex align="end" justify="space-between" className="mt-2">
                <Space direction="vertical">
                  <Flex align="center" gap={8}>
                    <Avatar
                      shape="circle"
                      src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
                    />
                    <span className="text-[#676C7D]">{course.courseId.instructorId.name}</span>
                  </Flex>
                  <div>
                    <span className="text-[#676C7D]">
                      Level -{" "}
                      <span className="text-[#198754] font-semibold">
                        {course.courseId.level}
                      </span>
                    </span>
                  </div>
                </Space>
                <Button
                  type="primary"
                  className="bg-[#754FFE] px-8 hover:-translate-y-1 duration-300"
                  icon={<PlayCircleOutlined />}
                >
                  Start now
                </Button>
              </Flex>
            </Space>
          </Col>
        </Row>
      </Link>
    </Col>
  );
};

const Mycourses = () => {
  const viewContext = useContext(ViewContext);
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState([]);
  async function fetchData() {
    try {
      setIsLoading(true);
      console.log(userId);
      const responseAPI = await Axios({
        url: `/api/process/${userId}`,
      });
      console.log(responseAPI);
      setCourse(responseAPI?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      viewContext.handleError(error.toString());
    }
  }

  useEffect(() => {
    fetchData();
  }, [userId]);
  if (isLoading) return <Loader />;
  return (
    <>
      <Banner name="My courses" />
      <section className="max-w-screen-xl m-auto my-12">
        <Row gutter={12}>
          <Col span={6}>
            <Sidenav />
          </Col>
          <Col span={18}>
            <div className="bg-white shadow-lg border rounded-lg px-6 py-8">
              <Typography.Title level={3}>Courses</Typography.Title>
              <Row gutter={[12, 60]}>
                {course.map((item, index) => {
                  return (
                    <Spring className="w-full">
                      <Course course={item} />
                    </Spring>
                  );
                })}
              </Row>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Mycourses;
