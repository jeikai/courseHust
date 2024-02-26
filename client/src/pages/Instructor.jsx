import React from 'react'
import Layout from '../layout/Layout'
import { Avatar, Breadcrumb, Button, Card, Col, ConfigProvider, Flex, Image, Row, Space, Typography } from 'antd'
import { EditOutlined, EllipsisOutlined, FacebookOutlined, HomeOutlined, LinkedinOutlined, MailFilled, MessageOutlined, SettingOutlined, StarFilled, TwitterOutlined } from '@ant-design/icons'
import breadcramb from '../assets/course-breadcramb.png'
import book from '../assets/brd-book.png'
import Course from '../components/Course'
const Instructor = () => {
    return (
        <Layout>
            <section style={{ backgroundImage: `url(${breadcramb})` }} className="my-6">
                <Row className="max-w-screen-xl m-auto">
                    <Col span={18} className="flex items-center">
                        <Space direction="vertical">
                            <Breadcrumb className="z-10 text-2xl"
                                items={[
                                    {
                                        href: '',
                                        title: <>
                                            <HomeOutlined style={{ fontSize: '24px', color: 'white' }} />
                                            <span className="text-white">Home</span>
                                        </>,
                                    },
                                    {
                                        title: <span className="text-white">Educator profile</span>,
                                    },
                                ]}
                            />
                            <Typography.Title level={1} style={{ color: 'white', marginTop: '12px' }}>
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
                    <Col span={18} className='shadow-xl p-12 rounded-md'>
                        <div className='pb-8 px-2 border-b'>
                            <Flex align='start' justify='space-between'>
                                <Flex gap={24} align='start'>
                                    <Image
                                        width={150}
                                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                    <Space direction='vertical'>
                                        <Typography.Title level={3}>John Doe</Typography.Title>
                                        <Typography.Text className='text-base text-[#676C7D] font-semibold'>
                                            Adobe Certified Instructor & Adobe Certified Expert
                                        </Typography.Text>
                                    </Space>
                                </Flex>
                                <Space direction='vertical'>
                                    <Typography.Title level={4}>Rating</Typography.Title>
                                    <Typography.Text className='text-base text-[#676C7D] font-semibold'>
                                        <Flex gap={12}>
                                            <span>4</span>
                                            <span><StarFilled className='text-[#F9B23A]' /></span>
                                            <span>(9 Reviews)</span>
                                        </Flex>
                                    </Typography.Text>
                                </Space>
                            </Flex>
                        </div>
                        <div className='pb-8 px-2 border-b'>
                            <Typography.Title level={3} style={{ color: '#676C7D' }}>About</Typography.Title>
                            <Typography.Paragraph className='text-base' style={{ color: '#676C7D', lineHeight: '1.9', wordSpacing: '2.5px' }}>
                                Sharing is who I am, and teaching is where I am at my best, because I've been on both sides of that equation, and getting to deliver useful training is my meaningful way to be a part of the creative community.

                                I've spent a long time watching others learn, and teach, to refine how I work with you to be efficient, useful and, most importantly, memorable. I want you to carry what I've shown you into a bright future.

                                I have a wife (a lovely Irish girl) and kids. I have lived and worked in many places (as Kiwis tend to do) – but most of my 14+ years of creating and teaching has had one overriding theme: bringing others along for the ride as we all try to change the world with our stories, our labours of love and our art.

                                I'm a certified Adobe instructor (ACI) in Ireland. I'm also an Adobe Certified Expert (ACE) and have completed the Adobe Certified Associate training (ACA). And I don't just do Adobe. Remember, media is a very broad term – digital blew out the borders, so we are all constantly learning.

                                I've been teaching for 14+ years. I come from being a media designer and content creator – so I understand exactly where you're at now. I've been there. I love this stuff. Print, digital publishing, web and video. I can see how it all connects. And I can see how we can share those connections.

                                I built Bring Your Own Laptop in Ireland, New Zealand, Australia & online. I have a great team working with me to keep BYOL at the top of Adobe and digital media training. I understand business, I have one – so I know how important it is to get it right and make it work for you.

                                Now my focus is on Udemy. It's my mission to bring you the best training for digital media on Udemy.
                            </Typography.Paragraph>
                        </div>
                        <div className='pb-8 px-2 border-b'>
                            <Typography.Title level={3} style={{ color: '#676C7D' }}>Statistics</Typography.Title>
                            <Row>
                                <Col span={4}>
                                    <Flex vertical justify='center' align='center' className='border-r'>
                                        <h1 className='text-[54px] font-bold text-[#754FFE]'>7</h1>
                                        <h4 className='text-base font-semibold text-[#1E293B]'>Total students</h4>
                                    </Flex>
                                </Col>
                                <Col span={4}>
                                    <Flex vertical justify='center' align='center' className='border-r'>
                                        <h1 className='text-[54px] font-bold text-[#754FFE]'>7</h1>
                                        <h4 className='text-base font-semibold text-[#1E293B]'>Courses</h4>
                                    </Flex>
                                </Col>
                                <Col span={4}>
                                    <Flex vertical justify='center' align='center'>
                                        <h1 className='text-[54px] font-bold text-[#754FFE]'>7</h1>
                                        <h4 className='text-base font-semibold text-[#1E293B]'>Reviews</h4>
                                    </Flex>
                                </Col>
                            </Row>
                        </div>
                        <div className="pb-8 px-2 border-b">
                            <Typography.Title level={3} style={{ color: '#676C7D' }}>Statistics</Typography.Title>
                            <Row gutter={[0, 24]}>
                                <Col span={8}>
                                    <Course></Course>
                                </Col>
                                <Col span={8}>
                                    <Course></Course>
                                </Col>
                                <Col span={8}>
                                    <Course></Course>
                                </Col>
                                <Col span={8}>
                                    <Course></Course>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={6} className='h-fit'>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultBorderColor: '#754FFE'
                                    },
                                },
                            }}
                        >
                            <Card
                                className='shadow-xl'
                                actions={[
                                    <Button icon={<FacebookOutlined style={{ fontSize: '24px' }} className='text-[#754FFE]' />} size="large" />,
                                    <Button icon={<TwitterOutlined style={{ fontSize: '24px' }} className='text-[#754FFE]' />} size="large" />,
                                    <Button icon={<LinkedinOutlined style={{ fontSize: '24px' }} className='text-[#754FFE]' />} size="large" />,
                                ]}
                            >
                                <Card.Meta
                                    avatar={<Flex align='center' justify='center' className='h-full'><MailFilled className='text-2xl text-[#754FFE]' /></Flex>}
                                    title="Email:"
                                    description="admin@example.com                                "
                                />
                            </Card>
                        </ConfigProvider>
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
                            <Button icon={<MessageOutlined />} size='large' className='w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500 mb-6 mt-8'>Message</Button>
                        </ConfigProvider>
                    </Col>
                </Row>
            </section>
        </Layout>
    )
}

export default Instructor