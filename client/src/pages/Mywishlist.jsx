import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import { Avatar, Button, Col, Collapse, Divider, Flex, Form, Image, Input, Row, Space, Table, Typography, Upload } from 'antd';
import Sidenav from '../components/sidenav/Sidenav';
import { Editor } from '@tinymce/tinymce-react';
import { FacebookOutlined, KeyOutlined, LinkedinOutlined, LockOutlined, MailOutlined, SettingOutlined, TwitterOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Course from '../components/Course';
import Spring from '../components/Spring';
import axios from 'axios'; // Ensure axios is installed and imported

const Mywishlist = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const userId = JSON.parse(localStorage.getItem("user")).account._id;

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/api/favorite/${userId}`);
                setFavorites(response.data); // Assuming the data is the array of courses
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
            }
        };

        fetchFavorites();
    }, [userId]);

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
                            <Row gutter={[12, 24]}>
                                {favorites.map((item, index) => (
                                    <Col span={8} key={item.id}> {/* Make sure your items have a unique identifier */}
                                        <Spring index={index}>
                                            <Course course={item?.courseId} /> {/* Passing course details as props */}
                                        </Spring>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Col>
                </Row>
            </section>
        </>
    );
}

export default Mywishlist;
