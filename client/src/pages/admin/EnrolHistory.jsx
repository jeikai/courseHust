import React from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, Dropdown, Flex, Table, Typography } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

const EnrolHistory = () => {
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Enrol history',
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
            date: "Mon, 26 Apr 2015",
        }
    ]
    return (
        <section>
            <Bread title="Enrol history" items={breadcrumb} />
            <div className='shadow-md border bg-white p-8'>
                <Table size='large' dataSource={data} pagination={true}>
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
                        title="User name"
                        render={(_, record) => {
                            return (
                                <Flex vertical>
                                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                                        {record.name}
                                    </Typography.Title>
                                    <p>Email: {record.email}</p>
                                </Flex>
                            )
                        }}
                    />
                    <Table.Column
                        // width={180}
                        title="Enrrollment date"
                        render={(_, record) => {
                            return (
                                <Flex vertical className='text-[#98a6ad] text-md'>
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

export default EnrolHistory