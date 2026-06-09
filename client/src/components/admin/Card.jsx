import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flex, Space, Typography } from 'antd'
import React from 'react'

const Card = ({ item, section, openModalEditLesson, handleRemoveLesson }) => {
    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: item.id,
        data: {...item}
    });
      
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <Flex
                
                className='border px-4 p-2 mb-3 bg-[#f1f5f9]' align='center' justify='space-between'>
                <Flex align='center' gap={6}>
                    {section?.specialIds?.filter(itemId => itemId.id === item.id && itemId.type === 'lesson') ?
                        <VideoCameraOutlined />
                        :
                        <QuestionCircleOutlined />
                    }
                    <Typography.Title style={{ marginBottom: 0 }} level={5}>{item.title}</Typography.Title>
                </Flex>
                <Space>
                    <EditOutlined onClick={() => openModalEditLesson(item.id)} />
                    <DeleteOutlined onClick={() => handleRemoveLesson(item.id)} />
                </Space>
            </Flex>
        </div>
    )
}

export default Card