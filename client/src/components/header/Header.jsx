import React from 'react'
import { Dropdown, Flex, Space, Typography } from 'antd'
import {
    DownOutlined,
    EditOutlined,
    LaptopOutlined,
    MenuOutlined, ShoppingCartOutlined
} from '@ant-design/icons'
import logo from '../../assets/logo.png'
const Header = () => {
    const items = [
        {
          key: '1',
          label: 'Web Design',
          icon: <LaptopOutlined />,
          children: [
            {
              key: '2-1',
              label: '3rd menu item',
            },
            {
              key: '2-2',
              label: '4th menu item',
            },
          ],
        },
        {
          key: '2',
          label: 'Graphic Design',
          icon: <EditOutlined />,
          children: [
            {
              key: '3-1',
              label: '5d menu item',
            },
            {
              key: '3-2',
              label: '6th menu item',
            },
          ],
        },
    ];
  return (
    <header className='py-1'>
        <div className="container mx-auto max-w-screen-xl flex gap-4 items-center p-1">
            <a href='#' className="logo w-[136px] h-[36px]">
                <img src={logo} alt="logo" className='w-full h-full'/>
            </a>
            <Flex justify='space-between' className='flex-1'>
                <div className='bg-[#754ffe58] px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={8} className='text-base text-[#754FFE]'>
                            <Dropdown
                                menu={{
                                items,
                                }}
                                placement="bottom"
                            >
                                <Space>
                                    <MenuOutlined />
                                    <span>Courses</span>
                                </Space>
                            </Dropdown>
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={2} className='text-base font-semibold'>
                            <span>Course bundle</span>
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={2} className='text-base font-semibold'>
                            <span>Bootcamps</span>
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={2} className='text-base font-semibold'>
                            <span>Team training</span>
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={2} className='text-base font-semibold'>
                            <span>Ebook</span>
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={2} className='text-base font-semibold'>
                            <span>Find a tutor</span>
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <a href="#">
                        <Flex align='center' gap={2} className='text-base font-semibold'>
                            <span>More</span>
                            <DownOutlined />
                        </Flex>
                    </a>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <Flex align='center' gap={2} className='text-2xl font-semibold'>
                        <ShoppingCartOutlined  />
                    </Flex>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <Flex align='center' gap={2} className='text-black'>
                        <Typography.Link href="https://ant.design" className='text-base font-semibold'>
                            Login
                        </Typography.Link>
                    </Flex>
                </div>
                <div className='px-4 py-2 rounded cursor-pointer'>
                    <Flex align='center' gap={2}>
                        <Typography.Link href="https://ant.design" className='text-base text-black font-semibold'>
                            Join now
                        </Typography.Link>
                    </Flex>
                </div>
            </Flex>
        </div>
    </header>
  )
}

export default Header