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
} from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Spring from "../../components/Spring";
import { useAPI } from "../../hooks/api";
import Loader from "../../components/Loader";

const Courses = () => {
  const course = useAPI("/api/course", null);
  if (course.loading) return <Loader />;

  console.log(course);
  const breadcrumb = [
    {
      title: "Home",
      href: "",
    },
    {
      title: "Application Center",
    },
  ];

  const action = [
    {
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item（disabled）",
      key: "3",
      disabled: true,
    },
  ];
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
  //   const [type, setType] = useState("all");
  return (
    <section>
      <Spring>
        <Bread
          title="Courses"
          items={breadcrumb}
          label={"Add new courses"}
          link={"/admin/add_course"}
        />
        <div className="shadow-md border bg-white">
          <div className="mb-4">
            {/* <Flex align="center" className="border-b">
              <div
                onClick={() => setType("all")}
                className={`mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 ${
                  type === "all" && "border-b-[#754FFE] "
                } cursor-pointer hover:text-[#754FFE] ease-out duration-500`}
              >
                All
              </div>
              <div
                onClick={() => setType("approved")}
                className={`mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 ${
                  type === "approved" && "border-b-[#754FFE] "
                } cursor-pointer hover:text-[#754FFE] ease-out duration-500`}
              >
                Approved
              </div>
              <div
                onClick={() => setType("pending")}
                className={`mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 ${
                  type === "pending" && "border-b-[#754FFE] "
                } cursor-pointer hover:text-[#754FFE] ease-out duration-500`}
              >
                Pending
              </div>
            </Flex> */}
          </div>
          <div className="my-8 mx-4">
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    /* here is your component tokens */
                    activeBorderColor: "#775FFE",
                    hoverBorderColor: "#775FFE",
                  },
                },
              }}
            >
              <Input
                size="large"
                placeholder="Search"
                prefix={<SearchOutlined />}
              />
            </ConfigProvider>
          </div>
          <div>
            <Table size="large" dataSource={course.data} pagination={true}>
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
                      <Link className="font-semibold text-[#775FFE] text-line-1 w-[99%] block">
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
              {/* <Table.Column
                // width={150}
                title="Enrolled student"
                dataIndex={"enrollment"}
                key={"enrollment"}
                render={(_, record) => {
                  return (
                    <p className="text-[#98a6ad] text-md">
                      <span className="font-semibold">Enrollments: </span>
                      {record.enrollment}
                    </p>
                  );
                }}
              />
              <Table.Column
                // width={120}
                title="Status"
                dataIndex={"status"}
                key={"status"}
                render={(_, record) => {
                  return (
                    <>
                      <span
                        className={`mx-1 rounded-full inline-block h-2 w-2 ${
                          record.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span className="capitalize text-sm font-semibold">
                        {record.status}
                      </span>
                    </>
                  );
                }}
              /> */}
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
        </div>
      </Spring>
    </section>
  );
};

export default Courses;
