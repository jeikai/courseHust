import { Button, Flex, Typography } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-white.png'
const LessonHeader = () => {
    const navigate = useNavigate()
  return (
    <nav className='h-16 p-2 bg-black fixed top-0 right-0 left-0 z-[1000]'>
        <Flex className='flex-1 h-full items-center px-4'>
            <Link to={'/'}>
                <div className='logo w-[150px] h-[33px]'>
                    <img src={logo} alt="logo" className='w-full h-full' />
                </div>
            </Link>
            <Link className='flex-1 text-center'>
                <Flex className='text-white' vertical>
                    <p className='font-semibold text-base'>WordPress Theme Development with Bootstrap</p>
                    <p className='text-sm'>96% Completed(24/25)</p>
                </Flex>
            </Link>
            <Button className='text-white' size='large' onClick={() => navigate('/')}>
                My courses
            </Button>
        </Flex>
    </nav>
  )
}

export default LessonHeader