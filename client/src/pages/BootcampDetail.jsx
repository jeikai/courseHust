import React from 'react'
import Banner from '../components/Banner'
import { Avatar, Button, Col, Collapse, Divider, Flex, Form, Image, Input, Row, Space, Table, Typography, Upload } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, KeyOutlined, LinkedinOutlined, LockOutlined, MailOutlined, SettingOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
const BootcampDetail = () => {
    const navaigate = useNavigate()
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
                                <div className='py-5 border-b block group cursor-pointer'>
                                    <Row gutter={[0, 24]} align="middle" style={{ marginRight: 0 }}>
                                        <Col span={6}>
                                            <Image 
                                                src='https://demo.creativeitem.com/academy/uploads/bootcamp/bootcamp_thumbnail/bbd1e8dae93dc090582eb7a043d6021b.jpg'
                                                width={145}
                                                height={85}
                                                className='rounded-lg'
                                                preview={false}
                                            />
                                        </Col>
                                        <Col span={16}>
                                            <Flex vertical>
                                                <Typography.Title level={5}>CareerFoundry Web Devolopement for Beginners Course</Typography.Title>
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
                                            <Button onClick={() => navaigate(-1)} className='bg-[#754FFE] text-white ml-auto' size='large'>
                                                Back
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Collapse ghost className='mt-5'>
                                        <Collapse.Panel 
                                            header={
                                                <Typography.Title className='w-full hover:text-[#754FFE]' level={5}>
                                                    Introduction to Web Development
                                                </Typography.Title>
                                            } 
                                            key="1" 
                                            extra={
                                                <SettingOutlined
                                                    onClick={(event) => {
                                                    // If you don't want click extra trigger collapse, you can prevent this:
                                                    event.stopPropagation();
                                                    }}
                                                />
                                            }
                                            >
                                            <Space direction='vertical'>
                                                <Flex vertical>
                                                    <Link>
                                                        <Typography.Title className='hover:text-[#754FFE]' level={5}>HTML Foundations</Typography.Title>
                                                    </Link>
                                                    <Flex gap={12}>
                                                        <span className='bg-red-500 px-2 font-semibold text-white text-[13px] rounded-md'>Live</span>
                                                        <span className='text-[#6c757d] '>Jan-04-2024</span>
                                                    </Flex>
                                                </Flex>
                                                <Divider type="horizontal" />
                                                <Flex vertical>
                                                    <Typography.Title level={5}>HTML Foundations</Typography.Title>
                                                    <Flex gap={12}>
                                                        <span className='bg-red-500 px-2 font-semibold text-white text-[13px] rounded-md'>Live</span>
                                                        <span className='text-[#6c757d] '>Jan-04-2024</span>
                                                    </Flex>
                                                </Flex>
                                            </Space>
                                        </Collapse.Panel>
                                    </Collapse>
                                </div>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default BootcampDetail