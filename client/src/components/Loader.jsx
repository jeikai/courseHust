import { Flex, Spin } from 'antd'
import React from 'react'

const Loader = () => {
  return (
    <Spin size='large' tip="Loading..." spinning={true} fullscreen />
  )
}

export default Loader