import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Divider, Flex, Progress, Radio, Space, Typography } from 'antd'
import React from 'react'

const Questions = () => {
  return (
    <div className='p-8 shadow-lg text-base'>
      <Flex align='center' justify='space-between'>
        <Typography.Title level={3}>React Basic Quiz</Typography.Title>
        <Flex align='center' justify='center' gap={6} className='text-red-500'>
          <ClockCircleOutlined />
          <p>00:05:55</p>
        </Flex>
      </Flex>
      <Divider />
      <Flex align='center' justify='space-between' className='mb-2'>
        <p>Exam process: </p>
        <p>Question 1 out of 5 </p>
      </Flex>
      <Progress percent={30} />
      {/* <Question /> */}
      <Flex justify='flex-end'>
        <Button className='bg-[#754FFE] text-white mt-4 px-8' size='large'>Next</Button>
      </Flex>
    </div>
  )
}

export default Questions