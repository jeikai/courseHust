import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import {
  HomeOutlined,
  MailFilled,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import breadcramb from "../assets/course-breadcramb.png";
import book from "../assets/brd-book.png";
import Course from "../components/Course";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
const Instructor = () => {
  const { instructorId } = useParams();
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userDetailsResponse = await axios.get(
          `/api/user/getDetail/${instructorId}`
        );
        setUserData(userDetailsResponse.data);
        const coursesResponse = await axios.get(
          `/api/course/instructor/${instructorId}`
        );
        setCourses(coursesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [instructorId]);
  if (loading) return <Loader />;
  return (
    <>
      <section
        style={{ backgroundImage: `url(${breadcramb})` }}
        className="my-6"
      >
        <Row className="max-w-screen-xl m-auto">
          <Col span={18} className="flex items-center">
            <Space direction="vertical">
              <Breadcrumb
                className="z-10 text-2xl"
                items={[
                  {
                    href: "/",
                    title: (
                      <>
                        <HomeOutlined
                          style={{ fontSize: "24px", color: "white" }}
                        />
                        <span className="text-white">Home</span>
                      </>
                    ),
                  },
                  {
                    title: <span className="text-white">Educator profile</span>,
                  },
                ]}
              />
              <Typography.Title
                level={1}
                style={{ color: "white", marginTop: "12px" }}
              >
                Educator profile
              </Typography.Title>
            </Space>
          </Col>
          <Col span={6}>
            <img src={book} alt="book" className="w-[212px] h-[212px]" />
          </Col>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto">
        <Row gutter={24}>
          <Col span={18} className="shadow-xl p-12 rounded-md">
            {userData && (
              <div className="pb-8 px-2 border-b">
                <Flex gap={24} align="start">
                  <Image
                    width={150}
                    src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
                  />
                  <Typography.Paragraph
                    className="text-base"
                    style={{
                      color: "#676C7D",
                      lineHeight: "1.9",
                      wordSpacing: "2.5px",
                    }}
                  >
                    {userData.name} - {userData.role}
                    <br />
                    Email: {userData.email}
                    <br />
                    Phone: {userData.phoneNumber || "N/A"}
                  </Typography.Paragraph>
                  {userData.documentUrl && (
                    <Image
                      width={200}
                      src={userData.documentUrl}
                      alt="Document"
                    />
                  )}
                </Flex>
              </div>
            )}
            <div className="pb-8 px-2 border-b">
              <Typography.Title level={3} style={{ color: "#676C7D" }}>
                Statistics
              </Typography.Title>
              <Row>
                <Col span={4}>
                  <Flex
                    vertical
                    justify="center"
                    align="center"
                    className="border-r"
                  >
                    <h1 className="text-[54px] font-bold text-[#754FFE]">{courses?.length}</h1>
                    <h4 className="text-base font-semibold text-[#1E293B]">
                      Total courses
                    </h4>
                  </Flex>
                </Col>
              </Row>
            </div>
            <Typography.Title
              level={1}
              style={{ color: "black", marginTop: "12px" }}
            >
              Instructor's courses
            </Typography.Title>
            <Row gutter={[0, 24]}>
              {courses.map((course) => (
                <Col key={course._id} span={8}>
                  <Course course={course}></Course>
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={6} className="h-fit">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBorderColor: "#754FFE",
                  },
                },
              }}
            >
              <Card
                className="shadow-xl"
                actions={[
                  <Button
                    icon={
                      <FacebookOutlined
                        style={{ fontSize: "24px" }}
                        className="text-[#754FFE]"
                      />
                    }
                    size="large"
                  />,
                  <Button
                    icon={
                      <TwitterOutlined
                        style={{ fontSize: "24px" }}
                        className="text-[#754FFE]"
                      />
                    }
                    size="large"
                  />,
                  <Button
                    icon={
                      <LinkedinOutlined
                        style={{ fontSize: "24px" }}
                        className="text-[#754FFE]"
                      />
                    }
                    size="large"
                  />,
                ]}
              >
                <Card.Meta
                  avatar={
                    <Flex align="center" justify="center" className="h-full">
                      <MailFilled className="text-2xl text-[#754FFE]" />
                    </Flex>
                  }
                  title="Email:"
                  description="admin@example.com"
                />
              </Card>
            </ConfigProvider>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Instructor;
