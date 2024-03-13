import { SettingOutlined } from '@ant-design/icons';
import { Checkbox, Col, Collapse, Divider, Flex, Row, Space, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'
import Video from '../components/Video';
import Quiz from '../components/Quiz';
import Questions from '../components/Questions';

const Lesson = () => {
    return (
        <div className='py-16 px-4'>
            <Row gutter={24}>
                <Col span={8} push={16} className='py-2 shadow-lg h-fit'>
                    <Typography.Title level={4} className='text-center'>Course content</Typography.Title>
                    <Collapse ghost expandIconPosition={'end'}>
                        <Collapse.Panel
                            header={
                                <Typography.Title className='w-full hover:text-[#754FFE]' level={5}>
                                    Introduction to Web Development
                                </Typography.Title>
                            }
                            key="1"
                        >
                            <Space direction='vertical' className='w-full'>
                                <Flex align='center' gap={12} className='px-3 py-2 rounded-md'>
                                    <Checkbox />
                                    <Link className='flex-1 group'>
                                        <Flex justify='space-between'>
                                            <Flex vertical>
                                                    <p className='font-semibold text-base group-hover:text-[#754FFE]'>HTML Foundations</p>
                                                    <span className='text-[#6c757d]'>Jan-04-2024</span>
                                            </Flex>
                                            <p className='text-[#6c757d] text-base font-medium'>00:11:22</p>
                                        </Flex>
                                    </Link>
                                </Flex>
                                <Divider type="horizontal" />
                            </Space>
                        </Collapse.Panel>
                    </Collapse>
                </Col>
                <Col span={16} pull={8}>
                    <div className='mb-4 mt-2'>
                        {/* <Video /> */}
                        {/* <Quiz /> */}
                        <Questions />
                    </div>   
                </Col>

            </Row>
        </div>
    )
}

export default Lesson