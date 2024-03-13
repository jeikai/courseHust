import { Alert, ConfigProvider, Flex, Spin } from 'antd'
import React from 'react'

const Loader = () => {
  return (
      <Spin className='bg-white' size='large' tip="Loading..." spinning={true} fullscreen></Spin>
  )
}

export default Loader