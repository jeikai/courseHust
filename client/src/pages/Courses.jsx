import Layout from "../layout/Layout";
import breadcramb from '../assets/course-breadcramb.png'
import book from '../assets/brd-book.png'
import { Breadcrumb, Col, ConfigProvider, Radio, Rate, Row, Segmented, Space, Typography } from "antd";
import { AppstoreOutlined, BarsOutlined, HomeOutlined } from "@ant-design/icons";
import Course from "../components/Course";
import { useState } from "react";
const Courses = () => {
  const [list, setList] = useState('List')
  return (
    <Layout>
      <section style={{ backgroundImage: `url(${breadcramb})` }} className="my-6">
        <Row className="max-w-screen-xl m-auto">
          <Col span={18} className="flex items-center">
            <Space direction="vertical">
              <Breadcrumb className="z-10 text-2xl"
                items={[
                  {
                    href: '',
                    title: <>
                      <HomeOutlined style={{ fontSize: '24px', color: 'white' }} />
                      <span className="text-white">Home</span>
                    </>,
                  },
                  {
                    title: <span className="text-white">Course</span>,
                  },
                ]}
              />
              <Typography.Title level={1} style={{ color: 'white', marginTop: '12px' }}>Courses</Typography.Title>
            </Space>
          </Col>
          <Col span={6}>
            <img src={book} alt="book" className="w-[212px] h-[212px]" />
          </Col>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto">
          <Row gutter={64}>
            <Col span={5} className="shadow-lg">
              <Space direction="vertical">
                <Space direction="vertical" className="p-4">
                  <Typography.Title level={4} className="border-b-2 border-purple-400">Categories</Typography.Title>
                  <Radio.Group>
                    {/* <Typography.Paragraph ellipsis={ellipsis}> */}
                      <Space direction="vertical">
                        <Radio className="text-base" value={1}>Option A</Radio>
                        <Radio className="text-base" value={2}>Option B</Radio>
                        <Radio className="text-base" value={3}>Option C</Radio>
                      </Space>
                    {/* </Typography.Paragraph> */}
                  </Radio.Group>
                </Space>
                <Space direction="vertical" className="p-4">
                  <Typography.Title level={4} className="border-b-2 border-purple-400">Price</Typography.Title>
                  <Radio.Group>
                      <Space direction="vertical">
                        <Radio className="text-base" value={1}>All</Radio>
                        <Radio className="text-base" value={2}>Free</Radio>
                        <Radio className="text-base" value={3}>Paid</Radio>
                      </Space>
                  </Radio.Group>
                </Space>
                <Space direction="vertical" className="p-4">
                  <Typography.Title level={4} className="border-b-2 border-purple-400">Level</Typography.Title>
                  <Radio.Group>
                      <Space direction="vertical">
                        <Radio className="text-base" value={1}>All</Radio>
                        <Radio className="text-base" value={2}>Beginner</Radio>
                        <Radio className="text-base" value={3}>Intermediate</Radio>
                        <Radio className="text-base" value={3}>Advanced</Radio>
                      </Space>
                  </Radio.Group>
                </Space>
                <Space direction="vertical" className="p-4">
                  <Typography.Title level={4} className="border-b-2 border-purple-400">Rating</Typography.Title>
                  <Radio.Group>
                      <Space direction="vertical">
                        <Radio className="text-base" value={1}>All</Radio>
                        <Radio className="text-base" value={0}>
                          <Rate disabled defaultValue={1} />
                        </Radio>
                        <Radio className="text-base" value={2}>
                          <Rate disabled defaultValue={2} />
                        </Radio>
                        <Radio className="text-base" value={3}>
                          <Rate disabled defaultValue={3} />
                        </Radio>
                        <Radio className="text-base" value={4}>
                          <Rate disabled defaultValue={4} />
                        </Radio>
                        <Radio className="text-base" value={5}>
                          <Rate disabled defaultValue={5} />
                        </Radio>
                      </Space>
                  </Radio.Group>
                </Space>
              </Space>
            </Col>
            <Col span={19}>
                <Row>
                  <Col>
                    <ConfigProvider
                      theme={{
                        components: {
                          Segmented: {
                            itemSelectedBg: '#754FFE',
                            itemSelectedColor	: '#FFFFFF',
                            itemHoverBg: '#754FFE',
                            itemHoverColor: '#FFFF',
                          },
                        },
                      }}
                    >
                      <Segmented
                        onChange={(e) => setList(e)}
                        size="large"
                        options={[
                          {
                            value: 'List',
                            icon: <BarsOutlined className="p-2 text-2xl" />,
                          },
                          {
                            value: 'Grid',
                            icon: <AppstoreOutlined className="p-2 text-2xl" />,
                          },
                        ]}
                      />
                    </ConfigProvider>
                  </Col>
                </Row>
                <Row gutter={[16,16]} className="mt-4">
                  <Col span={list === 'List' ? 20 : 8}>
                    <Course list={list} ></Course>
                  </Col>
                  <Col span={list === 'List' ? 20 : 8}>
                    <Course list={list} ></Course>
                  </Col>
                  <Col span={list === 'List' ? 20 : 8}>
                    <Course list={list} ></Course>
                  </Col>
                  <Col span={list === 'List' ? 20 : 8}>
                    <Course list={list} ></Course>
                  </Col>
                </Row>
            </Col>
          </Row>
      </section>
    </Layout>
  )
}

export default Courses