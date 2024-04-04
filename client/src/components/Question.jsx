import { ConfigProvider, Radio, Space, Typography } from 'antd'
import React from 'react'

const Question = ({question}) => {
    return (
        <Space direction='vertical w-full'>
            <Typography.Title level={3}>{question.title}</Typography.Title>
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
                                    <Radio value={index} defaultChecked={option?.isSelected === true ? true : false} className='w-full border p-4 rounded-md'>{option.label}</Radio>
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