import {
  Button,
  Carousel,
  Col,
  Collapse,
  Flex,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
// import Layout from "../layout/AppLayout"
import {
  ArrowRightOutlined,
  Html5Filled,
  JavaOutlined,
  JavaScriptOutlined,
  LeftOutlined,
  PythonOutlined,
  RightOutlined,
  RubyOutlined,
  SearchOutlined,
} from "@ant-design/icons"; 
import banner from "../assets/lovely-teenage.png";
import banner4 from "../assets/banner-4.png";
import course_icon from "../assets/icon/course-icon.png";
import schedule_icon from "../assets/icon/schedule-icon.png";
import group_icon from "../assets/icon/group-icon.png";
import course_banner from "../assets/banner/course-banner.png";
import meeting_banner from "../assets/banner/meeting-banner.png";
import quiz_banner from "../assets/banner/quiz-banner.png";
import bgcategories from "../assets/bgcategories.png";
import faq2 from "../assets/faq2.jpg";
import Course from "../components/Course";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../hooks/api.jsx";
import { Form } from "antd";
import { ViewContext } from "../context/View.jsx";
import Loader from "../components/Loader.jsx";

const Home = () => {
  const [courses, setCourse] = useState();
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8;

   // Calculate the current categories to display
   const indexOfLastCategory = currentPage * categoriesPerPage;
   const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
   const currentCategories = category?.data.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(category?.data.length / categoriesPerPage);

  const viewContext = useContext(ViewContext);
  
  const coursesAPI = useAPI("/api/course", null);
  const categoryAPI = useAPI("/api/category", null);

  useEffect(() => {
    if (coursesAPI.data && categoryAPI.data) {
      setIsLoading(true); 
      setCourse(coursesAPI);
      setCategory(categoryAPI);
      setIsLoading(false);
    }
  }, [coursesAPI, categoryAPI]);

  const text = [
    "A Learning Management System is a software application or platform designed to manage and deliver online educational courses, training programs, and learning content. It provides a centralized system for instructors to create, organize, track, and assess learning materials and activities.",
    "Common features of an LMS include course management, content creation and delivery, student enrollment and tracking, assessment and grading tools, communication and collaboration tools, reporting and analytics, and integration with other systems or tools.",
    "An LMS offers several benefits, such as: Centralized access to learning materials and resources.Efficient administration and management of courses and learners. Flexibility and scalability in delivering online education or training. Tracking and reporting on learner progress and performance. Improved communication and collaboration among instructors and learners. Cost savings by reducing the need for physical infrastructure.",
    "Yes, an LMS can be used in both academic and corporate environments. In academic settings, it facilitates online learning, course management, and assessment for schools, colleges, and universities. In corporate settings, it supports employee training, onboarding programs, skills development, and compliance training.",
  ];
  const items = [
    {
      key: "1",
      label: "What is a Learning Management System (LMS)?",
      children: <p>{text[0]}</p>,
    },
    {
      key: "2",
      label: "What are the key features of an LMS?",
      children: <p>{text[1]}</p>,
    },
    {
      key: "3",
      label:
        "How can an LMS benefit educational institutions and organizations?",
      children: <p>{text[2]}</p>,
    },
    {
      key: "4",
      label: "Is an LMS suitable for both academic and corporate settings?",
      children: <p>{text[3]}</p>,
    },
  ];
  const carousel1 = useRef();
  const carousel2 = useRef();

  const navigate = useNavigate();
  const handleSearch = (e) => {
    const { search } = e;
    if (!search) {
      message.error("You need to insert something");
    } else {
      navigate(`/courses?q=${search}`);
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <section className="m-auto">
        <Row className="home-banner bg-primary-green rounded-bl-[25%] rounded-br-[25%] px-20 pt-20"> 
          <Col span={12}>
            <h1 className="text-[54px] text-white font-bold tracking-wide mb-6">
            <span className="font-bold"><span className="text-[#F3627C]">Studying Online</span> is now much easier</span>
            </h1>
            <Typography.Text className="text-base tracking-widest text-white mb-6">
              <div className="pl-2 border-l-2 border-l-[#FB6871] leading-7">
                Study any topic, anytime on <span className="text-[#F3627C]">Academy.</span> explore thousands of courses {" "}
                <br />for the lowest price ever!
              </div>
            </Typography.Text>

            <div className="mt-12">
              <Form layout="horizontal" onFinish={handleSearch}>
                <Form.Item name={"search"}>
                  <Space.Compact
                    style={{ width: "90%" }}
                    className="bg-[#F8F7FF] p-1 border rounded-lg"
                  >
                    <Input
                      size="large"
                      placeholder="What do you want to learn?"
                      variant="borderless"
                    />
                    <Button
                      htmlType="submit"
                      size="large"
                      type="primary"
                      className="bg-primary-blue"
                      icon={<SearchOutlined />}
                    >
                      Search
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Form>
            </div>

            <div className="mt-12">
              <Row>
               <Col span={6}>
                  <h1 className="text-bold text-gradient text-[54px] font-bold text-[#1E293B] tracking-wide mb-0">
                    89%
                  </h1>
                  <span className="font-medium">Total Success</span>
                </Col>
                <Col span={6}>
                  <h1 className="text-bold text-gradient text-[54px] font-bold text-[#1E293B] tracking-wide mb-0">
                    30K+
                  </h1>
                  <span className="font-medium">Quality Courses</span>
                </Col>
                <Col span={6}>
                  <h1 className="text-bold text-gradient text-[54px] font-bold text-[#1E293B] tracking-wide mb-0">
                    15K+
                  </h1>
                  <span className="font-medium">Happy Students</span>
                </Col>
                <Col span={6}>
                  <h1 className="text-bold text-gradient text-[54px] font-bold text-[#1E293B] tracking-wide mb-0">
                    5K+
                  </h1>
                  <span className="font-medium">Experienced Teachers</span>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className="pt-5">
              <img src={banner} alt="banner" className="w-[500px] h-[600px]" />
              <img src={banner4} alt="banner-1" className="absolute top-[20%] w-[530px] h-[400px]" />
            </div>
          </Col>
        </Row>
       
       
        <div className="mt-12">
          <h2 className="text-bold text-center">
            <span className="font-bold text-[#2F327D]">All-In-One</span>
            <span className="font-bold text-[#00CBB8]"> Academy Platform</span>
          </h2>
          <div className="text-center pt-3">
            <span className="text-normal  text-[#696984]">
              Academy is one powerful online software suite that combines all the tools {""} <br></br> needed to run a successful school or office.
            </span>
          </div>
          <Row className="py-4 my-20 px-20 gap-[80px]">
            <Col span={7} className="shadow-lg p-10">
                <div className="flex flex-col justify-center items-center flex-columns">
                  <img src={course_icon} alt="banner-1" className="w-[100px] h-[100px] absolute top-[-50px]" />
                  <Space direction="vertical" gap="0" className="text-center">
                    <h4 className="mb-0 pb-0 font-bold text-bold text-primary-blue">
                      Diverse courses
                    </h4>
                    <Typography.Text className="text-base">
                      Simply register and start learning now with just one click, accessing a diverse range of courses across various domains.
                    </Typography.Text>
                  </Space>
                </div>
            </Col>

            <Col span={7} className="shadow-lg p-10">
              <div className="flex flex-col justify-center items-center flex-columns">
                <img src={schedule_icon} alt="banner-1" className="w-[100px] h-[100px] absolute top-[-50px]" />
                <Space direction="vertical" gap="0" className="text-center">
                  <h4 className="mb-0 pb-0 font-bold text-bold text-primary-blue">
                    Easy Scheduling & Attendance Tracking
                  </h4>
                  <Typography.Text className="text-base">
                    Schedule and reserve classrooms at one campus or multiple campuses. Keep detailed records of student attendance.
                  </Typography.Text>
                </Space>
              </div>
            </Col>

            <Col span={7} className="shadow-lg p-10">
              <div className="flex flex-col justify-center items-center flex-columns">
                <img src={group_icon} alt="banner-1" className="w-[100px] h-[100px] absolute top-[-50px]" />
                <Space direction="vertical" gap="0" className="text-center">
                  <h4 className="mb-0 pb-0 font-bold text-bold text-primary-blue">
                    Smart Recommendation
                  </h4>
                  <Typography.Text className="text-base">
                     Build strong bootcamp with our smart recommendation system and get the best result in your learning journey.
                  </Typography.Text>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className="bg-secondary-blue py-20 mb-12 h-[600px]">
      <div className="max-w-screen-xl m-auto">
        <div className="mb-10">
          <h2 className="text-bold text-center text-primary-blue">
            Choice favourite course from top category
          </h2>
        </div>
        <Row className="mt-12" gutter={[16, 24]}>
          {currentCategories && currentCategories.length > 0 ? (
            currentCategories.map((category, index) => (
              <Col
                span={6}
                key={index}
                onClick={() => navigate(`/courses?categoryname=${category?.title}`)}
              >
                <Space
                  direction="vertical"
                  className="card-category group w-full cursor-pointer hover:bg-[#FB6871] bg-white p-6 rounded-md duration-500"
                >
                  <h5 className="font-bold group-hover:text-white">
                    {category?.title}
                  </h5>
                  <a href="#" className="block mt-4 pb-6">
                    <ArrowRightOutlined className="text-xl font-bold group-hover:text-white text-[#FB6871]" />
                  </a>
                </Space>
              </Col>
            ))
          ) : (
            <p className="text-white">No categories available</p>
          )}
        </Row>
        <div className="pagination text-primary-blue font-medium flex justify-center gap-4 pt-10">
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>

      <section className="max-w-screen-xl m-auto">
        <div className="mb-10">
          <h2 className="text-bold text-center">
              <span className="font-bold text-[#2F327D]">Top Courses</span>
          </h2>
          <div className="text-center pt-3">
            <span className="text-normal  text-[#696984]">
              These are the most popular courses among listen courses learners worldwide
            </span>
          </div>
        </div>
        <div className="my-6 relative">
          <Button
            onClick={() => carousel1.current.prev()}
            className="absolute top-1/2 -left-6 z-10 bg-white"
            shape="circle"
            icon={<LeftOutlined className="text-[#754FFE]" />}
            size="large"
          />
          <Carousel ref={carousel1} autoplay slidesToShow={4}>
            {courses?.data?.map((course, index) => {
              return <Course key={index} course={course} />;
            })}
          </Carousel>
          <Button
            onClick={() => carousel1.current.next()}
            className="absolute top-1/2 -right-6 z-10 bg-white"
            shape="circle"
            icon={<RightOutlined className="text-[#754FFE]" />}
            size="large"
          />
        </div>
      </section>
      <section className="p-20 m-auto mt-24 bg-secondary-blue">
        <div className="mb-10">
          <h2 className="text-bold text-center">
              <span className="font-bold text-[#2F327D]">Recommended for you</span>
          </h2>
          <div className="text-center pt-3">
            <span className="text-normal  text-[#696984]">
              These are course recommendations based on your learning history
            </span>
          </div>
        </div>
        <div className="my-6 relative">
          <Button
            onClick={() => carousel2.current.prev()}
            className="absolute top-1/2 -left-6 z-10 bg-white"
            shape="circle"
            icon={<LeftOutlined className="text-[#754FFE]" />}
            size="large"
          />
          <Carousel ref={carousel2} autoplay slidesToShow={4}>
            {courses?.data?.map((course, index) => {
              return <Course key={index} course={course} />;
            })}
          </Carousel>
          <Button
            onClick={() => carousel2.current.next()}
            className="absolute top-1/2 -right-6 z-10 bg-white"
            shape="circle"
            icon={<RightOutlined className="text-[#754FFE]" />}
            size="large"
          />
        </div>
      </section>
      <section className="max-w-screen-xl m-auto mt-24">
        <div className="mb-10">
          <h2 className="text-bold text-center">
              <span className="font-bold text-[#2F327D]">Our</span>
              <span className="font-bold text-[#00CBB8]"> Features</span>
          </h2>
          <div className="text-center pt-3">
            <span className="text-normal  text-[#696984]">
              This very extraordinary feature, can make learning activities more efficient.
            </span>
          </div>
        </div>
        <Row className="mb-12">
          <Col span={11}>
            <div>
              <img
                src={course_banner}
                alt="course_banner"
                className="w-[800px] h-[300px]"
              />
            </div>
          </Col>
          <Col span={13}>
            <Flex align="center" gap={16}>
              <p className="text-[138px] text-primary-blue font-bold">1</p>
              <div>
                <h4 className="text-2xl font-bold text-[#1e293b] mb-5">
                  Tools For Teachers And Learners
                </h4>
                <p className="text-base font-normal text-[#676c7d]">
                  Class has a dynamic set of teaching tools built to be deployed and used during class.
                  Teachers can handout assignments in real-time for students to complete and submit.
                </p>
              </div>
            </Flex>
          </Col>
        </Row>
        <Row className="mb-14">
          <Col span={11} className="pl-10 mt-10">
            <Flex align="center" justify="flex-end" gap={16}>
              <p className="text-[100px] text-primary-blue font-bold">2</p>
              <div>
                <h4 className="text-2xl font-bold text-[#1e293b] mb-5">
                Everything you can do in a physical classroom, you can do with virtual classroom
                </h4>
                <p className="text-base font-normal text-[#676c7d]">
                  Academy's school management software helps traditional and online schools manage scheduling, attendance, payments and virtual classrooms all in one secure cloud-based system.Teachers can easily see all students and class data at one time.
                </p>
              </div>
            </Flex>
          </Col>
          <Col span={13}>
            <div>
              <img
                src={meeting_banner}
                alt="meeting_banner"
                className="w-[700px] h-[400px] block ml-auto"
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-12">
          <Col span={9}>
            <div>
              <img
                src={quiz_banner}
                alt="quiz_banner"
                className="w-[700px] h-[400px] block m-auto"
              />
            </div>
          </Col>
          <Col span={13}>
            <Flex align="center" gap={16}>
              <p className="text-[138px] text-primary-blue font-bold">3</p>
              <div>
                <h4 className="text-2xl font-bold text-[#1e293b] mb-5">
                  Assessments, Quizzes, Tests
                </h4>
                <p className="text-base font-normal text-[#676c7d]">
                  Easily launch live assignments, quizzes, and tests.
                  Student results are automatically entered in the online gradebook.
                </p>
              </div>
            </Flex>
          </Col>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto mt-24">
        <div className="mb-10">
          <h2 className="text-bold text-center">
              <span className="font-bold text-[#2F327D]">Frequently</span>
              <span className="font-bold text-[#00CBB8]"> Asked Questions</span>
          </h2>
          <div className="text-center pt-3">
            <span className="text-normal  text-[#696984]">
              Have something to know? Check here if you have any questions about us.
            </span>
          </div>
        </div>
        <Row>
          <Col span={12}>
            <Flex align="center" justify="center">
              <img src={faq2} alt="faq" className="w-[437px] h-[437px]" />
            </Flex>
          </Col>
          <Col span={12}>
            <div className="my-12">
              <Collapse items={items} />
              <Button className="mt-4 bg-[#754FFE]" size="large" type="primary">
                See more
              </Button>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Home;
