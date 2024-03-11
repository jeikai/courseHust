import { Button, Carousel, Col, Collapse, Flex, Input, Row, Space, Typography } from "antd"
// import Layout from "../layout/AppLayout"
import { ArrowRightOutlined, BarcodeOutlined, BulbOutlined, CameraOutlined, CodeOutlined, EditOutlined, FilePdfFilled, FileWordOutlined, FontColorsOutlined, Html5Filled, LeftCircleOutlined, LeftOutlined, MobileOutlined, PaperClipOutlined, PictureFilled, PictureOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons"
import banner from '../assets/home-3.png'
import banner1 from '../assets/banner-1.png'
import banner2 from '../assets/banner-2.png'
import banner3 from '../assets/banner-3.png'
import think1 from '../assets/think-1.png'
import think2 from '../assets/think-2.png'
import think3 from '../assets/think-3.png'
import bgcategories from '../assets/bgcategories.png'
import faq2 from '../assets/faq2.jpg'
import Course from "../components/Course"
import { useRef } from "react"
const Home = () => {
  const categories = [
    {
      icon: Html5Filled,
      name: 'HTML & CSS',
      qty: 3
    },
    {
      icon: BarcodeOutlined,
      name: 'Color Theory',
      qty: 2
    },
    {
      icon: CameraOutlined,
      name: 'Photoshop',
      qty: 2
    },
    {
      icon: FileWordOutlined,
      name: 'WordPress Theme',
      qty: 1
    },
    {
      icon: FilePdfFilled,
      name: 'Adobe Illustrator',
      qty: 1
    },
    {
      icon: EditOutlined,
      name: 'Drawing',
      qty: 1
    },
    {
      icon: PictureOutlined,
      name: 'Blender',
      qty: 1
    },
    {
      icon: PaperClipOutlined,
      name: 'Sewing',
      qty: 1
    },
    {
      icon: PictureFilled,
      name: 'Motion Graphics',
      qty: 1
    },
    {
      icon: BulbOutlined,
      name: 'Lighting Design',
      qty: 1
    },
    {
      icon: MobileOutlined,
      name: 'Mobile App Design',
      qty: 1
    },
    {
      icon: CodeOutlined,
      name: 'Bootstrap',
      qty: 1
    },
  ]
  const text = [
    "A Learning Management System is a software application or platform designed to manage and deliver online educational courses, training programs, and learning content. It provides a centralized system for instructors to create, organize, track, and assess learning materials and activities.",
    "Common features of an LMS include course management, content creation and delivery, student enrollment and tracking, assessment and grading tools, communication and collaboration tools, reporting and analytics, and integration with other systems or tools.",
    "An LMS offers several benefits, such as: Centralized access to learning materials and resources.Efficient administration and management of courses and learners. Flexibility and scalability in delivering online education or training. Tracking and reporting on learner progress and performance. Improved communication and collaboration among instructors and learners. Cost savings by reducing the need for physical infrastructure.",
    "Yes, an LMS can be used in both academic and corporate environments. In academic settings, it facilitates online learning, course management, and assessment for schools, colleges, and universities. In corporate settings, it supports employee training, onboarding programs, skills development, and compliance training."
  ];
  const items = [
    {
      key: '1',
      label: 'What is a Learning Management System (LMS)?',
      children: <p>{text[0]}</p>,
    },
    {
      key: '2',
      label: 'What are the key features of an LMS?',
      children: <p>{text[1]}</p>,
    },
    {
      key: '3',
      label: 'How can an LMS benefit educational institutions and organizations?',
      children: <p>{text[2]}</p>,
    },
    {
      key: '4',
      label: 'Is an LMS suitable for both academic and corporate settings?',
      children: <p>{text[3]}</p>,
    },
  ];
  const carousel = useRef()
  return (
    <>
      <section className="max-w-screen-xl m-auto py-24">
        <Row>
          <Col span={12}>
            <h1 className="text-[54px] font-bold text-[#1E293B] tracking-wide mb-6">
              Start <span className="text-[#FB6871]">learning</span> from <br /> best platform
            </h1>
            <Typography.Text className="text-base tracking-widest text-[#676C7D] mb-6">
              <div className="pl-2 border-l-2 border-l-[#FB6871] leading-7">
                Study any topic, anytime. explore thousands of courses for <br /> the lowest price ever!
              </div>
            </Typography.Text>

            <div className="mt-12">
              <form action="">
                <Space.Compact style={{ width: '90%' }} className="bg-[#F8F7FF] p-1 border">
                  <Input size="large" placeholder="What do you want to learn?" variant="borderless" />;
                  <Button size="large" type="primary" className="bg-[#754FFE]" icon={<SearchOutlined />}>
                    Search
                  </Button>
                </Space.Compact>
              </form>
            </div>

            <div className="mt-12">
              <Row>
                <Col span={6}>
                  <h1 className="text-[54px] font-bold text-[#1E293B] tracking-wide mb-0">
                    9+
                  </h1>
                  <span>Happy students</span>
                </Col>
                <Col span={6}>
                  <h1 className="text-[54px] font-bold text-[#1E293B] tracking-wide mb-0">
                    5+
                  </h1>
                  <span>Experienced instructors</span>
                </Col>
              </Row>
            </div>

          </Col>
          <Col span={12}>
            <div className="pt-5">
              <img src={banner} alt="banner" className="w-[546px] h-[543px]" />
            </div>
          </Col>
        </Row>

        <Row className="py-4 shadow mt-12">
          <Col span={8}>
            <Flex gap={12} align="center" className="p-4 px-8 cursor-pointer border-r-2">
              <img src={banner1} alt="banner-1" className="w-10 h-10" />
              <Space direction="vertical" gap="0">
                <h4 className="mb-0 pb-0 font-bold text-base">16 Online courses</h4>
                <Typography.Text className="text-base">Explore a variety of fresh topics</Typography.Text>
              </Space>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex gap={12} align="center" className="p-4 px-8 cursor-pointer border-r-2">
              <img src={banner2} alt="banner-1" className="w-10 h-10" />
              <Space direction="vertical" gap="0">
                <h4 className="mb-0 pb-0 font-bold text-base">Expert instruction</h4>
                <Typography.Text className="text-base">Find the right course for you</Typography.Text>
              </Space>
            </Flex>
          </Col>
          <Col span={8}>
            <Flex gap={12} align="center" className="p-4 px-8 cursor-pointer">
              <img src={banner3} alt="banner-1" className="w-10 h-10" />
              <Space direction="vertical" gap="0">
                <h4 className="mb-0 pb-0 font-bold text-base">Smart solution</h4>
                <Typography.Text className="text-base">Learn on your schedule</Typography.Text>
              </Space>
            </Flex>
          </Col>
        </Row>
      </section>
      <section className="bg-[#131111] py-20 mb-12" style={{ backgroundImage: `url(${bgcategories})` }}>
        <div className="max-w-screen-xl m-auto">
          <Typography.Title level={2} className="text-center" style={{ color: 'white', }}>
            Top categories
          </Typography.Title>
          <Row className="mt-12" gutter={[16, 24]}>
            {categories.map((category, index) => {
              return (
                <Col span={6} key={index}>
                  <Space direction="vertical" className="card-category group w-full cursor-pointer hover:bg-[#FB6871] bg-white p-6 rounded-md duration-500">
                    <a href="" className="mb-8 block">
                      <category.icon className="p-2 text-xl group-hover:text-white group-hover:border-white text-[#FB6871] border-2 border-[#FB6871] rounded-full" />
                    </a>
                    <h5 className="font-bold group-hover:text-white">{category.name}</h5>
                    <span className="text-base group-hover:text-white">{category.qty} Courses</span>
                    <a href="" className="block mt-4 pb-6">
                      <ArrowRightOutlined className="text-xl font-bold group-hover:text-white text-[#FB6871]" />
                    </a>
                  </Space>
                </Col>
              )
            })}
          </Row>
        </div>
      </section>
      <section className="max-w-screen-xl m-auto">
        <Typography.Title level={2}>Top courses</Typography.Title>
        <Typography.Text>
          These are the most popular courses among listen courses learners worldwide
        </Typography.Text>
        <div className="my-6 relative">
          <Button onClick={() => carousel.current.prev()} className="absolute top-1/2 -left-6 z-10 bg-white" shape="circle" icon={<LeftOutlined className="text-[#754FFE]" />} size="large" />
          <Carousel ref={carousel} autoplay slidesToShow={4}>
            <Course />
            <Course />
            <Course />
            <Course />
            <Course />
          </Carousel>
          <Button onClick={() => carousel.current.next()} className="absolute top-1/2 -right-6 z-10 bg-white" shape="circle" icon={<RightOutlined className="text-[#754FFE]" />} size="large" />
        </div>
      </section>
      <section className="max-w-screen-xl m-auto mt-24">
        <Typography.Title className="text-center" level={2}>Top 10 Latest courses</Typography.Title>
        <Typography.Text className="text-center block">
          These are the most popular courses among listen courses learners worldwide
        </Typography.Text>
        <div className="my-6 relative">
          <Button onClick={() => carousel.current.prev()} className="absolute top-1/2 -left-6 z-10 bg-white" shape="circle" icon={<LeftOutlined className="text-[#754FFE]" />} size="large" />
          <Carousel ref={carousel} autoplay slidesToShow={4}>
            <Course />
            <Course />
            <Course />
            <Course />
            <Course />
          </Carousel>
          <Button onClick={() => carousel.current.next()} className="absolute top-1/2 -right-6 z-10 bg-white" shape="circle" icon={<RightOutlined className="text-[#754FFE]" />} size="large" />
        </div>
      </section>
      <section className="max-w-screen-xl m-auto mt-24">
        <Typography.Title className="text-center" level={2}>Think more clearly</Typography.Title>
        <Typography.Text className="text-center block">
          Gather your thoughts, and make your decisions clearly
        </Typography.Text>
        <Row className="mb-12">
          <Col span={8}>
            <div>
              <img src={think1} alt="think1" className="w-[300px] h-[300px] block m-auto" />
            </div>
          </Col>
          <Col span={16}>
            <Flex align="center" gap={16}>
              <p className="text-[138px] text-[#8054e7] font-bold">1</p>
              <div>
                <h4 className="text-2xl font-bold text-[#1e293b] mb-5">"Unleashing Your Inner Champion"</h4>
                <p className="text-base font-normal text-[#676c7d]">Embrace your untapped potential, push your limits, and unlock the champion within you. This motivational title encourages you to tap into your inner strength, overcome obstacles, and strive for excellence in all areas of your life.</p>
              </div>
            </Flex>
          </Col>
        </Row>
        <Row className="mb-12">
          <Col span={16} className="pl-10">
            <Flex align="center" justify="flex-end" gap={16}>
              <p className="text-[138px] text-[#8054e7] font-bold">2</p>
              <div>
                <h4 className="text-2xl font-bold text-[#1e293b] mb-5">"Embracing the Journey of Growth"</h4>
                <p className="text-base font-normal text-[#676c7d]">Life is a constant journey of growth and self-improvement. This motivational title reminds you to embrace challenges, learn from failures, and celebrate successes along the way. Embrace the journey of personal and professional development.</p>
              </div>
            </Flex>
          </Col>
          <Col span={8}>
            <div>
              <img src={think2} alt="think2" className="w-[300px] h-[300px] block ml-auto" />
            </div>
          </Col>
        </Row>
        <Row className="mb-12">
          <Col span={8}>
            <div>
              <img src={think3} alt="think3" className="w-[300px] h-[300px] block m-auto" />
            </div>
          </Col>
          <Col span={16}>
            <Flex align="center" gap={16}>
              <p className="text-[138px] text-[#8054e7] font-bold">4</p>
              <div>
                <h4 className="text-2xl font-bold text-[#1e293b] mb-5">"Igniting the Spark of Possibility"</h4>
                <p className="text-base font-normal text-[#676c7d]">Within each of us lies a spark of possibility waiting to be ignited. This motivational title inspires you to dream big, believe in yourself, and pursue your passions with unwavering determination.</p>
              </div>
            </Flex>
          </Col>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto mt-24">
        <Typography.Title className="text-center" level={2}>Frequently asked questions</Typography.Title>
        <Typography.Text className="text-center block">
          Have something to know? Check here if you have any questions about us.
        </Typography.Text>
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
  )
}

export default Home