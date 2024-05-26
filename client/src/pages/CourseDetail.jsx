import React, { useContext } from "react";
// import Layout from '../layout/AppLayout'
import {
  Avatar,
  Button,
  Col,
  Collapse,
  ConfigProvider,
  Flex,
  Image,
  Rate,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import {
  BarsOutlined,
  BookOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  CreditCardOutlined,
  FacebookOutlined,
  FlagOutlined,
  HeartFilled,
  LinkedinOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  RetweetOutlined,
  SettingOutlined,
  TagsOutlined,
  TwitterOutlined,
  UserOutlined,
  LockOutlined
} from "@ant-design/icons";
import breadcramb from "../assets/course-breadcramb.png";
import item1 from "../assets/item-1.jpg";
import Course from "../components/Course";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../hooks/api.jsx";
import Loader from "../components/Loader.jsx";
import { ViewContext } from "../context/View.jsx";
import axios from "axios";
import { Scheduler } from "devextreme-react";
import { Editing, Scrolling } from "devextreme-react/scheduler";

const Overview = ({ course }) => {
  return (
    <>
      <Space direction="vertical">
        <Typography.Title level={3}>Course description</Typography.Title>
        <Typography.Paragraph style={{ color: "#676C7D" }}>
          {course.description.toString()}
        </Typography.Paragraph>
        <Typography.Title level={3}>Categories</Typography.Title>
        <Typography.Paragraph>
          <ul>
            <li>
              <Typography.Link
                className="text-base"
                style={{ color: "#676C7D" }}
                href="#"
              >
                {course.categoryId.description}
              </Typography.Link>
            </li>
          </ul>
        </Typography.Paragraph>
        <Typography.Title level={3}>Language</Typography.Title>
        <Typography.Paragraph>
          <ul>
            <li>
              <Typography.Link
                className="text-base"
                style={{ color: "#676C7D" }}
                href="/docs/spec/proximity"
              >
                {course.language}
              </Typography.Link>
            </li>
          </ul>
        </Typography.Paragraph>
      </Space>
    </>
  );
};

const Curriculum = ({ course, isBill }) => {
  const navigate = useNavigate();
  console.log(isBill)
  let totalSections = 0;
  const calculateTotalLectures = () => {
    if (!course || !course.sections) {
      return 0;
    }

    totalSections = course.sections.length;
    let totalLectures = 0;
    for (const section of course.sections) {
      for (const spec of section.specs) {
        if (spec.type === "lesson") {
          totalLectures += 1;
        }
      }
    }

    return totalLectures;
  };
  function formatTime(timeString) {
    const timeRegex = /^(?:[0-2]\d):([0-5]\d):([0-5]\d)$/;
    const match = timeRegex.exec(timeString);
    if (match) {
      return timeString;
    }

    let seconds = parseFloat(timeString);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const totalLectures = calculateTotalLectures();

  const items = course.sections.map((section) => ({
    key: section._id,
    label: (
      <Flex align="center" justify="space-between">
        <h5 className="font-semibold text-[18px]">{section.title}</h5>
        <Flex
          gap={12}
          align="center"
          className="text-base text-[#676C7D]"
        ></Flex>
      </Flex>
    ),
    children: (
      <ul>
        {section.specs.map((spec) => {
          return (
            <li key={spec?._id?._id} className="hover:bg-slate-100 px-1 py-3">
              <Flex
                align="center"
                justify="space-between"
                onClick={
                  !isBill
                    ? () => {}
                    : () => {
                        spec?.type === "lesson"
                          ? navigate("/home/lesson/" + spec?._id?._id)
                          : navigate("/home/quiz/" + spec?._id?._id);
                      }
                }
              >
                <Flex align="center" gap={12}>
                  {spec.type === "lesson" ? (
                    !isBill ? (
                      <LockOutlined className="text-xl text-[#ccc]" />
                    ) : (
                      <PlayCircleOutlined className="text-xl text-[#754FFE]" />
                    )
                  ) : !isBill ? (
                    <LockOutlined className="text-xl text-[#ccc]" />
                  ) : (
                    <QuestionCircleOutlined className="text-xl text-[#754FFE]" />
                  )}
                  <span className="text-[#676C7D">
                    {spec?._id?.title ? spec._id.title : ""}
                  </span>
                </Flex>
                <span className="text-[#676C7D">
                  {formatTime(spec?._id?.duration)}
                </span>
              </Flex>
              {/* </a> */}
            </li>
          );
        })}
      </ul>
    ),
  }));

  return (
    <Collapse
      defaultActiveKey={items.map((item) => item.key)}
      ghost
      items={items}
    />
  );
};

const Reviews = () => {
  return (
    <>
      <Row className="mb-4 pb-4 border-b">
        <Col span={5}>
          <Space direction="vertical" align="center">
            <Typography.Title level={5}>Signe Thompson</Typography.Title>
            <Typography.Text>26-Nov-2023</Typography.Text>
            <Typography.Title level={2}>4</Typography.Title>
            <Rate defaultValue={4} />
          </Space>
        </Col>
        <Col span={18}>
          <div className="text-base">
            From the outset, the course structure impressed me with its
            thoughtful organization. Each module builds seamlessly upon the
            last, creating a logical and comprehensive learning journey. The
            content is delivered in a way that is both engaging and accessible,
            making complex concepts easy to grasp.
          </div>
        </Col>
      </Row>
      <Row className="mb-4 pb-4 border-b">
        <Col span={5}>
          <Space direction="vertical" align="center">
            <Typography.Title level={5}>Signe Thompson</Typography.Title>
            <Typography.Text>26-Nov-2023</Typography.Text>
            <Typography.Title level={2}>4</Typography.Title>
            <Rate defaultValue={4} />
          </Space>
        </Col>
        <Col span={18}>
          <div className="text-base">
            From the outset, the course structure impressed me with its
            thoughtful organization. Each module builds seamlessly upon the
            last, creating a logical and comprehensive learning journey. The
            content is delivered in a way that is both engaging and accessible,
            making complex concepts easy to grasp.
          </div>
        </Col>
      </Row>
    </>
  );
};

const Instructor = ({ instructorId, navigate }) => {
  console.log(instructorId);
  return (
    <Space direction="horizontal">
      <Image
        width={200}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
      <Space direction="vertical" className="ml-6">
        <Typography.Title level={5}>{instructorId.name}</Typography.Title>
        <Typography.Text>Email: {instructorId.email}</Typography.Text>
        <Typography.Text className="text-line-2">
          Join Date: {instructorId.date_created}
        </Typography.Text>
        <Flex gap="small" className="mt-6">
          <Button
            icon={<FacebookOutlined className="text-xl" />}
            size="normal"
          />
          <Button
            icon={<TwitterOutlined className="text-xl" />}
            size="normal"
          />
          <Button
            icon={<LinkedinOutlined className="text-xl" />}
            size="normal"
          />
          <Button
            className="bg-[#754FFE]"
            type="primary"
            size="normal"
            onClick={() => navigate("/instructor/" + instructorId._id)}
          >
            View profile
          </Button>
        </Flex>
      </Space>
    </Space>
  );
};

const Schedule = ({ sourceData }) => {
  const appointmentRender = (e) => {
    return (
      <div>
        <div>{e.appointmentData.title}</div>
      </div>
    );
  };

  const appointmentTooltipRender = (e) => {
    return (
      <div>
        <div>{e.appointmentData.title}</div>
        <div>{e.appointmentData.description}</div>
        <Button href={e.appointmentData.urlMeet}> Join Metting </Button>
      </div>
    );
  };

  // remap data
  sourceData = sourceData.map((item) => {
    return {
      ...item,
      text: item.title,
      startDate: item.date_start,
      // endDate is after 1 hour
      endDate: new Date(item.date_start.getTime() + 60 * 60 * 1000),
    };
  });
  console.log(sourceData);

  return (
    <Scheduler
      height={730}
      showAllDayPanel={false}
      dataSource={sourceData}
      currentView={"week"}
      appointmentRender={appointmentRender}
      appointmentTooltipRender={appointmentTooltipRender}
      startDayHour={0}
      crossScrollingEnabled={true}
    >
      <Editing
        allowAdding={false}
        allowDeleting={false}
        allowResizing={false}
        allowDragging={false}
        allowUpdating={false}
      />
      <Scrolling mode="virtual" />
    </Scheduler>
  );
};

const CourseDetail = () => {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const { courseId } = useParams();
  const course = useAPI(`/api/course/${courseId}`, null);
  const checkBill = useAPI(`/api/bill/check/${userId}/${courseId}`, null);
  console.log(checkBill);
  const navigate = useNavigate();
  const viewContext = useContext(ViewContext);

  if (course.loading || checkBill.loading) return <Loader />;

  const scheduleData = [
    {
      userId: 0,
      courseId: 1,
      title: "Introduction to the course",
      description: "A short meeting introduce the course",
      urlMeet: "https://meet.google.com/abc-xyz",
      date_start: new Date(Date.now()),
      date_created: new Date("2023-5-12T08:00:00"),
      date_updated: new Date("2023-5-12T08:00:00"),
    },
  ];

  let totalSections = 0;
  let totalQuizs = 0;
  const calculateTotalLectures = () => {
    if (!course.data || !course?.data?.sections) {
      return 0;
    }

    totalSections = course.data.sections.length;
    let totalLectures = 0;
    for (const section of course.data.sections) {
      for (const spec of section.specs) {
        if (spec.type === "lesson") {
          totalLectures += 1;
        } else {
          totalQuizs += 1;
        }
      }
    }

    return totalLectures;
  };

  const totalLectures = calculateTotalLectures();

  const handleAddToCart = async () => {
    try {
      if (!JSON.parse(localStorage.getItem("user"))) {
        viewContext.handleError("You need to login first");
        navigate("/login");
      } else {
        const userId = JSON.parse(localStorage.getItem("user")).account._id;
        const response = await axios.post("/api/enrollment", {
          userId: userId,
          courseId: courseId,
        });
        console.log(response);
        viewContext.handleSuccess("Add to cart successfully");
      }
    } catch (error) {
      console.log(error);
      viewContext.handleError(error);
    }
  };
  const items = [
    {
      icon: TagsOutlined,
      name: "Overview",
      child: Overview,
      props: { course: course.data, navigate },
    },
    {
      icon: ProfileOutlined,
      name: "Curriculum",
      child: Curriculum,
      props: { course: course.data, isBill: checkBill?.data, navigate },
    },
    {
      icon: UserOutlined,
      name: "Instructor",
      child: Instructor,
      props: { instructorId: course.data.instructorId, navigate },
    },
    {
      icon: CommentOutlined,
      name: "Reviews",
      child: Reviews,
      props: { course: course.data, navigate },
    },
    {
      icon: CalendarOutlined,
      name: "Schedule",
      child: Schedule,
      props: { sourceData: scheduleData },
    },
  ];
  return (
    <>
      <section
        style={{ backgroundImage: `url(${breadcramb})` }}
        className="my-6 py-12"
      >
        <Row className="max-w-screen-xl m-auto">
          <Space direction="vertical">
            <Typography.Title style={{ color: "white" }}>
              {course.data.title}
            </Typography.Title>
            <Typography.Text style={{ color: "white", fontSize: "18px" }}>
              {course.data.shortDes}
            </Typography.Text>
            <Flex align="center" justify="space-between" className="my-2">
              <Space>
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                <span className="text-white text-sm">
                  Created by{" "}
                  <Typography.Link style={{ color: "white", fontSize: "16px" }}>
                    {course.data.instructorId.name.toString()}
                  </Typography.Link>{" "}
                </span>
              </Space>
              <Space>
                <ClockCircleOutlined className="text-white" />
                <span className="text-white text-base">01:05:12 Hours</span>
              </Space>
              <Space>
                <UserOutlined className="text-white" />
                <span className="text-white text-base">8 Enrolled</span>
              </Space>
              <Space>
                <Rate disabled defaultValue={2} />
                <span className="text-white text-base">(3 Reviews)</span>
              </Space>
            </Flex>
            <Space align="center">
              <CalendarOutlined className="text-white" />
              <span className="text-white text-base">
                last updated Thu, 13-Jul-2023
              </span>
            </Space>
          </Space>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto mb-12">
        <Row gutter={24}>
          <Col span={17}>
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
          </Col>
          <Col span={7}>
            <div className="shadow-lg rounded-md sticky mt-[-200px]">
              <Space direction="vertical" className="p-2">
                <Space className="relative" style={{ columnGap: 0 }}>
                  <div className="absolute p-2 rounded-lg cursor-pointer top-[calc(50%-16px)] left-[calc(50%-16px)] bg-[#0000005a]">
                    <PlayCircleOutlined className="text-3xl text-white" />
                  </div>
                  <img
                    src={item1}
                    alt="image"
                    className="w-full h-[227px] rounded-lg"
                  />
                  <div className="bg-white absolute top-3 right-5 w-6 h-6 flex items-center justify-center rounded-full">
                    <HeartFilled className="text-[#6e798a81]" />
                  </div>
                </Space>
                <div className="p-4 w-full">
                  <Flex align="center" className="w-full">
                    <h1 className="font-semibold text-3xl mr-4">
                      {!course.data.price
                        ? "Free"
                        : course.data.price.toLocaleString() + " VND"}
                    </h1>
                    {/*<del className='text-xl'>$18.00</del>*/}
                    <a href="#" className="ml-auto block">
                      <RetweetOutlined className="text-2xl" />
                    </a>
                  </Flex>
                </div>
                <div className="p-3 w-full border-b">
                  <Flex align="center" className="w-full">
                    <BarsOutlined className="text-2xl mr-2 text-red-500" />
                    <span className="font-semibold text-base">Lectures</span>
                    <div className="ml-auto text-base font-semibold">
                      {totalLectures}
                    </div>
                  </Flex>
                </div>
                <div className="p-3 w-full border-b">
                  <Flex align="center" className="w-full">
                    <CalculatorOutlined className="text-2xl mr-2 text-purple-500" />
                    <span className="font-semibold text-base">Quizzes</span>
                    <div className="ml-auto text-base font-semibold">
                      {totalQuizs}
                    </div>
                  </Flex>
                </div>
                <div className="p-3 w-full border-b">
                  <Flex align="center" className="w-full">
                    <SettingOutlined className="text-2xl mr-2 text-green-500" />
                    <span className="font-semibold text-base">Skill level</span>
                    <div className="ml-auto text-base font-semibold">
                      {course.data.level}
                    </div>
                  </Flex>
                </div>
                <div className="p-3 w-full border-b">
                  <Flex align="center" className="w-full">
                    <BookOutlined className="text-2xl mr-2 text-red-500" />
                    <span className="font-semibold text-base">Sections</span>
                    <div className="ml-auto text-base font-semibold">
                      {totalSections}
                    </div>
                  </Flex>
                </div>
                <div className="p-3 w-full">
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          /* here is your component tokens */
                          defaultHoverBg: "#754FFE",
                          defaultHoverBorderColor: "#754FFE",
                          defaultActiveBorderColor: "#754FFE",
                          defaultActiveColor: "#754FFE",
                          defaultHoverColor: "white",
                        },
                      },
                    }}
                  >
                    {checkBill.data == true ? (
                      <></>
                    ) : (
                      <>
                        <Button
                          icon={<PlusOutlined />}
                          size="large"
                          className="w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500 mb-6"
                          onClick={handleAddToCart}
                        >
                          Add to cart
                        </Button>
                        {/* <Button
                          icon={<CreditCardOutlined />}
                          size="large"
                          className="w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500"
                        >
                          Buy now
                        </Button> */}
                      </>
                    )}
                  </ConfigProvider>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto mb-12">
        <Typography.Title>Related courses</Typography.Title>
        <Row gutter={12}>
          <Col span={6}>
            <Course></Course>
          </Col>
          <Col span={6}>
            <Course></Course>
          </Col>
          <Col span={6}>
            <Course></Course>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default CourseDetail;
