import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Divider, Flex, Progress, Radio, Space, Typography } from 'antd'
import React from 'react'

const Question = () => {
  return (
    <Space direction='vertical w-full'>
      <p className='mt-8'>Question 1</p>
      <Typography.Title level={3}>React is mainly used for building ___.</Typography.Title>
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              radioSize	: 20,
              dotSize: 10,
            },
          },
        }}
      >
        <Radio.Group className='w-full' size='large'>
          <Space direction="vertical" size={12} className='w-full'>
            <Radio value={1} className='w-full border p-4 rounded-md'>Option A</Radio>
            <Radio value={2} className='w-full border p-4 rounded-md'>Option B</Radio>
            <Radio value={3} className='w-full border p-4 rounded-md'>Option C</Radio>
            <Radio value={4} className='w-full border p-4 rounded-md'>Option D</Radio>
          </Space>
        </Radio.Group>
      </ConfigProvider>
    </Space>
  )
}

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
      <Question />
      <Flex justify='flex-end'>
        <Button className='bg-[#754FFE] text-white mt-4 px-8' size='large'>Next</Button>
      </Flex>
    </div>
  )
}

export default Questions