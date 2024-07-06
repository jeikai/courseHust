import React, { useContext, useState, useEffect } from "react";
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
  Modal,
  Table,
  Input,
  message,
} from "antd";
import {
  BarsOutlined,
  BookOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  CreditCardOutlined,
  FacebookOutlined,
  FileTextOutlined,
  HeartFilled,
  LinkedinOutlined,
  LockOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  RetweetOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import list_banner from "../assets/banner/list_banner.png";
import Course from "../components/Course";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../hooks/api.jsx";
import Loader from "../components/Loader.jsx";
import { ViewContext } from "../context/View.jsx";
import Axios from "axios";
import axios from "axios";
import { Scheduler } from "devextreme-react";
import { Editing, Scrolling } from "devextreme-react/scheduler";
import moment from "moment";

const Overview = ({ course }) => {
  return (
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
  );
};

const Curriculum = ({ course, process }) => {
  const navigate = useNavigate();

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

  const formatTime = (timeString) => {
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
  };

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
          console.log(spec);
          return (
            <li key={spec?._id?._id} className="hover:bg-slate-100 px-1 py-3">
              <Flex
                align="center"
                justify="space-between"
                onClick={
                  !process?.data
                    ? () => {}
                    : () => {
                        spec?.type === "lesson" && spec?._id?.docURL
                          ? navigate(
                              "/home/document/" +
                                spec?._id?._id +
                                "/" +
                                course?._id
                            )
                          : spec?.type === "lesson"
                          ? navigate(
                              "/home/lesson/" +
                                spec?._id?._id +
                                "/" +
                                course?._id
                            )
                          : navigate(
                              "/home/quiz/" + spec?._id?._id + "/" + course?._id
                            );
                      }
                }
              >
                <Flex align="center" gap={12}>
                  {
                    // dành cho document
                    spec.type === "lesson" && spec?.id?.docURL  ? (
                      !process?.data ? (
                        <LockOutlined className="text-xl text-[#ccc]" />
                      ) : process?.data?.lessonId?.some(
                          (id) => id.toString() === spec?._id?._id.toString()
                        ) ? (
                        <CheckCircleOutlined className="text-xl text-[#3ebb3a]" />
                      ) : (
                        <FileTextOutlined className="text-xl text-[#754FFE]" />
                      )
                    ) : !process?.data ? (
                      <LockOutlined className="text-xl text-[#ccc]" />
                    ) : // dành cho lesson video
                    spec.type === "lesson" ? (
                      !process?.data ? (
                        <LockOutlined className="text-xl text-[#ccc]" />
                      ) : process?.data?.lessonId?.some(
                          (id) => id.toString() === spec?._id?._id.toString()
                        ) ? (
                        <CheckCircleOutlined className="text-xl text-[#3ebb3a]" />
                      ) : (
                        <PlayCircleOutlined className="text-xl text-[#754FFE]" />
                      )
                    ) : !process?.data ? (
                      <LockOutlined className="text-xl text-[#ccc]" />
                    ) : // dành cho quiz
                    process?.data?.quizScores?.some(
                        (id) =>
                          id?.quizId.toString() === spec?._id?._id.toString()
                      ) ? (
                      <CheckCircleOutlined className="text-xl text-[#3ebb3a]" />
                    ) : (
                      <QuestionCircleOutlined className="text-xl text-[#754FFE]" />
                    )
                  }
                  <span className="text-[#676C7D">
                    {spec?._id?.title ? spec._id.title : ""}
                  </span>
                </Flex>
                <span className="text-[#676C7D">
                  {formatTime(spec?._id?.duration)}
                </span>
              </Flex>
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

const Reviews = ({ userId, courseId, reviews, process }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [review, setReviews] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setReviews(reviews);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [courseId]);

  const handleOk = async () => {
    try {
      console.log("Comment:", comment, "Rating:", rating);
      const data = {
        userId: userId,
        courseId: courseId,
        content: comment,
        rating: rating,
      };
      const responseAPI = await axios.post("/api/feedback", data);
      console.log(responseAPI?.data);

      if (responseAPI?.data?.data) {
        const newReview = {
          ...responseAPI.data.data,
          userId: {
            name: "Me",
          },
          content: comment,
          date_created: new Date().toLocaleDateString(),
          rating: rating,
        };
        setReviews((reviews) => [...reviews, newReview]);
        message.success(
          responseAPI?.data?.message || "Feedback added successfully."
        );
      } else {
        message.error("Unexpected response data format.");
      }
      setIsModalVisible(false);
      setComment("");
      setRating(0);
    } catch (error) {
      console.error(error);
      message.error("Failed to submit feedback: " + error.toString());
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // Optionally clear the input fields when canceling
    setComment("");
    setRating(0);
  };

  const isFormValid = () => {
    return comment.trim().length > 0 && rating > 0;
  };
  if (loading) return <Loader />;

  return (
    <>
      <Row className="mb-4">
        {userId && process?.data ? (
          <Col span={24}>
            <Button type="primary" onClick={showModal}>
              Add your comment
            </Button>
          </Col>
        ) : (
          <></>
        )}
      </Row>
      <Modal
        title="Add Your Comment"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ disabled: !isFormValid() }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input.TextArea
            rows={4}
            placeholder="Enter your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Rate
            tooltips={["Terrible", "Bad", "Normal", "Good", "Wonderful"]}
            onChange={setRating}
            value={rating}
          />
        </Space>
      </Modal>
      <div style={{ height: "300px", overflowY: "auto" }}>
        {review.map((review, index) => (
          <Row key={index} className="mb-4 pb-4 border-b">
            <Col span={5}>
              <Space direction="vertical" align="center">
                <Typography.Title level={5}>
                  {review?.userId.name}
                </Typography.Title>
                <Typography.Text>{review?.date_created}</Typography.Text>
                <Typography.Title level={2}>{review?.rating}</Typography.Title>
                <Rate value={review?.rating} disabled />
              </Space>
            </Col>
            <Col span={18}>
              <div className="text-base">{review?.content}</div>
            </Col>
          </Row>
        ))}
      </div>
    </>
  );
};

const Instructor = ({ instructorId, navigate }) => {
  return (
    <Space direction="horizontal">
      <Image
        width={200}
        src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
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

const Schedule = ({ sourceData, userId }) => {
  const getDatesBetween = (startDate, endDate, dayOfWeek) => {
    const dates = [];
    let current = moment(startDate).startOf("day");
    if (current.day() !== dayOfWeek) {
      current.day(dayOfWeek);
    }

    while (current.isSameOrBefore(endDate)) {
      if (current.isSameOrAfter(startDate)) {
        dates.push(current.clone().format("YYYY-MM-DD"));
      }
      current.add(1, "week");
    }

    return dates;
  };

  const transformData = (data) => {
    return data.flatMap((item) => {
      const dates = getDatesBetween(
        item.day_start,
        item.day_end,
        item.dayOfWeek
      );
      let temp = dates;
      const exceptions = item.exceptions;
      exceptions.forEach((exceptDate) => {
        const tempDate = moment(exceptDate).format("YYYY-MM-DD");
        temp = temp.filter((date) => date != tempDate);
      });
      return temp.map((date) => ({
        ...item,
        text: item.title,
        startDate: moment(date + "T" + item.time_start).toISOString(),
        endDate: moment(date + "T" + item.time_end).toISOString(),
      }));
    });
  };

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
        {userId && (
          <Button href={e.appointmentData.urlMeet}> Join Meeting </Button>
        )}
      </div>
    );
  };

  const formattedSourceData = transformData(sourceData);

  return (
    <Scheduler
      height={730}
      showAllDayPanel={false}
      dataSource={formattedSourceData}
      currentView={"week"}
      appointmentRender={appointmentRender}
      appointmentTooltipRender={appointmentTooltipRender}
      startDayHour={7}
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
  const userId = JSON.parse(localStorage.getItem("user"))?.account?._id;
  const navigate = useNavigate();
  const { courseId } = useParams();
  const course = useAPI(`/api/course/${courseId}`, null);
  const checkProcess = userId
    ? useAPI(`/api/process/check/${userId}/${courseId}`, null)
    : null;
  const schedule = useAPI(`/api/calendar/${courseId}`, null)?.data;
  const bill = useAPI(`/api/bill/course/${courseId}`, null)?.data;
  const reviews = useAPI(`/api/feedback/${courseId}`, null);
  const favorite = userId
    ? useAPI(`/api/favorite/check/${userId}/${courseId}`, null)
    : false;
  const recommend = userId ? useAPI(`/api/recommend/${userId}`, null) : null;
  let totalSections = 0;
  let totalQuizs = 0;

  const viewContext = useContext(ViewContext);
  const [calendarData, setCalendar] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  useEffect(() => {
    setIsLiked(favorite?.data?.exists);
  }, [favorite]);
  useEffect(() => {
    if (recommend?.data) {
      const fetchCourseDetails = async () => {
        try {
          const courses = await Promise.all(
            Object.keys(recommend?.data).map((courseId) =>
              axios.get(`/api/course/${courseId}`).then((res) => res.data)
            )
          );
          setRecommendedCourses(courses);
        } catch (error) {
          console.error("Failed to fetch recommended courses:", error);
        }
      };

      fetchCourseDetails();
    }
  }, [recommend]);
  if (userId) {
    if (
      course?.loading ||
      checkProcess?.loading ||
      reviews.loading ||
      favorite.loading ||
      recommend.loading
    )
      return <Loader />;
  } else {
    if (course?.loading || reviews.loading) return <Loader />;
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleAddToCart();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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

  const handleCheckSchedule = async () => {
    try {
      setLoading(true);
      const responseApi = await Axios({
        url: `/api/calendar/check/${userId}/${courseId}`,
        method: "GET",
      });
      if (responseApi?.data.length > 0) {
        setCalendar(responseApi.data);
        setLoading(false);
        showModal();
      } else {
        await handleAddToCart();
      }
    } catch (error) {
      console.log(error);
      viewContext.handleError(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!JSON.parse(localStorage.getItem("user"))) {
        viewContext.handleError("You need to login first");
        navigate("/login");
      } else {
        setLoading(true);
        const userId = JSON.parse(localStorage.getItem("user")).account._id;
        const response = await Axios({
          url: "/api/enrollment",
          method: "POST",
          data: {
            userId: userId,
            courseId: courseId,
          },
        });
        console.log(response);
        setLoading(false);
        viewContext.handleSuccess("Add to cart successfully");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      props: { course: course.data, process: checkProcess?.data, navigate },
    },
    {
      icon: UserOutlined,
      name: "Instructor",
      child: Instructor,
      props: {
        instructorId: course.data.instructorId,
        userId: userId,
        navigate,
      },
    },
    {
      icon: CommentOutlined,
      name: "Reviews",
      child: Reviews,
      props: {
        userId: userId,
        courseId: courseId,
        reviews: reviews?.data,
        process: checkProcess?.data,
      },
    },
  ];

  const columnsCalendar = [
    {
      title: "Course",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <Flex align="center" gap={5} className="w-[100px]">
            <p className="break-words text-base font-semibold w-[150px]">
              {record.courseId.title}
            </p>
          </Flex>
        );
      },
    },
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      render: (_, record) => (
        <h5 className="font-bold text-base capitalize">
          {record?.dayOfWeek === 0
            ? "Sunday"
            : record?.dayOfWeek === 1
            ? "Monday"
            : record?.dayOfWeek === 2
            ? "Tuesday"
            : record?.dayOfWeek === 3
            ? "Wednesday"
            : record?.dayOfWeek === 4
            ? "Thursday"
            : record?.dayOfWeek === 5
            ? "Friday"
            : record?.dayOfWeek === 6
            ? "Saturday"
            : "Unknown Day"}
        </h5>
      ),
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      render: (_, record) => (
        <h5 className="font-bold text-base capitalize">{record?.time_start}</h5>
      ),
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      render: (_, record) => (
        <h5 className="font-bold text-base capitalize">{record?.time_end}</h5>
      ),
    },
  ];

  // Conditionally add Schedule item
  if (course?.data?.isStream) {
    items.push({
      icon: CalendarOutlined,
      name: "Schedule",
      child: Schedule,
      props: { sourceData: schedule || [] },
    });
  }

  const toggleLike = async () => {
    try {
      if (!JSON.parse(localStorage.getItem("user"))) {
        viewContext.handleError("You need to login first");
        navigate("/login");
      } else {
        setLoading(true);
        setIsLiked(!isLiked);
        // Gọi API để cập nhật trạng thái
        const response = await axios.post(`/api/favorite`, {
          userId: userId,
          courseId: courseId,
        });
        if (response?.data) {
          if (!isLiked) {
            message.success("You have liked this course.");
          } else {
            message.success("You have disliked this course.");
          }

          console.log("Updated successfully");
        } else {
          throw new Error("Failed to update");
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating like status", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <section
        style={{ backgroundImage: `url(${list_banner})` }}
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

            <Space>
              <UserOutlined className="text-white" />
              <span className="text-white text-sm">
                Created by{" "}
                <Typography.Link style={{ color: "white", fontSize: "16px" }}>
                  {course.data.instructorId.name.toString()}
                </Typography.Link>
              </span>
            </Space>
            {userId ? (
              <Space>
                <CheckCircleOutlined className="text-white" />
                <span className="text-white text-base">
                  {checkProcess?.data?.data?.process || 0} %
                </span>
              </Space>
            ) : (
              <></>
            )}

            <Space>
              <ShoppingCartOutlined className="text-white" />
              <span className="text-white text-base">
                {bill?.length} Enrolled
              </span>
            </Space>

            <Space>
              <Rate disabled defaultValue={course?.data?.rating} />
              <span className="text-white text-base">
                ({reviews?.data?.length} Reviews)
              </span>
            </Space>

            <Space align="center">
              <CalendarOutlined className="text-white" />
              <span className="text-white text-base">
                last updated {course?.data?.date_updated}
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
                  <img
                    src={course?.data?.thumbnail}
                    alt="image"
                    className="w-full h-[227px] rounded-lg"
                  />
                  <div className="bg-white absolute top-3 right-5 w-6 h-6 flex items-center justify-center rounded-full">
                    <HeartFilled
                      className={`text-xl ${
                        isLiked ? "text-red-500" : "text-[#6e798a81]"
                      }`}
                      onClick={toggleLike}
                    />
                  </div>
                </Space>
                <div className="p-4 w-full">
                  <Flex align="center" className="w-full">
                    <h1 className="font-semibold text-3xl mr-4">
                      {!course.data.price
                        ? "Free"
                        : course.data.price.toLocaleString() + " VND"}
                    </h1>
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
                          defaultHoverBg: "#754FFE",
                          defaultHoverBorderColor: "#754FFE",
                          defaultActiveBorderColor: "#754FFE",
                          defaultActiveColor: "#754FFE",
                          defaultHoverColor: "white",
                        },
                      },
                    }}
                  >
                    {checkProcess?.data?.data ? (
                      <></>
                    ) : (
                      <>
                        <Button
                          icon={<PlusOutlined />}
                          size="large"
                          className="w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500 mb-6"
                          onClick={
                            course.data.isStream
                              ? handleCheckSchedule
                              : handleAddToCart
                          }
                        >
                          Add to cart
                        </Button>
                      </>
                    )}
                  </ConfigProvider>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </section>
      <section>
        <Modal
          title="The course you are about to purchase appears to have a conflicting schedule with a course you have already purchased. Do you still want to continue?"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Table columns={columnsCalendar} dataSource={calendarData}></Table>
        </Modal>
      </section>
      <section className="max-w-screen-xl m-auto mb-12">
        <Typography.Title>Related courses</Typography.Title>
        <Row gutter={12}>
          {recommendedCourses.map((course) => (
            <Col span={6} key={course._id}>
              <Course course={course} />
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default CourseDetail;
