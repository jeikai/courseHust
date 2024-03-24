import React from 'react'
import breadcramb from '../assets/course-breadcramb.png'
import book from '../assets/brd-book.png'
import { Breadcrumb, Col, Row, Space, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
const Banner = (props) => {
  return (
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
                            title: <span className="text-white">{props.name}</span>,
                        },
                    ]}
                />
                <Typography.Title level={1} style={{ color: 'white', marginTop: '12px' }}>
                    {props.name}
                </Typography.Title>
            </Space>
        </Col>
        <Col span={6}>
            <img src={book} alt="book" className="w-[212px] h-[212px]" />
        </Col>
    </Row>
</section>
  )
}

export default Banner