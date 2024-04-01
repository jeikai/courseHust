import { ConfigProvider, Radio, Space, Typography } from 'antd'
import React from 'react'

const Question = ({question}) => {
    return (
        <Space direction='vertical w-full'>
            <p className='mt-8'>Question 1</p>
            <Typography.Title level={3}>React is mainly used for building ___.</Typography.Title>
            <ConfigProvider
                theme={{
                    components: {
                        Radio: {
                            radioSize: 20,
                            dotSize: 10,
                        },
                    },
                }}
            >
                {question.type === 'scq' &&
                    <Radio.Group className='w-full' size='large'>
                        <Space direction="vertical" size={12} className='w-full'>
                            {question?.options.map((option, index) => {
                                console.log(option);
                                return (
                                    <Radio value={index} checked={option?.isSelected === true} className='w-full border p-4 rounded-md'>{option.label}</Radio>
                                )
                            })}
                        </Space>
                    </Radio.Group>
                }
            </ConfigProvider>
        </Space>
    )
}

export default Question