import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Flex, Form, Input, Space, Typography, Upload } from 'antd'
import React, { useRef } from 'react'
import Card from './Card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const RowSection = ({ section, openModalEditSection, handleRemoveSection, openModalEditLesson, handleRemoveLesson, formLesson, setOpenInputLesson, someoneIsDragging }) => {
    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: section.id});
      
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const ref  = useRef()
    return (
        <div key={section.id} ref={setNodeRef} style={style} {...attributes} {...listeners} className="border border-[#e2e8f0] item rounded text-nowrap bg-white text-[#64748b] p-4">
            <div>
                <Flex align='center' justify='space-between' className='mb-4'>
                    <Typography.Title level={5}>{section.sectionName}</Typography.Title>
                    <Space className='text-base'>
                        <EditOutlined
                            onClick={() => openModalEditSection(section.id)}
                        />
                        <DeleteOutlined
                            onClick={() => handleRemoveSection(section.id)}
                        />
                    </Space>
                </Flex>
                {section?.specials?.map((item) => {
                    return (
                        <Card item={item} section={section} openModalEditLesson={openModalEditLesson} handleRemoveLesson={handleRemoveLesson} />
                    )
                })}

            </div>
            <Space>
                <Button onClick={() => {
                    
                    formLesson.setFieldValue("sectionId", section.id)
                    setOpenInputLesson(true)
                }} icon={<PlusOutlined />}>Lesson</Button>
                <Button icon={<PlusOutlined />}>Quiz</Button>
            </Space>
        </div>
    )
}

export default RowSection