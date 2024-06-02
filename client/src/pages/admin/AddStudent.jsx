import React, { Fragment, useState } from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, Col, Dropdown, Flex, Form, Input, List, Progress, Row, Space, Table, Typography, Upload, message } from 'antd'
import { CheckCircleOutlined, CheckOutlined, DollarOutlined, LockOutlined, MoreOutlined, RedditOutlined, UploadOutlined, WifiOutlined } from '@ant-design/icons'
import { Editor } from '@tinymce/tinymce-react'
import Spring from '../../components/Spring'
import { createUser } from '../../api/user'

const AddStudent = () => {
    const [form] = Form.useForm()
    const [current, setCurrent] = useState(0)

    const handleFinish = (data) => {
        console.log(data);
        createUser(data).then(res => {
            if(res) {
                message.success("Create a new student")
            }else {
                // message.error(err.toString());
            }
        }).catch(err => {
            message.error(err.toString());
        })
    }

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Add a new student',
        },
    ]

    const BasicInfo = ({ index }) => (
        <Spring className={`${current === index ? 'block' : 'hidden'}`}>
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
                        name={"photo"}
                        getValueFromEvent={getFile}
                    >
                        <Upload
                            maxCount={1}
                            // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            // fileList={fileList}
                            customRequest={({onSuccess}) => onSuccess("OK")}
                            >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
        </Spring>
    )
    
    const LoginCredentials = ({ index }) => (
        <Spring className={`${current === index ? 'block' : 'hidden'}`}>
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
        </Spring>
    )

    const SocialInfo = ({ index }) => (
        <Spring className={`${current === index ? 'block' : 'hidden'}`}>
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
        </Spring>
    )

    const PaymentInfo = ({ index }) => (
        <Spring className={`${current === index ? 'block' : 'hidden'}`}>
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
        </Spring>
    )

    const Finish = ({ index }) => (
        <Spring className={`${current === index ? 'block' : 'hidden'}`}>
            <Flex align='center' justify='center' vertical gap={12}>
                <CheckOutlined className='text-2xl' />
                <Typography.Title level={5}>Thank you !</Typography.Title>
                <Typography.Text>You are just one click way</Typography.Text>
                <Button className='bg-[#754FFE]' size='large' htmlType='submit' type='primary'>
                    Submit
                </Button>
            </Flex>
        </Spring>
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
        <Spring>
            <Bread title="Add a new student" items={breadcrumb} />
            <div className='shadow-md border bg-white p-8'>
                <Typography.Title level={5}>STUDENT ADD FORM</Typography.Title>
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
                    onFinish={handleFinish}
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
        </Spring>
    )
}

export default AddStudent