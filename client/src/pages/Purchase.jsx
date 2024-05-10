import React from 'react'
import Banner from '../components/Banner'
import { Avatar, Button, Col, Flex, Form, Image, Input, Row, Space, Table, Typography, Upload } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, KeyOutlined, LinkedinOutlined, LockOutlined, MailOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import Spring from '../components/Spring';
import { useAPI } from '../hooks/api';
import Loader from "../components/Loader.jsx";
import image from "../assets/image/image.png"
const Purchase = () => {
    const userId = JSON.parse(localStorage.getItem("user")).account._id
    const enrollment = useAPI(`/api/enrollment/${userId}`, null)
    console.log(enrollment)
    if (enrollment.loading) return <Loader />;

    const columns = [
        {
            title: 'Purchased courses',
            dataIndex: 'name',
            key: 'name', 
            render: (_, record) => {
                return (
                    <Flex align='center' gap={8} className='w-[250px]'>
                        <Image 
                            src={image}
                            width={90}
                            height={90}
                            className='object-cover rounded-lg'
                        />
                        <p className='break-words text-base font-semibold w-[150px]'>{record.courseId.title}</p>
                    </Flex>
                )
            },
        },
        {
            title: 'Payment method',
            dataIndex: 'payment',
            key: 'payment',
            render: (_, record) => (
                <h5 className='font-semibold text-base capitalize'>VNpay</h5>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (
                <h5 className='font-bold text-base capitalize'>${record.courseId.price}</h5>
            )
        },
        {
            title: 'Purchased date',
            key: 'date',
            dataIndex: 'date',
            render: (_, record) => (
                <h5 className='font-semibold text-base capitalize'>{record.courseId.date_created}</h5>
            )
        },
        
    ];

    const data = [
        {
            key: 1,
            name: 'John Brown',
            payment: 'paypal',
            price: 12,
            date: '12',
        }
    ]

    return (
        <>
            <Banner name='Purchase history' />
            <section className='max-w-screen-xl m-auto my-12'>
                <Row gutter={12}>
                    <Col span={6}>
                        <Sidenav />
                    </Col>
                    <Col span={18}>
                        <Spring className='bg-white shadow-lg border rounded-lg px-6 py-8'>
                            <Typography.Title level={3}>Purchase history</Typography.Title>
                            <div>
                                <Table columns={columns} dataSource={enrollment.data} />
                            </div>
                        </Spring>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Purchase