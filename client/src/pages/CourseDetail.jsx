import React from 'react'
import Layout from '../layout/Layout'
import { Avatar, Breadcrumb, Button, Col, Collapse, ConfigProvider, Flex, Image, Rate, Row, Space, Tabs, Typography } from 'antd'
import { BarsOutlined, BgColorsOutlined, CalculatorOutlined, CalendarOutlined, ClockCircleOutlined, CommentOutlined, CreditCardOutlined, FacebookFilled, FacebookOutlined, FlagOutlined, HeartFilled, HomeOutlined, LinkedinOutlined, PlayCircleOutlined, PlusOutlined, ProfileOutlined, RetweetOutlined, SettingOutlined, TagsOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons'
import breadcramb from '../assets/course-breadcramb.png'
import item1 from '../assets/item-1.jpg'
import Course from '../components/Course'
const Overview = () => {
    return (
        <Space direction='vertical'>
            <Typography.Title level={3}>Course description</Typography.Title>
            <Typography.Paragraph style={{ color: '#676C7D' }}>
                Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries.
            </Typography.Paragraph>
            <Typography.Title level={3}>What will i learn?</Typography.Title>
            <Typography.Paragraph>
                <ul>
                    <li>
                        <Typography.Link className='text-base' style={{ color:'#676C7D' }} href="/docs/spec/proximity">Principles</Typography.Link>
                    </li>
                    <li>
                        <Typography.Link className='text-base' style={{ color:'#676C7D' }} href="/docs/spec/overview">Patterns</Typography.Link>
                    </li>
                    <li>
                        <Typography.Link className='text-base' style={{ color:'#676C7D' }} href="/docs/resources">Resource Download</Typography.Link>
                    </li>
                </ul>
            </Typography.Paragraph>
            <Typography.Title level={3}>Requirements</Typography.Title>
            <Typography.Paragraph>
                <ul>
                    <li>
                        <Typography.Link className='text-base' style={{ color:'#676C7D' }} href="/docs/spec/proximity">Principles</Typography.Link>
                    </li>
                    <li>
                        <Typography.Link className='text-base' style={{ color:'#676C7D' }} href="/docs/spec/overview">Patterns</Typography.Link>
                    </li>
                    <li>
                        <Typography.Link className='text-base' style={{ color:'#676C7D' }} href="/docs/resources">Resource Download</Typography.Link>
                    </li>
                </ul>
            </Typography.Paragraph>
        </Space>
    )
}

const Curriculum = () => {
    const items = [
    {
        key: '1',
        label: <Flex align='center' justify='space-between'>
            <h5 className='font-semibold text-[18px]'>Getting Started</h5>
            <Flex gap={12} align='center' className='text-base text-[#676C7D]'>
                <span>1 Lessons</span>
                <span>|</span>
                <span>1 Lessons</span>
            </Flex>
        </Flex>,
        children: <ul>
            <li className='hover:bg-slate-100 px-1 py-3'>
                <a href="#" className='group'>
                    <Flex align='center' justify='space-between'>
                        <Flex align='center' gap={12}>
                            <PlayCircleOutlined className='text-xl text-[#754FFE]' />
                            <span className='text-[#676C7D]'>Welcome & What We're Learning</span>
                        </Flex>
                        <span className='text-[#676C7D]'>00:09:11</span>
                    </Flex>
                </a>
            </li>
        </ul>,
    },
    ];
    return (
        <Collapse defaultActiveKey={['1']} ghost items={items} />
    )
}

const Reviews = () => {
    return (
        <>
            <Row className='mb-4 pb-4 border-b'>
                <Col span={5}>
                    <Space direction='vertical' align='center'>
                        <Typography.Title level={5}>Signe Thompson</Typography.Title>
                        <Typography.Text>26-Nov-2023</Typography.Text>
                        <Typography.Title level={2}>4</Typography.Title>
                        <Rate defaultValue={4}/>
                    </Space>
                </Col>
                <Col span={18}>
                    <div className='text-base'>
                        From the outset, the course structure impressed me with its thoughtful organization. Each module builds seamlessly upon the last, creating a logical and comprehensive learning journey. The content is delivered in a way that is both engaging and accessible, making complex concepts easy to grasp.
                    </div>
                </Col>
            </Row>
            <Row className='mb-4 pb-4 border-b'>
                <Col span={5}>
                    <Space direction='vertical' align='center'>
                        <Typography.Title level={5}>Signe Thompson</Typography.Title>
                        <Typography.Text>26-Nov-2023</Typography.Text>
                        <Typography.Title level={2}>4</Typography.Title>
                        <Rate defaultValue={4}/>
                    </Space>
                </Col>
                <Col span={18}>
                    <div className='text-base'>
                        From the outset, the course structure impressed me with its thoughtful organization. Each module builds seamlessly upon the last, creating a logical and comprehensive learning journey. The content is delivered in a way that is both engaging and accessible, making complex concepts easy to grasp.
                    </div>
                </Col>
            </Row>
        </>
    )
}

const Instructor = () => {
    return (
        <Space direction='horizontal'>
            <Image
                width={200}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <Space direction='vertical' className='ml-6'>
                <Typography.Title level={5}>John Doe</Typography.Title>
                <Typography.Text>Adobe Certified Instructor & Adobe Certified Expert</Typography.Text>
                <Typography.Text className='text-line-2'>
                    Sharing is who I am, and teaching is where I am at my best, because I've been on both sides of that equation, and getting to deliver useful training is my meaningful way to be a part of the creative community.I've spent a long time watching others learn, and teach, to refine how I work with you to be efficient, useful and, most importantly, memorable. I want you to carry what I've shown you into a bright future.I have a wife (a lovely Irish girl) and kids. I have lived and worked in many places (as Kiwis tend to do) – but most of my 14+ years of creating and teaching has had one overriding theme: bringing others along for the ride as we all try to change the world with our stories, our labours of love and our art.I'm a certified Adobe instructor (ACI) in Ireland. I'm also an Adobe Certified Expert (ACE) and have completed the Adobe Certified Associate training (ACA). And I don't just do Adobe. Remember, media is a very broad term – digital blew out the borders, so we are all constantly learning.I've been teaching for 14+ years. I come from being a media designer and content creator – so I understand exactly where you're at now. I've been there. I love this stuff. Print, digital publishing, web and video. I can see how it all connects. And I can see how we can share those connections.I built Bring Your Own Laptop in Ireland, New Zealand, Australia & online. I have a great team working with me to keep BYOL at the top of Adobe and digital media training. I understand business, I have one – so I know how important it is to get it right and make it work for you.Now my focus is on Udemy. It's my mission to bring you the best training for digital media on Udemy.
                </Typography.Text>
                <Flex gap="small" className='mt-6'>
                    <Button icon={<FacebookOutlined className='text-xl' />} size='normal' />
                    <Button icon={<TwitterOutlined className='text-xl' />} size='normal' />
                    <Button icon={<LinkedinOutlined className='text-xl' />} size='normal' />
                    <Button className='bg-[#754FFE]' type='primary' size='normal'>View profile</Button>
                </Flex>
            </Space>
        </Space>
    )
}

const CourseDetail = () => {
    const items = [
        {
            icon: TagsOutlined,
            name: 'Overview',
            child: Overview
        },
        {
            icon: ProfileOutlined,
            name: 'Curriculum',
            child: Curriculum
        },
        {
            icon: UserOutlined,
            name: 'Instructor',
            child: Instructor
        },
        {
            icon: CommentOutlined,
            name: 'Reviews',
            child: Reviews
        },
    ]
  return (
    <Layout>
        <section style={{ backgroundImage: `url(${breadcramb})` }} className="my-6 py-12">
            <Row className="max-w-screen-xl m-auto">
                <Space direction='vertical'>
                    <Typography.Title style={{ color: 'white' }}>Introduction and Learn bootstrap</Typography.Title>
                    <Typography.Text style={{ color: 'white', fontSize: '18px' }}>Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces.</Typography.Text> 
                    <Flex align='center' justify='space-between' className='my-2'>
                        <Space>
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                            <span className='text-white text-sm'>Created by <Typography.Link style={{ color: 'white', fontSize: '16px' }}>John Doe</Typography.Link> </span>
                        </Space>
                        <Space>
                            <ClockCircleOutlined className='text-white' />
                            <span className='text-white text-base'>01:05:12 Hours</span>
                        </Space>
                        <Space>
                            <UserOutlined className='text-white' />
                            <span className='text-white text-base'>8 Enrolled</span>
                        </Space>
                        <Space>
                            <Rate disabled defaultValue={2} />
                            <span className='text-white text-base'>(3 Reviews)</span>
                        </Space>
                    </Flex>
                    <Space align='center'>
                        <CalendarOutlined className='text-white' />
                        <span className='text-white text-base'>last updated Thu, 13-Jul-2023</span>
                    </Space>
                </Space>
            </Row>
        </section>
        <section className='max-w-screen-xl m-auto mb-12'>
            <Row gutter={24}>
                <Col span={17}>
                    <ConfigProvider
                        theme={{
                            components: {
                              Tabs: {
                                // cardGutter: 12
                                horizontalItemGutter: 50,
                                itemHoverColor: '#754FFE',
                                itemSelectedColor: '#754FFE',
                                inkBarColor: '#754FFE',
                                horizontalItemMarginRTL: ''
                              },
                            },
                        }}
                    >
                        <Tabs
                            className='p-4 shadow-xl rounded-md mt-[-60px] bg-white'
                            size='large'
                            defaultActiveKey="2"
                            items={items.map((item, i) => {
                            return {
                                key: i,
                                label: <span className='font-semibold text-base'>{item.name}</span>,
                                children: <item.child />,
                                icon: <item.icon className='text-base' />,
                            };
                            })}
                        />
                    </ConfigProvider>
                </Col>
                <Col span={7}>
                    <div className='shadow-lg rounded-md sticky mt-[-200px]'>
                        <Space direction='vertical' className='p-2'>
                            <Space className='relative' style={{ columnGap: 0 }}>
                                <div className='absolute p-2 rounded-lg cursor-pointer top-[calc(50%-16px)] left-[calc(50%-16px)] bg-[#0000005a]'>
                                    <PlayCircleOutlined className='text-3xl text-white' />
                                </div>
                                <img src={item1} alt="image" className='w-full h-[227px] rounded-lg' />
                                <div className="bg-white absolute top-3 right-5 w-6 h-6 flex items-center justify-center rounded-full">
                                    <HeartFilled className="text-[#6e798a81]" />
                                </div>
                            </Space>
                            <div className='p-4 w-full'>
                                <Flex align='center' className='w-full'>
                                    <h1 className='font-semibold text-3xl mr-4'>$12</h1>
                                    <del className='text-xl'>$18.00</del>
                                    <a href="#" className='ml-auto block'>
                                        <RetweetOutlined className='text-2xl' />
                                    </a>
                                </Flex>
                            </div>
                            <div className='p-3 w-full border-b'>
                                <Flex align='center' className='w-full'>
                                    <BarsOutlined className='text-2xl mr-2 text-red-500' />
                                    <span className='font-semibold text-base'>Lectures</span>
                                    <div className='ml-auto text-base font-semibold'>
                                        10
                                    </div>
                                </Flex>
                            </div>
                            <div className='p-3 w-full border-b'>
                                <Flex align='center' className='w-full'>
                                    <CalculatorOutlined className='text-2xl mr-2 text-purple-500' />
                                    <span className='font-semibold text-base'>Quizzes</span>
                                    <div className='ml-auto text-base font-semibold'>
                                        10
                                    </div>
                                </Flex>
                            </div>
                            <div className='p-3 w-full border-b'>
                                <Flex align='center' className='w-full'>
                                    <SettingOutlined className='text-2xl mr-2 text-green-500' />
                                    <span className='font-semibold text-base'>Skill level</span>
                                    <div className='ml-auto text-base font-semibold'>
                                        Advanced
                                    </div>
                                </Flex>
                            </div>
                            <div className='p-3 w-full border-b'>
                                <Flex align='center' className='w-full'>
                                    <FlagOutlined className='text-2xl mr-2 text-red-500' />
                                    <span className='font-semibold text-base'>Expiry period</span>
                                    <div className='ml-auto text-base font-semibold'>
                                        Lifetime
                                    </div>
                                </Flex>
                            </div>
                            <div className='p-3 w-full border-b'>
                                <Flex align='center' className='w-full'>
                                    <BgColorsOutlined className='text-2xl mr-2 text-pink-500' />
                                    <span className='font-semibold text-base'>Certificate</span>
                                    <div className='ml-auto text-base font-semibold'>
                                        Yes
                                    </div>
                                </Flex>
                            </div>
                            <div className='p-3 w-full'>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                        Button: {
                                            /* here is your component tokens */
                                            defaultHoverBg: '#754FFE',
                                            defaultHoverBorderColor: '#754FFE',
                                            defaultActiveBorderColor: '#754FFE',
                                            defaultActiveColor: '#754FFE',
                                            defaultHoverColor: 'white',
                                        },
                                        },
                                    }}
                                >
                                    <Button icon={<PlusOutlined/>} size='large' className='w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500 mb-6'>Add to cart</Button>
                                    <Button icon={<CreditCardOutlined/>} size='large' className='w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500'>Buy now</Button>
                                </ConfigProvider>
                            </div>
                        </Space>
                    </div>
                </Col>
            </Row>
        </section>
        <section className='max-w-screen-xl m-auto mb-12'>
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
    </Layout>
  )
}

export default CourseDetail