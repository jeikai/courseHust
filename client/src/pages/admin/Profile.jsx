import React from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, Col, Flex, Form, Input, Row, Typography, Upload } from 'antd'
import { Editor } from '@tinymce/tinymce-react'
import { UploadOutlined } from '@ant-design/icons'

const Profile = () => {
    
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Profile',
        },
    ]
    const [formProfile] = Form.useForm()
    const [formPassword] = Form.useForm()

  return (
    <section>
        <Bread title="Profile" items={breadcrumb} />
        <Row gutter={24}>
            <Col span={16}>
                <div className='shadow-md border bg-white p-8'>
                    <Typography.Title level={4}>
                        BASIC INFO
                    </Typography.Title>
                    <Form
                        form={formProfile}
                        layout='vertical'
                    >
                        <Form.Item
                            name={"firstName"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>First name</Typography.Title>}
                        >
                            <Input placeholder='Enter your first name' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"lastName"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Last name</Typography.Title>}
                        >
                            <Input placeholder='Enter your last name' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"email"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Email</Typography.Title>}
                        >
                            <Input placeholder='Enter your email' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"facebook"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Facebook link</Typography.Title>}
                        >
                            <Input placeholder='Enter your facebook link' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"twitter"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Twitter link</Typography.Title>}
                        >
                            <Input placeholder='Enter your twitter link' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"linkedin"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Linkedin link</Typography.Title>}
                        >
                            <Input placeholder='Enter your linkedin link' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"shortTitle"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>A short title about yourself</Typography.Title>}
                        >
                            <Input.TextArea placeholder='Enter your short title' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"skill"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Skill</Typography.Title>}
                        >
                            <Input placeholder='Enter your skill' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"description"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Descriptioin</Typography.Title>}
                        >
                            <Editor
                                apiKey='by05nyt9dhljko786tzo81q4vzgsn5hrdjq81e4kb3wi5yyp'
                                init={{
                                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                    placeholder: 'Write something awesome',
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"skill"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Photo (The image size should be any square image)
                            </Typography.Title>}
                        >
                            <Flex align='center' gap={12}>
                                <div className='p-2 border rounded-full'>
                                    <Avatar shape='circle' size={48} src='https://demo.creativeitem.com/academy/uploads/user_image/69eb5987cb0d66bc631f3d545c35cc1d.jpg' />
                                </div>
                                <Upload
                                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                    // fileList={fileList}
                                    >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Flex>
                        </Form.Item>
                        <Form.Item>
                            <Button className='block m-auto bg-[#754FFE]' size='large' type='primary' htmlType='submit'>Update profile</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
            <Col span={8}>
                <div className='shadow-md border bg-white p-8'>
                    <Form
                        form={formPassword}
                        layout='vertical'
                    >
                        <Form.Item
                            name={"currentPassword"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Current password</Typography.Title>}
                        >
                            <Input placeholder='Enter your current password' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"newPassword"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>New password</Typography.Title>}
                        >
                            <Input placeholder='Enter your new password' size='large' />
                        </Form.Item>
                        <Form.Item
                            name={"confirmPassword"}
                            label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Confirm new password</Typography.Title>}
                        >
                            <Input placeholder='Enter your confirm new password' size='large' />
                        </Form.Item>
                        <Form.Item>
                            <Button className='block m-auto bg-[#754FFE]' size='large' type='primary' htmlType='submit'>Update password</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    </section>
  )
}

export default Profile