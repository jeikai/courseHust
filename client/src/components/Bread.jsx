import { Breadcrumb, Button, Col, ConfigProvider, Flex, Row, Space, Typography } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Bread = ({title, items, label, link}) => {
    const navigate = useNavigate()
    return (
        <Row className='mb-8'>
            <Col span={24}>
                <Flex align='center' justify='space-between'>
                    <ConfigProvider
                        theme={{
                            components: {
                                Breadcrumb: {
                                    /* here is your component tokens */
                                    linkColor: '#754FFE',
                                },
                            },
                            token: {
                                colorBgTextHover: 'bg-transparent',
                            }
                        }}
                    >
                        <Space direction='vertical'>
                            <Typography.Title level={3} style={{ marginBottom: 0 }}>{title}</Typography.Title>
                            <Breadcrumb
                                separator=">"
                                items={items}
                            />
                        </Space>
                    </ConfigProvider>
                    {
                        label &&
                        <Button onClick={() => navigate(link)} className='bg-[#754FFE] text-white font-semibold' size='large'>
                            {label}
                        </Button>
                    }
                </Flex>
            </Col>
        </Row>
    )
}

export default Bread