import { Button, Col, ConfigProvider, Flex, Image, Row, Space, Typography } from 'antd'
import bgverify from '../../assets/verify.png'
const Verify = () => {
    return (
        <Row className='w-screen h-screen'>
            <Col span={16}>
                <img
                    src={bgverify}
                    className='w-full h-screen object-cover'
                />
            </Col>
            <Col span={8}>
                <Flex align='center' justify='center' className='h-screen'>
                    <Space direction='vertical' className='w-2/3'>
                        <Typography.Title level={2}>Verify your email</Typography.Title>
                        <Typography.Text style={{ fontSize: '20px', color: '#89868d' }}>
                            Account activation link sent to your email address: hello@example.com Please follow the link inside to continue.
                        </Typography.Text>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        contentFontSize	: '20px',
                                        /* here is your component tokens */
                                    },
                                },
                            }}
                        >
                            <Button className='bg-purple-500 font-semibold w-full my-4' type="primary" size='large'>SKIP FOR NOW</Button>
                            <Typography.Text style={{ fontSize: '20px', color: '#89868d', display: 'block', textAlign: 'center' }}>
                                Didn't get the mail? 
                                <Button type="link" className='ml-2 text-purple-500'>
                                    Resend
                                </Button>
                            </Typography.Text>
                        </ConfigProvider>
                    </Space>
                </Flex>
            </Col>
        </Row>
    )
}

export default Verify