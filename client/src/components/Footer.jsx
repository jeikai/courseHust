import React from 'react'
import logo from '../assets/logo-white.png'
import { Col, Flex, Input, List, Row, Typography } from 'antd'
const Footer = () => {
  return (
    <footer className='bg-black'>
        <div className="container max-w-screen-xl w-full mx-auto py-12 text-[#ffffffa4]">
            <Row>
                <Col span={10}>
                    <div className='logo w-[177px] h-[44px] mb-24'>
                        <img src={logo} alt="logo" className='w-full h-full' />
                    </div>
                    <p>Study any topic, anytime. explore thousands of <br /> courses for the lowest price ever!</p>
                </Col>
                <Col span={4}>
                    <List size='small'>
                        <List.Item>
                            <Typography.Text className='text-white font-semibold text-xl'>Top categories</Typography.Text>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                    </List>
                </Col>
                <Col span={6}>
                    <List size='small'>
                        <List.Item>
                            <Typography.Text className='text-white font-semibold text-xl'>
                                Useful links
                            </Typography.Text>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                    </List>
                </Col>
                <Col span={4}>
                    <List size='small'>
                        <List.Item>
                            <Typography.Text className='text-white font-semibold text-xl'>Help</Typography.Text>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                        <List.Item>
                            <a href="#" className='text-[#ffffffa4]'>HTML & CSS</a>
                        </List.Item>
                    </List>
                </Col>
            </Row>
            <Row>
                <Flex vertical gap={12}>
                    <Typography.Text className='font-semibold text-2xl text-white'>
                        Subscribe to our newsletter
                    </Typography.Text>
                    <Input.Search className='bg-white' size='large' placeholder="input search text" style={{ width: 400 }} />
                </Flex>
            </Row>
        </div>
    </footer>
  )
}

export default Footer