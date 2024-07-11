import { Alert, ConfigProvider, Flex, Spin } from 'antd'
import React from 'react'

const Loader = () => {
  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: "100vh", width: "100%" }}
    >
      <Spin size="large" />
    </Flex>
  )
}

export default Loader