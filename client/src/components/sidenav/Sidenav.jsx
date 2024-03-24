import { BarChartOutlined, HeartOutlined, HistoryOutlined, KeyOutlined, SolutionOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Avatar, Col, Flex, Row, Space, Typography } from 'antd'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidenav = () => {
    const location = useLocation()
    console.log(location);
    const links = [
        {
            name: 'My courses',
            icon: SolutionOutlined,
            path: '/home/my_courses'
        },
        {
            name: 'Bootcamp',
            icon: VideoCameraOutlined,
            path: '/home/my_bootcamp'
        },
        {
            name: 'Wishlist',
            icon: HeartOutlined,
            path: '/home/my_whishlist'
        },
        {
            name: 'Affiliate history',
            icon: BarChartOutlined,
            path: '/home/affiliate_course'
        },
        {
            name: 'Purchase history',
            icon: HistoryOutlined,
            path: '/home/purchase_course'
        },
        {
            name: 'Profile',
            icon: UserOutlined,
            path: '/home/user_profile'
        },
        {
            name: 'Account',
            icon: KeyOutlined,
            path: '/home/user_credentials'
        },
    ]
  return (
    <div className='bg-white shadow-lg border'>
        <Row>
            <Col span={24} className='p-4 pt-12'>
                <Flex vertical align='center' justify='center'>
                    <Avatar size={98} shape='circle' src='https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png' className='mb-6' />
                    <Typography.Title level={4}>Signe Thompson</Typography.Title>
                    <Typography.Text>student@example.com</Typography.Text>
                </Flex>
            </Col>
            <Col span={24} className='mt-2 px-5'>
                {links.map((item, index) => {
                    return (
                        <Link to={item.path} key={index} className='block w-full'>
                            <Flex gap={12} className={`${location.pathname.includes(item.path) && 'bg-[#754FFE]'} py-3 px-5 my-2 rounded-md group hover:bg-[#754FFE] duration-500 transition-all ease-out`}>  
                                <item.icon className={`${location.pathname.includes(item.path) && 'text-white'} text-xl group-hover:text-white`} />
                                <p className={`${location.pathname.includes(item.path) && 'text-white'} text-base font-semibold group-hover:text-white`}>{item.name}</p>
                            </Flex>
                        </Link>
                    )
                })}
            </Col>
        </Row>
    </div>
  )
}

export default Sidenav