import React, { Fragment, useState } from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, Col, Dropdown, Flex, Form, Input, List, Progress, Row, Space, Table, Typography, Upload } from 'antd'
import { CheckCircleOutlined, CheckOutlined, DollarOutlined, LockOutlined, MoreOutlined, RedditOutlined, UploadOutlined, WifiOutlined } from '@ant-design/icons'
import { Editor } from '@tinymce/tinymce-react'

const AddInstructor = () => {
    const [form] = Form.useForm()
    const [current, setCurrent] = useState(0)

    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Add a new instructor',
        },
    ]
    const action = [
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
            key: '0',
        },
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item（disabled）',
            key: '3',
            disabled: true,
        },
    ];
    const data = [
        {
            id: 1,
            photo: "https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png",
            name: "Signe Thompson",
            email: "demo@creativeitem.com",
            phone: "0982193203",
            date: "Mon, 26 Apr 2015",
            courses: [
                'course 1', 'course 2', 'course 3', 'course 4', 'course 5',
            ]
        }
    ]

    const BasicInfo = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Row>
                <Col span={6}>
                    <Typography.Title level={5}>First name</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"firstName"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Last name</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"lastName"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Description</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"description"}
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
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Phone</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"phone"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>User image</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"file"}
                    >
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            // fileList={fileList}
                            >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
    
    const LoginCredentials = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Row>
                <Col span={6}>
                    <Typography.Title level={5}>Email</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"email"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Password</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"password"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )

    const SocialInfo = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Row>
                <Col span={6}>
                    <Typography.Title level={5}>Facebook</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"facebook"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Twitter</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"twitter"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Linkedin</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"linkedin"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )

    const PaymentInfo = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Typography.Title level={3}>Vnpay</Typography.Title>
            <Row>
                <Col span={6}>
                    <Typography.Title level={5}>Key id</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"key"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Secret key</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"secretKey"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Typography.Title level={5}>Public Key</Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item
                        name={"publicKey"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )

    const Finish = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Flex align='center' justify='center' vertical gap={12}>
                <CheckOutlined className='text-2xl' />
                <Typography.Title level={5}>Thank you !</Typography.Title>
                <Typography.Text>You are just one click way</Typography.Text>
                <Button className='bg-[#754FFE]' size='large' htmlType='submit' type='primary'>
                    Submit
                </Button>
            </Flex>
        </div>
    )

    const steps = [
        {
            label: "Basic info",
            icon: <RedditOutlined />,
            page: <BasicInfo index={0} />
        },
        {
            label: "Login credentials",
            icon: <LockOutlined />,
            page: <LoginCredentials index={1} />
        },
        {
            label: "Social information",
            icon: <WifiOutlined />,
            page: <SocialInfo index={2} />
        },
        {
            label: "Payment information",
            icon: <DollarOutlined />,
            page: <PaymentInfo index={3} />
        },
        {
            label: "Finish",
            icon: <CheckCircleOutlined />,
            page: <Finish index={4} />
        },
    ]

    return (
        <section>
            <Bread title="Add a new instructor" items={breadcrumb} />
            <div className='shadow-md border bg-white p-8'>
                <Typography.Title level={5}>INSTRUCTOR ADD FORM</Typography.Title>
                <Flex className='mb-4'>
                    {steps.map((step, index) => {
                        return (
                            <Flex key={index} gap={8} flex={1} align='center' justify='center' 
                                className={`${current === index ? 'bg-[#754FFE] text-white' : 'bg-[#e3eaef]'} text-base py-4 font-semibold cursor-pointer ease-in-out duration-300`}
                                onClick={() => setCurrent(index)}
                            >
                                {step.icon}
                                <span>{step.label}</span>
                            </Flex>
                        )
                    })}
                </Flex>
                <Progress percent={(current + 1) / steps.length * 100} showInfo={false} size="small" />
                <Form
                    form={form}
                    onFinish={(data) => console.log(data)}
                >
                    <div className='mt-4'>
                        {steps.map((step, index) => {
                            return (
                                <Fragment key={index}>
                                    {step.page}
                                </Fragment>
                            )
                        })}
                    </div>
                    <Flex align='center' justify='space-between'>
                        { 
                            current > 0 ?
                            <Button onClick={() => setCurrent(prev => prev - 1)} size='large'>Prev</Button> :
                            <Button disabled size='large'>Prev</Button>
                        }
                        {
                            current < steps.length - 1 ?
                            <Button onClick={() => setCurrent(prev => prev + 1)} size='large'>Next</Button> :
                            <Button disabled size='large'>Next</Button>
                        }
                    </Flex>
                </Form>
            </div>
        </section>
    )
}

export default AddInstructor