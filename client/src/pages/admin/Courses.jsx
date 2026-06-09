import React, { useEffect, useState } from "react";
import Bread from "../../components/Bread";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  Row,
  Table,
  Tabs,
  Modal,
  message,
} from "antd";
import { TagsOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Spring from "../../components/Spring";
import { useAPI } from "../../hooks/api";
import Loader from "../../components/Loader";
import { OutlinedInput } from "@mui/material";
import axios from "axios";
const NormalCourse = ({ course, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const showDeleteModal = (record) => {
    setSelectedCourse(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedCourse) {
      onDelete(selectedCourse._id);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const calculateTotalLectures = (course) => {
    if (!course || !course.sections) {
      return 0;
    }

    let totalLectures = 0,
      totalQuizs = 0;
    for (const sections of course.sections) {
      for (const spec of sections.specs) {
        if (spec.type === "lesson") {
          totalLectures += 1 || 0;
        } else {
          totalQuizs += 1;
        }
      }
    }
    return { totalLectures, totalQuizs };
  };

  function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + "...";
    }
  }

  return (
    <>
      <Table size="large" dataSource={course} pagination={true}>
        <Table.Column
          sorter={{
            compare: (a, b) => a.id - b.id,
          }}
          title="#"
          dataIndex={"id"}
          key={"id"}
          render={(_, record) => {
            return <>{truncateString(record._id, 5)}</>;
          }}
        />
        <Table.Column
          width={250}
          title="Title"
          dataIndex={"title"}
          key={"title"}
          render={(_, record) => {
            return (
              <Flex vertical>
                <Link
                  className="font-semibold text-[#775FFE] text-line-1 w-[99%] block"
                  to={`/admin_main/edit_course/${record._id}`}
                >
                  {record.title}
                </Link>
                <span className="text-[#98a6ad]">
                  Instructor: <strong>{record.instructorId.name}</strong>
                </span>
              </Flex>
            );
          }}
        />
        <Table.Column
          title="Category"
          dataIndex={"category"}
          key={"category"}
          render={(_, record) => {
            return (
              <p className="text-xs font-semibold bg-[#313a462e] w-fit p-1 rounded-lg shadow-md">
                {record.categoryId.title}
              </p>
            );
          }}
        />
        <Table.Column
          title="Lesson and section"
          key={"curriculum"}
          render={(_, record) => {
            return (
              <Flex vertical className="text-[#98a6ad] text-md">
                <p>
                  <span className="font-semibold">Lectures</span>:{" "}
                  {calculateTotalLectures(record).totalLectures}
                </p>
                <p>
                  <span className="font-semibold">Quizs</span>:{" "}
                  {calculateTotalLectures(record).totalQuizs}
                </p>
              </Flex>
            );
          }}
        />
        <Table.Column
          title="Price"
          dataIndex={"price"}
          key={"price"}
          render={(_, record) => {
            return (
              <p className="text-md font-bold bg-[#313a462e] w-fit p-1 rounded-lg shadow-md">
                {record.price} <sup>đ</sup>
              </p>
            );
          }}
        />
        <Table.Column
          title="Delete"
          key="delete"
          render={(_, record) => (
            <Button type="primary" danger onClick={() => showDeleteModal(record)}>
              Delete
            </Button>
          )}
        />
      </Table>
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this course?</p>
      </Modal>
    </>
  );
};

const Courses = () => {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const { data: course, loading } = useAPI(`/api/course/instructor/${userId}`, null);
  const [deleting, setDeleting] = useState(false);

  const deleteCourse = async (courseId) => {
    try {
      setDeleting(true);
      const response = await axios.delete(`/api/course/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        message.success("Course deleted successfully");
        window.location.reload();
      } else {
        message.error("Failed to delete course");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while deleting the course");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || deleting) return <Loader />;

  const breadcrumb = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Application Center",
    },
  ];

  const NormalCourses = course?.filter((course) => !course?.isStream) || [];
  const StreamCourse = course?.filter((course) => course?.isStream) || [];

  const items = [
    {
      icon: TagsOutlined,
      name: "Normal",
      child: NormalCourse,
      props: { course: NormalCourses, onDelete: deleteCourse },
    },
    {
      icon: VideoCameraOutlined,
      name: "Stream",
      child: NormalCourse,
      props: { course: StreamCourse, onDelete: deleteCourse },
    },
  ];

  return (
    <section>
      <Spring>
        <Bread
          title="Courses"
          items={breadcrumb}
          label={"Add new courses"}
          link={"/admin_main/add_course"}
        />
        <div className="shadow-md border">
          <div className="my-8 mx-4 shadow-md border">
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    horizontalItemGutter: 50,
                    itemHoverColor: "#754FFE",
                    itemSelectedColor: "#754FFE",
                    inkBarColor: "#754FFE",
                  },
                },
              }}
            >
              <Tabs
                className="p-4 shadow-xl rounded-md mt-[-60px] bg-white"
                size="large"
                defaultActiveKey="2"
                items={items.map((item, i) => ({
                  key: i,
                  label: <span className="font-semibold text-base">{item.name}</span>,
                  children: <item.child {...item.props} />,
                  icon: <item.icon className="text-base" />,
                }))}
              />
            </ConfigProvider>
          </div>
        </div>
      </Spring>
    </section>
  );
};

export default Courses;
