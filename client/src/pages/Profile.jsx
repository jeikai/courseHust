import React from 'react'
import Banner from '../components/Banner'
import { Avatar, Button, Col, Flex, Form, Input, Row, Space, Typography, Upload } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
const Profile = () => {
    const props = {
        name: 'file',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return (
        <>
            <Banner name='User profile' />
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
                                <Upload {...props}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Flex>
                            <Typography.Title level={3}>Profile info</Typography.Title>
                            <Form 
                                className='w-full'
                                layout="vertical"
                            >
                                <Row gutter={[12, 30]} className='pt-6 border-t pb-12 mb-8 border-b'>
                                    <Col span={12}>
                                        <Form.Item
                                            name="firstname"
                                            label={<Typography.Title level={5}>First name</Typography.Title>}
                                            rules={[{ required: true, message: 'Please input your First name!' }]}
                                        >
                                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First name" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="lastname"
                                            label={<Typography.Title level={5}>First name</Typography.Title>}
                                            rules={[{ required: true, message: 'Please input your Last name!' }]}
                                        >
                                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last name" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Typography.Title level={5}>Biography</Typography.Title>
                                        <Editor
                                            apiKey='by05nyt9dhljko786tzo81q4vzgsn5hrdjq81e4kb3wi5yyp'
                                            init={{
                                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                                placeholder: 'Write something awesome',
                                            }}
                                        />  
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            name="twitter"
                                            label={<Typography.Title level={5}>Add your twitter link</Typography.Title>}
                                            rules={[{ required: true, message: 'Please input your link twitter!' }]}
                                        >
                                            <Input prefix={<TwitterOutlined className="site-form-item-icon" />} placeholder="twitter" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="facebook"
                                            label={<Typography.Title level={5}>Add your facebook link</Typography.Title>}
                                            rules={[{ required: true, message: 'Please input your link facebook!' }]}
                                        >
                                            <Input prefix={<FacebookOutlined className="site-form-item-icon" />} placeholder="facebook" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="linkedin"
                                            label={<Typography.Title level={5}>Add your linkedin link</Typography.Title>}
                                            rules={[{ required: true, message: 'Please input your link linkedin!' }]}
                                        >
                                            <Input prefix={<LinkedinOutlined className="site-form-item-icon" />} placeholder="linkedin" size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button type="primary" size='large' className='bg-[#754FFE] px-6'>Save</Button>
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

export default Profile