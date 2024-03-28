import React from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, Dropdown, Flex, Input, List, Table, Typography } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

const Instructors = () => {
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Instructor',
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
  return (
    <section>
        <Bread title="Instructor" items={breadcrumb} label={"Add new instructor"} link={"/admin/add_instructor"} />
        <div className='shadow-md border bg-white p-8'>
            <div className='text-right mb-4'>
                <Input.Search placeholder="Search" style={{ width: 200 }} />
            </div>
            <Table size='large' dataSource={data} pagination={true}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <List
                                className='px-4'
                                bordered
                                dataSource={record.courses}
                                renderItem={(item) => (
                                    <List.Item>
                                      <Typography.Text>{item}</Typography.Text>
                                    </List.Item>
                                )}
                            />
                        )
                    },
                }}
            >
                    <Table.Column
                        width={80}
                        sorter={{
                            compare: (a, b) => a.id - b.id,
                        }}
                        title="#"
                        dataIndex={"id"}
                        key={"id"}
                        render={(_, record) => {
                            return (
                                <>
                                    {record.id}
                                </>
                            )
                        }}
                    />
                    <Table.Column
                        width={100}
                        title="Photo"
                        dataIndex={"photo"}
                        key={"photo"}
                        render={(_, record) => {
                            return (
                                <div>
                                    <Avatar size={48} shape='circle' src={record.photo} />
                                </div>
                            )
                        }}
                    />
                    <Table.Column
                        // width={150}
                        title="Name"
                        render={(_, record) => {
                            return (
                                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                                    {record.name}
                                </Typography.Title>
                            )
                        }}
                    />
                    <Table.Column
                        // width={150}
                        title="Email"
                        render={(_, record) => {
                            return (
                                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                                    {record.email}
                                </Typography.Title>
                            )
                        }}
                    />
                     <Table.Column
                        // width={150}
                        title="Phone"
                        dataIndex={"phone"}
                        key={"phone"}
                        render={(_, record) => {
                            return (
                                <Flex vertical className=' text-base'>
                                    <p>{record.phone}</p>
                                </Flex>
                            )
                        }}
                    />
                    <Table.Column
                        // width={180}
                        title="Enrrollment date"
                        render={(_, record) => {
                            return (
                                <Flex vertical className='text-md'>
                                    <p>{record.date}</p>
                                </Flex>
                            )
                        }}
                    />
                    <Table.Column
                        title="Action"
                        key={"action"}
                        render={(_, record) => {
                            return (
                                <Dropdown
                                    menu={{
                                        items: action,
                                    }}
                                >
                                    <Button
                                        icon={<MoreOutlined />}
                                    />
                                </Dropdown>
                            )
                        }}
                    />
                </Table>
        </div>
    </section>
  )
}

export default Instructors