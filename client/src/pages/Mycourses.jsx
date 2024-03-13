import React from 'react'
import Banner from '../components/Banner'
import { Alert, Avatar, Button, Col, Flex, Image, Progress, Rate, Row, Space, Typography } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Link } from 'react-router-dom'
import { PlayCircleOutlined } from '@ant-design/icons'

const Course = () => {
    return (
        <Col span={24}>
        <Link to={'/'}>
            <Row className='cursor-pointer'>
                <Col span={7}>
                    <img
                        src='https://demo.creativeitem.com/academy/uploads/thumbnails/course_thumbnails/optimized/course_thumbnail_default-new_121701001881.jpg'
                        className='w-[245px] h-[145px] cursor-pointer rounded-lg'
                    />
                </Col>
                <Col span={17}>
                    <Space direction='vertical' className='w-full'>
                        <Typography.Title level={5} style={{ color: '#676C7D' }}>
                            WordPress Theme Development with Bootstrap
                        </Typography.Title>
                        <Flex align='center' gap={30}>
                            <Flex align='center' gap={6} style={{ color: '#676C7D' }}>
                                <PlayCircleOutlined />
                                <span>Lectures 22</span>
                            </Flex>
                            <Flex align='center' gap={6} style={{ color: '#676C7D' }}>
                                <PlayCircleOutlined />
                                <span>Lectures 22</span>
                            </Flex>
                            <Flex align='center' gap={6} style={{ color: '#676C7D' }}>
                                <PlayCircleOutlined />
                                <span>Lectures 22</span>
                            </Flex>
                        </Flex>
                        <div className='pr-10'>
                            <Progress percent={30} size="small" />
                        </div>
                        <Alert
                            message={
                                <>
                                    <span>Up coming live class</span>
                                    <span className='font-semibold'> 8:00 PM, 13 Dec 2022</span>
                                </>
                            }
                            type="success"
                            className='text-center text-base text-[#0a3622] bg-[#d1e7dd] border-[#a3cfbb]'
                        />
                        <Flex align='end' justify='space-between' className='mt-2'>
                            <Space direction='vertical'>
                                <Flex align='center' gap={8}>
                                    <Avatar
                                        shape='circle'
                                        src='https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png'
                                    />
                                    <span className='text-[#676C7D]'>John Doe</span>
                                    <span>
                                        <Rate className='text-base' disabled defaultValue={2} />
                                    </span>
                                </Flex>
                                <div>
                                    <span className='text-[#676C7D]'>Expiry period -    <span className='text-[#198754] font-semibold'>
                                        LIFETIME ACCESS
                                    </span>
                                    </span>
                                </div>
                            </Space>
                            <Button type='primary' className='bg-[#754FFE] px-8 hover:-translate-y-1 duration-300' icon={<PlayCircleOutlined />}>
                                Start now
                            </Button>
                        </Flex>
                    </Space>
                </Col>
            </Row>
        </Link>
    </Col>
    )
}

const Mycourses = () => {
    return (
        <>
            <Banner name='My courses' />
            <section className='max-w-screen-xl m-auto my-12'>
                <Row gutter={12}>
                    <Col span={6}>
                        <Sidenav />
                    </Col>
                    <Col span={18}>
                        <div className='bg-white shadow-lg border rounded-lg px-6 py-8'>
                            <Typography.Title level={3}>Courses</Typography.Title>
                            <Row gutter={[12, 60]}>
                                <Course />
                                <Course />
                                <Course />
                                <Course />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Mycourses