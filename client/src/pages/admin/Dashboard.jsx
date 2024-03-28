import React, { useState } from 'react'
import Bread from '../../components/Bread'
import { Button, ConfigProvider, Dropdown, Flex, Input, Row, Table } from 'antd'
import { MoreOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Application Center',
        },
    ]
    const data = [
        {
            key: 1,
            id: 1,
            title: 'WordPress Theme Development with Bootstrap',
            instructor: 'Mathew Anderson',
            category: 'WordPress Theme',
            section: 12,
            lesson: 13,
            enrollment: 1,
            status: 'Approved',
            price: 12.000
        },
        {
            key: 2,
            id: 2,
            title: 'WordPress Theme Development with Bootstrap',
            instructor: 'Mathew Anderson',
            category: 'WordPress Theme',
            section: 12,
            lesson: 13,
            enrollment: 1,
            status: 'pending',
            price: 12.000
        }
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
    const [type, setType] = useState('all')
    return (
        <section>
            <Bread title="Courses" items={breadcrumb} label={"Add new courses"} link={'/'} />
            <div className='shadow-md border bg-white'>
                <div className='mb-4'>
                    <Flex align="center" className='border-b'>
                        <div onClick={() => setType('all')} className={`mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 ${type === 'all' && 'border-b-[#754FFE] '} cursor-pointer hover:text-[#754FFE] ease-out duration-500`}>All</div>
                        <div onClick={() => setType('approved')} className={`mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 ${type === 'approved' && 'border-b-[#754FFE] '} cursor-pointer hover:text-[#754FFE] ease-out duration-500`}>Approved</div>
                        <div onClick={() => setType('pending')} className={`mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 ${type === 'pending' && 'border-b-[#754FFE] '} cursor-pointer hover:text-[#754FFE] ease-out duration-500`}>Pending</div>
                    </Flex>
                </div>
                <div className='my-8 mx-4'>
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    /* here is your component tokens */
                                    activeBorderColor: '#775FFE',
                                    hoverBorderColor: '#775FFE'
                                },
                            },
                        }}
                    >
                        <Input size="large" placeholder="Search" prefix={<SearchOutlined />} />
                    </ConfigProvider>
                </div>
                <div>
                    <Table size='large' dataSource={data}  pagination={true}>
                            <Table.Column
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
                                width={550}
                                title="Title"
                                dataIndex={"title"}
                                key={"title"}
                                render={(_, record) => {
                                    return (
                                        <Flex vertical>
                                            <Link className='font-semibold text-[#775FFE] text-line-1 w-[99%] block'>
                                                {record.title}
                                            </Link>
                                            <span className='text-[#98a6ad]'>Instructor: <strong>{record.instructor}</strong></span>
                                        </Flex>
                                    )
                                }}
                            />
                            <Table.Column
                                // width={150}
                                title="Category"
                                dataIndex={"category"}
                                key={"category"}
                                render={(_, record) => {
                                    return (
                                        <p className='text-xs font-semibold bg-[#313a462e] w-fit p-1 rounded-lg shadow-md'>{record.category}</p>
                                    )
                                }}
                            />
                            <Table.Column
                                // width={180}
                                title="Lesson and section"
                                key={"curriculum"}
                                render={(_, record) => {
                                    return (
                                        <Flex vertical className='text-[#98a6ad] text-md'>
                                            <p><span className='font-semibold'>Section</span>: {record.section}</p>
                                            <p><span className='font-semibold'>Lesson</span>: {record.lesson}</p>
                                        </Flex>
                                    )
                                }}
                            />
                            <Table.Column
                                // width={150}
                                title="Enrolled student"
                                dataIndex={"enrollment"}
                                key={"enrollment"}
                                render={(_, record) => {
                                    return (
                                        <p className='text-[#98a6ad] text-md'>
                                            <span className='font-semibold'>Enrollments: </span>
                                            {record.enrollment}
                                        </p>
                                    )
                                }}
                            />
                            <Table.Column
                                // width={120}
                                title="Status"
                                dataIndex={"status"}
                                key={"status"}
                                render={(_, record) => {
                                    return (
                                        <>
                                            <span className={`mx-1 rounded-full inline-block h-2 w-2 ${record.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                            <span className='capitalize text-sm font-semibold'>{record.status}</span>
                                        </>
                                    );
                                }}
                            />
                            <Table.Column
                                title="Price"
                                dataIndex={"price"}
                                key={"price"}
                                render={(_, record) => {
                                    return (
                                        <p className='text-md font-bold bg-[#313a462e] w-fit p-1 rounded-lg shadow-md'>{record.price * 10000000} <sup>đ</sup></p>
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
            </div>
        </section>
    )
}

export default Dashboard