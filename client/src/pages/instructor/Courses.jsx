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
} from "antd";
import {
  TagsOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Spring from "../../components/Spring";
import { useAPI } from "../../hooks/api";
import Loader from "../../components/Loader";
import { OutlinedInput } from "@mui/material";

const NormalCourse = ({ course }) => {
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
      <div>
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
                  <Link className="font-semibold text-[#775FFE] text-line-1 w-[99%] block" to={`/admin/edit_course/${record._id}`}>
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
            // width={150}
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
            // width={180}
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
        </Table>
      </div>
    </>
  );
};

const Courses = () => {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const course = useAPI(`/api/course/instructor/${userId}`, null);
  if (course.loading) return <Loader />;

  console.log(course);
  const breadcrumb = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Application Center",
    },
  ];

  const NormalCourses = course.data.filter((course) => {
    return course?.isStream == false || course?.isStream == null;
  });

  const StreamCourse = course.data.filter((course) => {
    return course?.isStream == true;
  });

  const items = [
    {
      icon: TagsOutlined,
      name: "Normal",
      child: NormalCourse,
      props: { course: NormalCourses },
    },
    {
      icon: VideoCameraOutlined,
      name: "Stream",
      child: NormalCourse,
      props: { course: StreamCourse },
    },
  ];
  return (
    <section>
      <Spring>
        <Bread
          title="Courses"
          items={breadcrumb}
          label={"Add new courses"}
          link={"/admin/add_course"}
        />
        <div className="shadow-md border ">
          <div className="my-8 mx-4 shadow-md border">
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    // cardGutter: 12
                    horizontalItemGutter: 50,
                    itemHoverColor: "#754FFE",
                    itemSelectedColor: "#754FFE",
                    inkBarColor: "#754FFE",
                    horizontalItemMarginRTL: "",
                  },
                },
              }}
            >
              <Tabs
                className="p-4 shadow-xl rounded-md mt-[-60px] bg-white"
                size="large"
                defaultActiveKey="2"
                items={items.map((item, i) => {
                  return {
                    key: i,
                    label: (
                      <span className="font-semibold text-base">
                        {item.name}
                      </span>
                    ),
                    children: <item.child {...item.props} />,
                    icon: <item.icon className="text-base" />,
                  };
                })}
              />
            </ConfigProvider>
          </div>
        </div>
      </Spring>
    </section>
  );
};

export default Courses;
