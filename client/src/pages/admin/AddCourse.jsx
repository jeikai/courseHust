import React, { Fragment, useEffect, useRef, useState } from 'react'
import Bread from '../../components/Bread'
import { Button, Checkbox, Col, Collapse, ConfigProvider, Divider, Drawer, Dropdown, Flex, Form, Input, Modal, Row, Select, Space, Steps, Table, Typography, Upload, message, theme } from 'antd'
import { CheckOutlined, DeleteOutlined, EditOutlined, MinusOutlined, MoreOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined, SettingOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';

import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import RowSection from '../../components/admin/RowSection'

const AddCourse = () => {
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [formLesson] = Form.useForm()
    const [formEditLesson] = Form.useForm()
    const [formSection] = Form.useForm()
    const [formEditSection] = Form.useForm()
    const [idEditSection, setIdEditSection] = useState();
    const [idEditLesson, setIdEditLesson] = useState();
    const [lessonKey, setLessonKey] = useState(0);
    const [data, setData] = useState({
        title: '',
        category: '',
        level: 'basic',
        shortDes: '',
        description: '',
        faq: [],
        outcomes: [],
        requirements: [],
        price: undefined,
        free: false,
        thumbnail: null,
        video: null,
        sections: []
    })
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Add New Course',
        },
    ]

    const options = [
        {
            label: 'gold',
            value: 'gold',
        },
        {
            label: 'lime',
            value: 'lime',
        },
        {
            label: 'green',
            value: 'green',
        },
        {
            label: 'cyan',
            value: 'cyan',
        },
    ];
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const [previewOpen, setPreviewOpen] = useState(false);

    const [thumbnail, setThumbnail] = useState([])
    const [video, setVideo] = useState([])

    const [openInputSections, setOpenInputSections] = useState(false)
    const [openEditSections, setOpenEditSections] = useState(false)
    const [openInputLesson, setOpenInputLesson] = useState(false)
    const [openEditLesson, setOpenEditLesson] = useState(false)

    const handleOkLesson = () => {
        // debugger
        // callback()
        const fieldLessons = formLesson.getFieldsValue()
        let lessonId = uuidv4()
        let sectionId = fieldLessons.sectionId
        fieldLessons.id = lessonId

        const { sections } = data

        sections.forEach(section => {
            if (section.id === sectionId) {
                console.log('hehe');

                if (!section?.specialIds) {
                    section.specialIds = [],
                        section.specials = []
                }
                let obj = {
                    id: lessonId,
                    type: 'lesson'
                }
                section.specialIds.push(obj),
                    section.specials.push(fieldLessons)
            }
        })

        setData(prevData => ({
            ...prevData,
            sections: sections
        }))

        setOpenInputLesson(false)
        formLesson.resetFields()

        console.log("data", data);
        console.log(JSON.stringify(data))
        console.log("fieldLessons", fieldLessons);
    }

    const handleEditLesson = () => {
        let newObject = formEditLesson.getFieldsValue()
        console.log(newObject);
        let { sections } = data
        sections.forEach(section => {
            let { specials } = section
            let index = specials.findIndex(special => special.id === idEditLesson)
            console.log(index);

            if (index !== -1) {
                // Tìm thấy đối tượng với id tương ứng
                // Xóa phần tử cũ
                specials.splice(index, 1);

                // Chèn đối tượng mới vào vị trí đó
                specials.splice(index, 0, newObject);
            }
        })

        setData(prevData => ({
            ...prevData,
            sections: sections
        }))

        setIdEditLesson(0)
        setOpenEditLesson(false)
        formEditLesson.resetFields()

        console.log(sections);
        console.log(data);
    }

    const openModalEditLesson = (id) => {
        const { sections } = data
        console.log(id);
        sections.forEach(section => {
            section?.specials?.forEach(item => {
                if (item.id === id) {

                    formEditLesson.setFieldValue("name", item.name)
                    formEditLesson.setFieldValue("lessonDescription", item.lessonDescription)
                    formEditLesson.setFieldValue("file", item.file)
                    formEditLesson.setFieldValue("sectionId", item.sectionId)

                    setIdEditLesson(id)
                    setOpenEditLesson(true)
                }
            })
        })
    }

    const handleOkSection = () => {
        // debugger

        const fieldSections = formSection.getFieldsValue()
        let sectionId = uuidv4()
        fieldSections.id = sectionId;

        if (!data.sectionIds) {
            data.sectionIds = []
            data.sections = []
        }

        data.sectionIds.push(sectionId)
        data.sections.push(fieldSections)

        console.log("fieldSections", fieldSections);
        console.log(data);

        setData(data)
        setOpenInputSections(false)

        formSection.resetFields()
    }


    const handleEditSection = () => {
        data.sections.forEach(section => {
            if (section.id === idEditSection) {
                let newName = formEditSection.getFieldValue("sectionName");
                section.sectionName = newName
                setData(data)

                formEditSection.resetFields()
                setOpenEditSections(false)
            }
        })
    }

    const openModalEditSection = (id) => {
        console.log(id);
        data.sections.forEach(section => {
            if (section.id === id) {
                console.log(data.sections);
                formEditSection.setFieldValue("sectionName", section.sectionName)
                setIdEditSection(id)
                setOpenEditSections(true)
            }
        })
    }

    const handleRemoveLesson = (id) => {
        let { sections } = data
        sections.forEach(section => {
            let { specials } = section
            let index = specials.findIndex(special => special.id === id)
            console.log(index);

            if (index !== -1) {
                // Tìm thấy đối tượng với id tương ứng
                // Xóa phần tử cũ
                specials.splice(index, 1);

            }
        })
        setData(prevData => ({
            ...prevData,
            sections: sections
        }))
    }

    const handleRemoveSection = (id) => {
        console.log(id);
        // Xóa phần tử trong mảng sections
        const updatedSections = data.sections.filter(section => section.id !== id);

        // Xóa id trong mảng sectionIds
        const updatedSectionIds = data.sectionIds.filter(id => id !== id);

        // Cập nhật dữ liệu mới
        setData(prevData => ({
            ...prevData,
            sections: updatedSections,
            sectionIds: updatedSectionIds
        }));
    }

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    useEffect(() => {
        const field = form.getFieldsValue()
        field.description = field.description?.level?.content
        setData({ ...data, ...field })
    }, [current])

    const serverUpload = async (options, callback) => {
        debugger
        const { onSuccess, file, onError, onProgress } = options;
        console.log(file);
        callback([file]);
        onSuccess("ok");
    }


    const handleSubmit = (data) => {
        console.log(data);
    }

    const BasicInfor = ({ index }) => (

        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Typography.Title level={4}>Basic Infomation</Typography.Title>
            <Divider></Divider>
            <Row gutter={[24, 0]}>
                <Col span={24}>
                    <Form.Item
                        label={<Typography.Title level={5}>Course Title</Typography.Title>}
                        name="title"
                    >
                        <Input
                            placeholder="Course Title"
                            size='large'
                            showCount
                            maxLength={60}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={<Typography.Title level={5}>Courses category</Typography.Title>} name="category">
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={options}
                            size='large'
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={<Typography.Title level={5}>Courses level</Typography.Title>} name="level">
                        <Select
                            placeholder="Select a person"
                            options={[
                                {
                                    label: 'Intermediate',
                                    value: 'intermediate'
                                },
                                {
                                    label: 'Advanced',
                                    value: 'advanced'
                                },
                                {
                                    label: 'Beginner',
                                    value: 'beginner'
                                },
                            ]}
                            size='large'
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label={<Typography.Title level={5}>Short description</Typography.Title>} name="shortDes">
                        <Input.TextArea className='py-2' rows={6} placeholder="Short description for course" maxLength={5} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label={<Typography.Title level={5}>Course Description</Typography.Title>} name="description">
                        <Editor
                            apiKey='by05nyt9dhljko786tzo81q4vzgsn5hrdjq81e4kb3wi5yyp'
                            init={{
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                placeholder: 'Write something awesome',
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )

    const Information = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Row>
                <Col span={6}>
                    <Typography.Title level={5}>
                        Course faq
                    </Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.List name="faq">
                        {(fields, { add, remove }) => (
                            fields.map((field, index) => (
                                <Flex key={field.name} gap={12} name={[field.name, 'name']}>
                                    <div className='flex-1'>
                                        <Form.Item className='w-full' name={[field.name, "question"]}>
                                            <Input
                                                placeholder="Faq question"
                                                size='large'
                                                showCount
                                                maxLength={60}
                                            />
                                        </Form.Item>
                                        <Form.Item className='w-full' name={[field.name, "answer"]}>
                                            <Input.TextArea
                                                placeholder="Answer"
                                                size='large'
                                            />
                                        </Form.Item>
                                    </div>
                                    {index === 0 ?
                                        <div>
                                            <Button onClick={() => add()} classNames="bg-[#754FFE]" icon={<PlusOutlined />} size='large'></Button>
                                        </div>
                                        :
                                        <div>
                                            <Button onClick={() => remove(field.name)} classNames="bg-[#754FFE]" icon={<MinusOutlined />} size='large'></Button>
                                        </div>
                                    }
                                </Flex>
                            ))
                        )}
                    </Form.List>
                </Col>

                <Divider />

                <Col span={6}>
                    <Typography.Title level={5}>
                        Requirements
                    </Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.List name="requirements">
                        {(fields, { add, remove }) => (
                            fields.map((field, index) => (
                                <Flex key={field.name} gap={12} name={[field.name, 'name']}>
                                    <div className='flex-1'>
                                        <Form.Item className='w-full' name={[field.name, "requirement"]}>
                                            <Input
                                                placeholder="Provide requirements"
                                                size='large'
                                            />
                                        </Form.Item>
                                    </div>
                                    {index === 0 ?
                                        <div>
                                            <Button onClick={() => add()} classNames="bg-[#754FFE]" icon={<PlusOutlined />} size='large'></Button>
                                        </div>
                                        :
                                        <div>
                                            <Button onClick={() => remove(field.name)} classNames="bg-[#754FFE]" icon={<MinusOutlined />} size='large'></Button>
                                        </div>
                                    }
                                </Flex>
                            ))
                        )}
                    </Form.List>
                </Col>

                <Divider />

                <Col span={6}>
                    <Typography.Title level={5}>
                        Outcomes
                    </Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.List name="outcomes">
                        {(fields, { add, remove }) => (
                            fields.map((field, index) => (
                                <Flex key={field.name} gap={12} name={[field.name, 'name']}>
                                    <div className='flex-1'>
                                        <Form.Item className='w-full' name={[field.name, "outcome"]}>
                                            <Input
                                                placeholder="Provide outcomes"
                                                size='large'
                                            />
                                        </Form.Item>
                                    </div>
                                    {index === 0 ?
                                        <div>
                                            <Button onClick={() => add()} classNames="bg-[#754FFE]" icon={<PlusOutlined />} size='large'></Button>
                                        </div>
                                        :
                                        <div>
                                            <Button onClick={() => remove(field.name)} classNames="bg-[#754FFE]" icon={<MinusOutlined />} size='large'></Button>
                                        </div>
                                    }
                                </Flex>
                            ))
                        )}
                    </Form.List>
                </Col>
            </Row>
        </div>
    )

    const Pricing = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Row>
                <Col span={6}>
                    <Typography.Title level={5}>

                    </Typography.Title>
                </Col>
                <Col span={18}>
                    <Form.Item className='w-full' name="free" valuePropName="checked">
                        <Checkbox>
                            Check if this is a free course
                        </Checkbox>
                    </Form.Item>
                </Col>

                <Divider />
                {

                    !form.getFieldValue('free') &&
                    <>
                        <Col span={6}>
                            <Typography.Title level={5}>
                                Course price ($)
                            </Typography.Title>
                        </Col>
                        <Col span={18}>
                            <Form.Item className='w-full' name="price">
                                <Input
                                    placeholder="Enter course price"
                                    size='large'
                                />
                            </Form.Item>
                        </Col>
                    </>
                }
            </Row>
        </div>
    )

    const Media = ({ index }) => (
        <div className={`${current === index ? 'block' : 'hidden'}`}>
            <Typography.Title level={4}>Courses Media</Typography.Title>
            <Divider />
            <Row>
                <Col span={8}>
                    <Typography.Title level={5}>Course thumbnail</Typography.Title>
                </Col>
                <Col span={16}>
                    <Form.Item>
                        <Upload
                            customRequest={(options) => serverUpload(options, setThumbnail)}
                            listType="picture-card"
                            fileList={thumbnail}
                            onRemove={() => setThumbnail([])}
                        >
                            {thumbnail.length < 1 &&
                                <button
                                    style={{
                                        border: 0,
                                        background: 'none',
                                    }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        Upload
                                    </div>
                                </button>
                            }
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Typography.Title level={5}>Course video</Typography.Title>
                </Col>
                <Col span={16}>
                    <Form.Item>
                        <Upload
                            customRequest={(options) => serverUpload(options, setVideo)}
                            fileList={video}
                        >
                            <Button icon={<UploadOutlined />}>Upload your short video</Button>
                        </Upload>

                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
    
    const [isDragging, setIsDragging] = useState(false);
    const handleDragStart = (event) => {
        console.log("drag start");
        setIsDragging(true);
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        const { sections} = data

        if(active.id === over.id) return

        if(active.id !== over.id) {
            //Lấy vị trí cũ  (từ thằng active)
            const oldIndex = sections.findIndex(section => section.id === active.id)
            //Lấy vị trí mới  (từ thằng over)
            const newIndex = sections.findIndex(section => section.id === over.id)

            const dndOrdered = arrayMove(sections, oldIndex, newIndex)
            const dndOrderedIds = dndOrdered.map(item => item.id)
            console.log(dndOrdered);
            console.log(dndOrderedIds);
            setData(prevData => ({
                ...prevData,
                sectionIds: dndOrderedIds,
                sections: dndOrdered
            }))
            console.log(data);
        }
        
    }

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
          distance: 10, // Enable sort function when dragging 10px   💡 here!!!
        },
    })

    const sensors = useSensors(mouseSensor)

    const Curriculum = ({ index }) => {
        return (
            <div className={`${current === index ? 'block' : 'hidden'}`}>
                <Typography.Title level={4}>Curriculum</Typography.Title>
                <div className='p-4'>
                    <div className='bg-[#f1f5f9] p-2 rounded-md mb-4'>
                        <Flex vertical gap={12}>
                            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                                <SortableContext items={data?.sections} strategy={verticalListSortingStrategy}>
                                    {data?.sections.map(section => {
                                        return (
                                            <RowSection key={section.id} section={section} openModalEditSection={openModalEditSection} handleRemoveSection={handleRemoveSection} openModalEditLesson={openModalEditLesson} handleRemoveLesson={handleRemoveLesson} formLesson={formLesson} setOpenInputLesson={setOpenInputLesson} someoneIsDragging={isDragging} />
                                        )
                                    })}
                                </SortableContext>
                            </DndContext>
                        </Flex>
                        <Drawer
                            title="Create a new lesson"
                            width={720}
                            onClose={() => setOpenInputLesson(false)}
                            open={openInputLesson}
                            styles={{
                                body: {
                                    paddingBottom: 80,
                                },
                            }}
                            extra={
                                <Space>
                                    <Button onClick={() => setOpenInputLesson(false)}>Cancel</Button>
                                    <Button onClick={handleOkLesson} type="primary">
                                        Submit
                                    </Button>
                                </Space>
                            }
                        >
                            <Form form={formLesson}>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Typography.Title level={5}>Lesson Name</Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter lesson name',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Please enter lesson name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Typography.Title level={5}>
                                            Description
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="lessonDescription"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'please enter description',
                                                },
                                            ]}
                                        >
                                            <Input.TextArea rows={4} placeholder="please enter description" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Typography.Title level={5}>
                                            Upload video or document
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="file"
                                            getValueFromEvent={getFile}
                                        >
                                            <Upload

                                            // fileList={video}
                                            >
                                                <Button icon={<UploadOutlined />}>Upload your file</Button>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Typography.Title level={5}>
                                            Section Id
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="sectionId"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Drawer>
                        <Drawer
                            title="Edit a lesson"
                            width={720}
                            onClose={() => setOpenEditLesson(false)}
                            open={openEditLesson}
                            styles={{
                                body: {
                                    paddingBottom: 80,
                                },
                            }}
                            extra={
                                <Space>
                                    <Button onClick={() => setOpenEditLesson(false)}>Cancel</Button>
                                    <Button onClick={handleEditLesson} type="primary">
                                        Submit
                                    </Button>
                                </Space>
                            }
                        >
                            <Form form={formEditLesson}>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Typography.Title level={5}>Lesson Name</Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter lesson name',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Please enter lesson name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Typography.Title level={5}>
                                            Description
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="lessonDescription"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'please enter description',
                                                },
                                            ]}
                                        >
                                            <Input.TextArea rows={4} placeholder="please enter description" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Typography.Title level={5}>
                                            Upload video or document
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="file"
                                            getValueFromEvent={getFile}
                                        >
                                            <Upload

                                            // fileList={video}
                                            >
                                                <Button icon={<UploadOutlined />}>Upload your file</Button>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Typography.Title level={5}>
                                            Section Id
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="sectionId"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Drawer>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultBorderColor: '#754FFE',
                                        defaultHoverColor: 'white',
                                        defaultHoverBorderColor: '#754FFE',
                                        defaultHoverBg: '#754FFE'
                                    }
                                }
                            }}
                        >
                            <Button onClick={() => setOpenInputSections(true)} className='mt-8 text-[#754FFE] font-semibold'>
                                Add section
                            </Button>

                            <Modal
                                title="Add a new section"
                                open={openInputSections}
                                onOk={handleOkSection}
                                onCancel={() => setOpenInputSections(false)}
                            >
                                <Form form={formSection}>
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Title level={5}>
                                                Section name
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item name="sectionName">
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal>
                            <Modal
                                title="Edit a section"
                                open={openEditSections}
                                onOk={handleEditSection}
                                onCancel={() => setOpenEditSections(false)}
                            >
                                <Form form={formEditSection}>
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Title level={5}>
                                                Section name
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item name="sectionName">
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal>
                        </ConfigProvider>
                    </div>

                </div>
            </div>
        )
    }

    const steps = [
        {
            title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Basic infomation</Typography.Title>,
            content: <BasicInfor index={0} />,
        },
        {
            title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Info</Typography.Title>,
            content: <Information index={1} />,
        },
        {
            title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Pricing</Typography.Title>,
            content: <Pricing index={2} />,
        },
        {
            title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Media</Typography.Title>,
            content: <Media index={3} />,
        },
        {
            title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Curriculum</Typography.Title>,
            content: <Curriculum index={4} />,
        },
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <section>
            <Bread title="Add new courses" items={breadcrumb} />
            <div className='w-full p-8 bg-white shadow-md my-8'>
                <Flex align='center' justify='space-between' className='px-5' gap={6}>
                    {steps.map((step, index) => {
                        return (
                            <Fragment key={index}>
                                <Flex className='flex-1 cursor-pointer' align='center' gap={12} onClick={() => setCurrent(index)}>
                                    <Flex align='center' justify='center' className={`font-semibold w-10 h-10 ${current >= index ? 'bg-[#754FFE] text-white' : 'bg-gray-200'} rounded-full`}>{index + 1}</Flex>
                                    {step.title}
                                </Flex>

                                {index < steps.length - 1 &&
                                    <Flex className='flex-1'>
                                        <Divider className={`bg-[#754FFE]`} />
                                    </Flex>
                                }
                            </Fragment>
                        )
                    })}
                </Flex>

                <div className='mt-8'>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            faq: [null],
                            requirements: [null],
                            outcomes: [null],
                        }}
                    // onValuesChange={handleChangeValue}
                    >
                        {steps.map((step, index) => {
                            return (
                                <Fragment key={index}>
                                    {step.content}
                                </Fragment>
                            )
                        })}
                        <div style={{ marginTop: 24 }}>
                            {current < steps.length - 1 && (
                                <Button onClick={() => setCurrent(current + 1)} className='bg-[#754FFE] text-white font-semibold' size='large'>Next</Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button htmlType="submit" type='submit' className='bg-[#754FFE] text-white font-semibold' size='large'>Done</Button>

                            )}
                            {current > 0 && (

                                <Button onClick={() => setCurrent(current - 1)} className='text-[#754FFE] font-semibold ml-2' size='large'>Previous</Button>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        </section>
    )
}

export default AddCourse

