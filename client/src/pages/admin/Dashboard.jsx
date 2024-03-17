import React from 'react'
import Bread from '../../components/Bread'
import { ConfigProvider, Flex, Input, Row } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const Dashboard = () => {
    const breadcrumb = [
        {
            title: 'Home',
            href: '',
        },
        {
            title: 'Application Center',
        },
    ]
    return (
        <section>
            <Bread title="Courses" items={breadcrumb} label={"Add new courses"} link={'/'} />
            <div className='shadow-md border bg-white'>
                <div className='mb-4'>
                    <Flex align="center" className='border-b'>
                        <div className='mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 border-b-[#754FFE]'>All</div>
                        <div className='mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 border-b-[#754FFE]'>Approved</div>
                        <div className='mx-5 text-base font-semibold text-[#64748b] py-4 border-b-2 border-b-[#754FFE]'>Pending</div>
                    </Flex>
                </div>
                <div className='my-8 mx-4'>
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    /* here is your component tokens */
                                    activeBorderColor: '#775FFE',
                                    hoverBorderColor: '#775FFE'
                                },
                            },
                        }}
                    >
                        <Input size="large" placeholder="Search" prefix={<SearchOutlined />} />
                    </ConfigProvider>
                </div>
            </div>
        </section>
    )
}

export default Dashboard