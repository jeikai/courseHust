import React, { useContext } from 'react'
import { ViewContext } from '../context/View';
import { CloseOutlined, CloseSquareOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

const Notification = () => {
    const context = useContext(ViewContext);
    const data = context.notification.data;
    return (
        <div className={`${data.type === 'error' ? 'bg-red-900 ' : 'bg-green-900 '} rounded-md fixed top-0 right-0 z-[1000] text-center p-3 duration-150 transition-all ease-in-out`}>
            <Flex>
                <Flex gap={24} align='center' justify='center'>
                    {data.icon && 
                        <Flex align='center' justify='center' className={`p-3 rounded-md ${data.type === 'error' ? 'bg-red-900 ' : 'bg-green-500 '}`}>
                            <data.icon className='text-2xl text-white font-bold' />
                        </Flex>
                    }
                    <p className='text-white text-base min-w-[300px] max-w-[600px]'>{data.text}</p>
                    {!data.close &&
                        <Flex onClick={context.notification.hide} align='center' justify='center' className='p-3 rounded-md shadow-xl'>
                            <CloseOutlined className='text-2xl text-white font-bold' />
                        </Flex>
                    }
                </Flex>
            </Flex>
        </div>
    )
}

export default Notification