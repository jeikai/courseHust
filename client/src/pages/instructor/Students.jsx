import React, { useEffect, useState } from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, ConfigProvider, Dropdown, Flex, Input, List, Popconfirm, Table, Typography, message } from 'antd'
import { MoreOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { deleteUser, getUsers } from '../../api/user'
import { filterArray } from '../../helpers'
import Spring from '../../components/Spring'

const Students = () => {
    const [student, setStudent] = useState([]);
    const [filterStudent, setFilterStudent] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUsers().then((user) => {
            console.log(user)
            setStudent(user)
        })
    }, [])

    useEffect(() => {
        setFilterStudent([...student])
        console.log("filterChange");
        console.log(student);
        console.log(filterStudent);
    }, [student])

    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Student',
        },
    ]


    const confirm = (id) => {
        deleteUser(id).then(res => {
            if(res === true) {
                let newStudents = filterStudent
                let index = newStudents.findIndex(student => student.id === id)
                newStudents.splice(index, 1)
                setFilterStudent([...newStudents])
                message.success('Delete student successfully');
            }
        }).catch(err => {
            message.error(err.toString());
        })
    };
    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };
    const action = [
        {
            label: (
                <Link to={'/'} >
                    Edit
                </Link>
            ),
            key: '0',
        },
        {
            label: (
                <Popconfirm
                    title="Delete the user"
                    description="Are you sure to delete this user?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText={<div className='text-black' >Yes</div>}
                    cancelText="No"
                >
                    Delete
                </Popconfirm>
            ),
            key: '1',
        },
    ];
    let debounceTimeout;

    const handleSearch = (e) => {
        clearTimeout(debounceTimeout);
        setLoading(true);
        debounceTimeout = setTimeout(() => {
            // Gọi hàm tìm kiếm sau thời gian debounce

            setFilterStudent(filterArray(student, e.target.value))

            setLoading(false);

        }, 500); // Thời gian debounce là 500ms
    }

    return (
        <section>
            <Bread title="Student" items={breadcrumb} label={"Add new student"} link={"/admin/add_student"} />
            <div className='shadow-md border bg-white p-8'>
                <div className='text-right mb-4'>
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
                        <Input onChange={handleSearch} size="large" placeholder="Search" prefix={<SearchOutlined />} />
                    </ConfigProvider>
                </div>
                <Spring>
                    <Table size='large' dataSource={filterStudent} pagination={true}
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
                        loading={loading}
                    >
                        <Table.Column
                            width={100}
                            title="Photo"
                            dataIndex={"photo"}
                            key={"photo"}
                            render={(_, record) => {
                                return (
                                    <div>
                                        <Avatar size={48} shape='circle' src={record.photo.url} />
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
                                        {record.firstName + ' ' + record.lastName}
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
                                        <p>{record.date.toString()}</p>
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
                                            items: [
                                                {
                                                    label: (
                                                        <Link to={`/admin/edit_student/${record.id}`} >
                                                            Edit
                                                        </Link>
                                                    ),
                                                    key: '0',
                                                },
                                                {
                                                    label: (
                                                        <Popconfirm
                                                            title="Delete the user"
                                                            description="Are you sure to delete this user?"
                                                            onConfirm={() => confirm(record.id)}
                                                            onCancel={cancel}
                                                            okText={<div className='text-black' >Yes</div>}
                                                            cancelText="No"
                                                        >
                                                            Delete
                                                        </Popconfirm>
                                                    ),
                                                    key: '1',
                                                },
                                            ],
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
                </Spring>
            </div>
        </section>
    )
}

export default Students