import React, { Fragment, useEffect, useRef, useState } from 'react'
import Bread from '../../components/Bread'
import { Avatar, Button, Col, ConfigProvider, DatePicker, Flex, Form, Input, InputNumber, Modal, Radio, Row, Select, Switch, TimePicker, Typography } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import Question from '../../components/Question'
import Spring from '../../components/Spring'
import scq from '../../assets/scq.svg'
import mcq from '../../assets/mcq.svg'
import fill from '../../assets/fill.svg'
const AddQuiz = () => {
  const breadcrumb = [
    {
      title: 'Home',
      href: '',
    },
    {
      title: 'Quiz',
    },
  ]
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [numOfOptions, setNumOfOptions] = useState(0)
  // const [formQuestion] = Form.useForm()
  const [formQuiz] = Form.useForm()
  const [data, setData] = useState({})
  const formRef = useRef(null)
  let flag = true
  const handleFormQustionChange = (value) => {
    debugger
    if(value.numberOptions === '') {
      setNumOfOptions(0)
      flag = true
      return
    }

    if(value.numberOptions) {
      setNumOfOptions(value.numberOptions)
    }
    if(value.options && flag) {
      value.options[0].isSelected = true
      formRef.current.setFieldsValue({options: value.options})
      flag = false
    }
  }

  const handleFormQuizChange = (changedValues, values) => {
    if(values.duration instanceof Object) {
      values.duration = values.duration.format('HH:mm:ss');
    }
    values.deadline = values?.deadline?.map(value => value.format('YYYY-MM-DD HH:mm:ss'))

    setData({...data, ...values})
    
  }

  const handleAddQuestion = () => {
    debugger
    let formQuestion = formRef.current.getFieldsValue()
    if(!data?.questions) {
      data.questions = []
    }
    data.questions.push(formQuestion)

    setData({...data});
    formRef.current.resetFields()
    console.log(data);
    setOpen(false)
    setNumOfOptions(0)
  }

  const handleSetAsDefaultChange = (index) => {
    debugger
    let options = formRef.current.getFieldValue("options");
    let type = formRef.current.getFieldValue("type");
    if(type === "scq") {
      options = options.map((option, i) => {
        if (index === i) {
          option.isSelected = option.isSelected;
        } else {
          option.isSelected = false;
        }
        return option;
      });
    }
    formRef.current.setFieldsValue({ options })
  }
  return (
    <Spring>
      <Bread title="Add a new quiz" items={breadcrumb} />
      <div>
        <Form
          form={formQuiz}
          layout='vertical'
          onValuesChange={handleFormQuizChange}
        >
          <Row gutter={12}>
            <Col span={8}>
              <Row className='shadow-md border bg-white p-8'>
                <Col span={24}>
                  <Form.Item
                    name={"title"}
                    label={<Typography.Title level={5}>Title</Typography.Title>}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name={"duration"}
                    label={<Typography.Title level={5}>Quiz duration</Typography.Title>}
                  >
                    <TimePicker className='w-full'/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name={"deadline"}
                    label={<Typography.Title level={5}>Quiz deadline</Typography.Title>}
                  >
                    <DatePicker.RangePicker
                      className='w-full'
                      showTime={{
                        format: 'HH:mm',
                      }}
                      format="YYYY-MM-DD HH:mm"
                      onChange={(value, dateString) => console.log(value, dateString)}
                      onOk={(value) => console.log(value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name={"totalMarks"}
                    label={<Typography.Title level={5}>Total marks</Typography.Title>}
                  >
                    <InputNumber className='w-full' min={1} changeOnWheel />

                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name={"passMarks"}
                    label={<Typography.Title level={5}>Pass marks</Typography.Title>}
                  >
                    <InputNumber className='w-full' min={1} changeOnWheel />

                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <Row gutter={[12, 24]} className='shadow-md border bg-white p-8'>
                  <Col span={24}>
                    <Button className='ml-auto block' size='large' onClick={() => setOpen(true)}>Add a new question</Button>
                  </Col>
                  
                  {data?.questions?.map((question, index) => (
                    <Col span={24}>
                      <div className='px-3 border shadow rounded-sm py-1 select-none'>
                        <Flex align='center' justify='space-between'>
                          <Flex flex={3}>
                            <Typography.Title level={5} style={{ marginBottom: 0, textTransform:'capitalize' }}>{question.title}</Typography.Title>
                          </Flex>
                          <Flex flex={1} align='center' justify='space-between' gap={60}>
                            <Flex align='center'>
                                {question.type === 'mcq' && <Avatar src={mcq} size={30} />}
                                {question.type === 'scq' && <Avatar src={scq} size={30} />}
                                {question.type === 'fill' && <Avatar src={fill} size={30} />}
                              
                              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                                {question.type === 'mcq' && 'Multiple Choice'}
                                {question.type === 'scq' && 'Single Choice'}
                                {question.type === 'fill' && 'Fill Question'}
                              </Typography.Title>
                            </Flex>
                            <Button icon={<MoreOutlined />}></Button>
                          </Flex>
                        </Flex>
                      </div>
                    </Col>
                  ))}
              </Row>
            </Col>

          </Row>
        </Form>
        <Modal
          title={"Add a new question"}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleAddQuestion}
        >
          <Form
            ref={formRef}
            // form={formQuestion}
            layout='vertical'
            onValuesChange={handleFormQustionChange}
          >
            <Form.Item
              name={"title"}
              label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Write your question</Typography.Title>}
            >
              <Input placeholder='Quiz title' />
            </Form.Item>
            <Form.Item
              name={"type"}
              label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Quiz type</Typography.Title>}
            >
              <Select placeholder='Select question type'>
                <Select.Option value='mcq' >Multiple choice</Select.Option>
                <Select.Option value='scq'>Single choice and True/False</Select.Option>
                <Select.Option value='fill'>Fill in the blank</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"numberOptions"}
              label={<Typography.Title level={5} style={{ marginBottom: 0 }}>Number of options</Typography.Title>}
            >
              <Input onChange={(value) => handleFormQustionChange(value)} type='number' min={1} placeholder='Number of options' />
            </Form.Item>
            <Form.List
              name={"options"}
            >
              
              {(fields, { add, remove }) => (
                <>
                  {Array.from({ length: numOfOptions }).map((num, index) => (
                    <Fragment key={index}>
                      <Row gutter={[12, 12]} className='mb-8 text-base'>
                        <Col span={12}>
                          <Typography.Text>Choice {index + 1}</Typography.Text>
                        </Col>
                        <Col span={12}>
                          <Flex align='center' justify='flex-end' gap={4} >
                            <Typography.Text>Correct answer</Typography.Text>
                              <ConfigProvider
                                theme={{
                                  components: {
                                    Switch: {
                                      // handleBg: '#ccc'
                                    }
                                  },
                                  token: {
                                    colorPrimary	: '#754FFE'
                                    /* here is your global tokens */
                                  },
                                }}
                              >
                            <Form.Item style={{ marginBottom: 0 }} name={[index, "isSelected"]} valuePropName="checked">
                                <Switch checked onChange={() => handleSetAsDefaultChange(index)}></Switch>
                            </Form.Item>
                              </ConfigProvider>
                          </Flex>

                        </Col>
                        <Col span={24}>
                          <Form.Item name={[index, "label"]} style={{ marginBottom: 0 }}>
                            <Input placeholder='Write your answer' />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </div>
    </Spring>
  )
}

export default AddQuiz