import React, { useEffect, useState } from 'react'
import Spring from '../../components/Spring'
import Bread from '../../components/Bread'
import { Form, Input, Image, Select , Button, ConfigProvider, Divider, Flex, Progress, Radio, Space, Typography } from 'antd'
import Axios from 'axios'
import { Icon } from '@iconify/react';
const AddCategory = () => {
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Add a new category',
        },
    ]
    const [categories, setCategories] = useState([])

    const fetchIcon = async () => {
        const res = await Axios.get('https://api.iconify.design/collection?prefix=fa-solid&pretty=1');
        // console.log(res.data.categories);
        let newCategories = []
        debugger
        for(let key in res.data.categories) {
            let obj = {
                icons: res.data.categories[key],
                title: key
            }
            newCategories.push(obj)
        }
        console.log(newCategories);
        setCategories(newCategories)
    }

    useEffect(() => {
        fetchIcon()
    }, [])

    const handleFinish = (data) => {
        console.log(data);
    }
    const [formCategory] = Form.useForm()
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <Spring>
            <Bread title="Add a new category" items={breadcrumb} />
            <div className='shadow-md border bg-white w-2/3 m-auto p-4'>
                <Typography.Title level={5}>FORM ADD A NEW CATEGORY</Typography.Title>
                <Form
                    form={formCategory}
                    layout='vertical'
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name={"title"}
                        label={<Typography.Title level={5}>Title</Typography.Title>}
                    >
                        <Input placeholder='title' />
                    </Form.Item>
                    <Form.Item
                        name={"description"}
                        label={<Typography.Title level={5}>Description</Typography.Title>}
                    >
                        <Input placeholder='description' />
                    </Form.Item>
                    <Form.Item
                        name={"icon"}
                        label={<Typography.Title level={5}>Icon</Typography.Title>}
                    >
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={filterOption}
                        >
                            {categories?.map((category, i) => {
                                return (
                                    <Select.OptGroup key={i} label={category.title}>
                                        {category.icons.map((icon, i) => {
                                            return (
                                                <Select.Option key={i} value={icon}>
                                                    <Icon icon={`fa-solid:${icon}`} />
                                                </Select.Option>
                                            )
                                        })}
                                    </Select.OptGroup>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit'>Submit</Button>
                    </Form.Item>
                </Form>
            </div>

        </Spring>
    )
}

export default AddCategory