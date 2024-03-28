import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Flex, Space, Typography } from 'antd'
import React from 'react'

const Card = ({ item, section, openModalEditLesson, handleRemoveLesson }) => {
    return (
        <Flex className='border px-4 p-2 mb-3 bg-[#f1f5f9]' align='center' justify='space-between'>
            <Flex align='center' gap={6}>
                {section?.specialIds?.filter(itemId => itemId.id === item.id && itemId.type === 'lesson') ?
                    <VideoCameraOutlined />
                    :
                    <QuestionCircleOutlined />
                }
                <Typography.Title style={{ marginBottom: 0 }} level={5}>{item.name}</Typography.Title>
            </Flex>
            <Space>
                <EditOutlined onClick={() => openModalEditLesson(item.id)} />
                <DeleteOutlined onClick={() => handleRemoveLesson(item.id)} />
            </Space>
        </Flex>
    )
}

export default Card