import breadcramb from '../assets/course-breadcramb.png'
import book from '../assets/brd-book.png'
import vnpaylogo from '../assets/vnpay.jpg'
import qrcode from '../assets/qrcode.png'
import { Breadcrumb, Button, Col, Flex, Form, Image, Input, Row, Space, Table, Typography } from 'antd'
import { DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import { useState } from 'react'
const Cart = () => {

    const [payment, setPayment] = useState(true)

    const handleRemoveCartItem = (id) => {
        console.log(id);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                return (
                    <Flex gap={12}>
                        <Image
                            width={100}
                            src={record.image}
                        />
                        <Space direction='vertical'>
                            <Typography.Title level={5}>{record.name}</Typography.Title>
                            <Typography.Text>{record.description}</Typography.Text>
                        </Space>
                    </Flex>
                )
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => <p className='text-base'>{record.price}</p>
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (_, record) => {
                console.log(record);
                return (
                    <DeleteOutlined onClick={() => handleRemoveCartItem(record.key)} className='text-2xl cursor-pointer hover:text-purple-500' />
                )
            },
        },
    ];

    const data = [
        {
            key: 1,
            name: 'John Brown',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
            description: 'lorem ipsum dolor sit',
            price: 32,
        },
        {
            key: 2,
            name: 'Jim Green',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
            description: 'lorem ipsum dolor sit',
            price: 42,
        },
        {
            key: 3,
            name: 'Not Expandable',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
            description: 'lorem ipsum dolor sit',
            price: 29,
        },
        {
            key: 4,
            name: 'Joe Black',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
            description: 'lorem ipsum dolor sit',
            price: 32,
        },
        {
            key: 5,
            name: 'Joe Black',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
            description: 'lorem ipsum dolor sit',
            price: 32,
        },
    ];

    return (
        <>
            <section style={{ backgroundImage: `url(${breadcramb})` }} className="my-6">
                <Row className="max-w-screen-xl m-auto">
                    <Col span={18} className="flex items-center">
                        <Space direction="vertical">
                            <Breadcrumb className="z-10 text-2xl"
                                items={[
                                    {
                                        href: '',
                                        title: <>
                                            <HomeOutlined style={{ fontSize: '24px', color: 'white' }} />
                                            <span className="text-white">Home</span>
                                        </>,
                                    },
                                    {
                                        title: <span className="text-white">Shopping cart</span>,
                                    },
                                ]}
                            />
                            <Typography.Title level={1} style={{ color: 'white', marginTop: '12px' }}>
                                Shopping cart
                            </Typography.Title>
                        </Space>
                    </Col>
                    <Col span={6}>
                        <img src={book} alt="book" className="w-[212px] h-[212px]" />
                    </Col>
                </Row>
            </section>
            <section className="max-w-screen-xl m-auto">
                <Row gutter='24px' className='divide-x-2'>
                    <Col span={12} className='p-4 shadow-lg'>
                        <Typography.Title level={2}>Summary</Typography.Title>
                        <div>
                            <Table style={{ width: '100%' }}
                                size='large'
                                columns={columns}
                                dataSource={data}
                                pagination={{
                                    pageSize: 4,
                                }}
                                // scroll={{
                                //     y: 500,
                                // }}
                                summary={() => {
                                    const totalPrice = data.reduce((accumulator, item) => accumulator + item.price, 0);
                                    return (
                                        <Table.Summary fixed>
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0}>
                                                    <Typography.Title level={5}>Total</Typography.Title>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>{totalPrice}</Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                    )
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={12} className='p-4 shadow-lg'>
                        <Typography.Title level={2}>Checkout</Typography.Title>
                        <Typography.Title level={5}>Card Type</Typography.Title>
                        <Row gutter={24} className='mt-8'>
                            <Col span={12}>
                                <Image
                                    onClick={() => setPayment(!payment)}
                                    className={`border ${payment ? 'border-purple-500' : 'border-blue-300 '} cursor-pointer hover:border-purple-500 rounded-md p-2`}
                                    height={150}
                                    src={vnpaylogo}
                                    preview={false}
                                />
                            </Col>
                            <Col span={12}>
                                <Image
                                    onClick={() => setPayment(!payment)}
                                    className={`border ${!payment ? 'border-purple-500 ' : 'border-blue-300 '} cursor-pointer hover:border-purple-500 rounded-md p-2`}
                                    height={150}
                                    src={qrcode}
                                    preview={false}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-8'>
                            <Form
                                className='w-full'
                                layout="vertical"
                            >
                                <Form.Item
                                    label={<Typography.Title level={5}>Name on card</Typography.Title>}
                                    name="name"
                                    rules={[
                                    {
                                        required: true,
                                    },
                                    ]}
                                >
                                    <Input placeholder='Enter name on card' size='large' />
                                </Form.Item>
                                <Form.Item
                                    label={<Typography.Title level={5}>Card number</Typography.Title>}
                                    name="card"
                                    rules={[
                                    {
                                        required: true,
                                    },
                                    ]}
                                >
                                    <Input placeholder='Enter card number' size='large' />
                                </Form.Item>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<Typography.Title level={5}>Expiration Date ( MM/YY )</Typography.Title>}
                                            name="date"
                                            rules={[
                                            {
                                                required: true,
                                            },
                                            ]}
                                        >
                                            <Input placeholder='Enter Expiration Date' size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<Typography.Title level={5}>CVC</Typography.Title>}
                                            name="cvc"
                                            rules={[
                                            {
                                                required: true,
                                            },
                                            ]}
                                        >
                                            <Input placeholder='Enter CVC' size='large' />
                                        </Form.Item>
                                    </Col>
                                    <Form.Item className='w-full'>
                                            <Button type="primary" className='bg-purple-500 w-full' htmlType="submit" size='large'>
                                            Submit
                                            </Button>
                                    </Form.Item>
                                </Row>
                            </Form>
                        </Row>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Cart