import React from 'react'
import Banner from '../components/Banner'
import { Avatar, Button, Col, Flex, Form, Input, Row, Space, Typography, Upload } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, KeyOutlined, LinkedinOutlined, LockOutlined, MailOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
const Affiliate = () => {
    return (
        <>
            <Banner name='Affiliate course history' />
            <section className='max-w-screen-xl m-auto my-12'>
                <Row gutter={12}>
                    <Col span={6}>
                        <Sidenav />
                    </Col>
                    <Col span={18}>
                        <div className='bg-white shadow-lg border rounded-lg px-6 py-8'>
                            <Flex align='center' justify='space-between' className='mb-6'>
                                <Flex align='center' gap={12}>
                                    <Avatar size={98} shape='circle' src='https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png' />
                                    <Space direction='vertical' >
                                        <Typography.Title level={5}>Profile photo</Typography.Title>
                                        <Typography.Text>Update your profile photo and personal details</Typography.Text>
                                    </Space>
                                </Flex>
                            </Flex>
                            <Typography.Title level={3}>Account information</Typography.Title>
                            <Form 
                                className='w-full'
                                layout="vertical"
                            >
                                <Row gutter={[12, 30]} className='pt-6 border-t pb-6 mb-8 border-b'>
                                    <Col span={24}>
                                        <Form.Item
                                            name="email"
                                            label={<Typography.Title level={5}>Email</Typography.Title>}
                                            rules={[
                                                { required: true, message: 'Please input your Email!' },
                                                { type: 'email', message: 'Please enter valid email address'}
                                            ]}
                                        >
                                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" size='large' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            name="password"
                                            label={<Typography.Title level={5}>Current password</Typography.Title>}
                                            rules={[{ required: true, message: 'Please enter your current password"!' }]}
                                        >
                                            <Input prefix={<KeyOutlined className="site-form-item-icon" />} placeholder="Enter current password" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="newpassword"
                                            label={<Typography.Title level={5}>New password</Typography.Title>}
                                            rules={[{ required: true, message: 'Please enter your new password!' }]}
                                        >
                                            <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Enter new password" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="c_password"
                                            label={<Typography.Title level={5}>Confirm password</Typography.Title>}
                                            rules={[{ required: true, message: 'Please enter your confirm password!' }]}
                                        >
                                            <Input prefix={<LinkedinOutlined className="site-form-item-icon" />} placeholder="Re-type your password" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button type="primary" size='large' className='bg-[#754FFE] px-6'>Save changes</Button>
                                    </Col>
                                </Row>
                            </Form>

                        </div>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Affiliate