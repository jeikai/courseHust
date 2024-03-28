import React from 'react'
import Bread from '../../components/Bread'
import { Button, ConfigProvider, Flex, Form, Select, Typography } from 'antd'

const Enrollments = () => {
    const [form] = Form.useForm();

    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Enrollment',
        },
    ]

    const optionStudent = [];

    for (let i = 10; i < 36; i++) {
        optionStudent.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }

    const optionCourse = [
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'tom',
            label: 'Tom',
        },
    ]

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <section>
            <Bread title="Course enrollment" items={breadcrumb} />
            <div className='shadow-md border bg-white p-8 w-2/3 m-auto'>
                <Typography.Title level={4}>ENROLMENT FORM</Typography.Title>
                <Form
                    form={form}
                    onFinish={(data) => console.log(data)}
                    layout='vertical'
                >
                    <Form.Item
                        name={"name"}
                        label={<Typography.Title level={5}>Student name</Typography.Title>}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{
                                width: '100%',
                            }}
                            placeholder="Please select"
                            options={optionStudent}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"course"}
                        label={<Typography.Title level={5}>Course to enrol</Typography.Title>}
                    >
                        <Select
                            showSearch
                            placeholder="Select a course"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={optionCourse}
                        />
                    </Form.Item>
                    <Form.Item>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultBorderColor: '#754FFE',
                                        defaultHoverColor: 'white',
                                        defaultHoverBorderColor: '#754FFE',
                                        defaultHoverBg: '#754FFE'
                                    }
                                }
                            }}
                        >
                            <Button className='bg-[#754FFE]' type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </ConfigProvider>
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}

export default Enrollments