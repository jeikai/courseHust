import React from 'react'
import Banner from '../components/Banner'
import { Avatar, Button, Col, Divider, Flex, Form, Image, Input, Row, Space, Table, Typography, Upload } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, KeyOutlined, LinkedinOutlined, LockOutlined, MailOutlined, RightOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const Bootcamp = () => {

    return (
        <>
            <Banner name='My bootcamp' />
            <section className='max-w-screen-xl m-auto my-12'>
                <Row gutter={12}>
                    <Col span={6}>
                        <Sidenav />
                    </Col>
                    <Col span={18}>
                        <div className='bg-white shadow-lg border rounded-lg px-6 py-8'>
                            <Typography.Title level={3}>Bootcamp</Typography.Title>
                            <Space direction='vertical' className='w-full'>
                                <Link to={'/home/my_bootcamp/1'} className='py-5 border-b block group cursor-pointer'>
                                    <Row gutter={[60, 24]} align="middle" style={{ marginRight: 0 }}>
                                        <Col span={6}>
                                            <Image 
                                                src='https://demo.creativeitem.com/academy/uploads/bootcamp/bootcamp_thumbnail/bbd1e8dae93dc090582eb7a043d6021b.jpg'
                                                width={145}
                                                height={85}
                                                className='rounded-lg'
                                            />
                                        </Col>
                                        <Col span={16}>
                                            <Flex vertical>
                                                <Typography.Title level={5} className='group-hover:text-[#754FFE]'>CareerFoundry Web Devolopement for Beginners Course</Typography.Title>
                                                <Flex align='center' gap={32} className='text-[#6E798A]'>
                                                    <Flex gap={4} align='center'>
                                                        <UserOutlined />
                                                        <span>5 live classes</span>
                                                    </Flex>
                                                    <Flex gap={4} align='center'>
                                                        <span>Start: </span>
                                                        <span>5 live classes</span>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Col>
                                        <Col span={2} style={{ paddingLeft: 0 }}>
                                            <RightOutlined className='group-hover:text-[#754FFE] text-xl ml-auto'/>
                                        </Col>
                                    </Row>
                                </Link>
                                <Link className='py-5 border-b block group cursor-pointer'>
                                    <Row gutter={[60, 24]} align="middle">
                                        <Col span={6}>
                                            <Image 
                                                src='https://demo.creativeitem.com/academy/uploads/bootcamp/bootcamp_thumbnail/bbd1e8dae93dc090582eb7a043d6021b.jpg'
                                                width={145}
                                                height={85}
                                                className='rounded-lg'
                                            />
                                        </Col>
                                        <Col span={18}>
                                            <Flex vertical>
                                                <Typography.Title level={5} className='group-hover:text-[#754FFE]'>CareerFoundry Web Devolopement for Beginners Course</Typography.Title>
                                                <Flex align='center' gap={32} className='text-[#6E798A]'>
                                                    <Flex gap={4} align='center'>
                                                        <UserOutlined />
                                                        <span>5 live classes</span>
                                                    </Flex>
                                                    <Flex gap={4} align='center'>
                                                        <span>Start: </span>
                                                        <span>5 live classes</span>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Col>
                                    </Row>
                                </Link>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Bootcamp