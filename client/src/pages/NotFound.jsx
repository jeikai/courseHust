import React from 'react'
import error from '../assets/errorpage.png'
import { Button, Col, Flex, Image, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
const NotFound = () => {
  const navigate = useNavigate()
  return (
    <section className='max-w-screen-xl m-auto my-12'>
      <Row gutter={12}>
        <Col span={12} className='text-right'>
          <Image
            style={{ width: '100%', height: '100%', display: 'block' }}
            src={error}
            loading='lazy'
            preview={false}
          />
        </Col>
        <Col span={12}>
            <Flex vertical gap={18} justify='center' className='h-full'>
              <Typography.Title level={2}>404 not found</Typography.Title>
              <Typography.Text>
                The page you requested could not be found
              </Typography.Text>
              <Typography.Text>
                Please try the following:
              </Typography.Text>
              <Typography.Text>
                Check the spelling of the url <br />
                If you are still puzzled, click on the home link below
              </Typography.Text>
              <Button onClick={() => navigate('/')} className='w-fit bg-[#754FFE] text-white' size='large'>
                Back to home
              </Button>
            </Flex>
        </Col>
      </Row>
    </section>
  )
}

export default NotFound