import Banner from '../components/Banner'
import { Avatar, Button, Col, Collapse, Divider, Flex, Form, Image, Input, Row, Space, Table, Typography, Upload } from 'antd'
import Sidenav from '../components/sidenav/Sidenav'
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, KeyOutlined, LinkedinOutlined, LockOutlined, MailOutlined, SettingOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Course from '../components/Course';
const Mywishlist = () => {
    const navaigate = useNavigate()
    return (
        <>
            <Banner name='My wishlist' />
            <section className='max-w-screen-xl m-auto my-12'>
                <Row gutter={12}>
                    <Col span={6}>
                        <Sidenav />
                    </Col>
                    <Col span={18}>
                        <div className='bg-white shadow-lg border rounded-lg px-6 py-8'>
                            <Typography.Title level={3}>Wish list</Typography.Title>
                            <Row gutter={[12,24]}>
                                <Col span={8}>
                                    <Course />
                                </Col>
                                <Col span={8}>
                                    <Course />
                                </Col>
                                <Col span={8}>
                                    <Course />
                                </Col>
                                <Col span={8}>
                                    <Course />
                                </Col>
                                <Col span={8}>
                                    <Course />
                                </Col>
                                <Col span={8}>
                                    <Course />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default Mywishlist