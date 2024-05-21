import React, { Fragment, useEffect, useRef, useState } from "react";
import Bread from "../../components/Bread";
import {
  Avatar,
  Button,
  Col,
  ConfigProvider,
  Collapse,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
  Typography,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Question from "../../components/Question";
import Spring from "../../components/Spring";
import { createQuiz, getQuizById } from "../../api/quiz";
import { useParams } from "react-router-dom";
import { ViewContext } from "../../context/View";
import { useContext } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm:ss"; 

const EditQuiz = () => {
  const id = useParams().id;
  const viewContext = useContext(ViewContext);
  const breadcrumb = [
    {
      title: "Home",
      href: "",
    },
    {
      title: "Quiz",
    },
  ];
  const [formQuiz] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [initialForm, setInitialForm] = useState({});

  const handleSetAsDefaultChange = (indexQuestion, indexOption) => {
    const fieldQuiz = formQuiz.getFieldsValue();
    const { questions } = fieldQuiz;
    if (questions[indexQuestion].type === "scq") {
      questions[indexQuestion].options = questions[indexQuestion].options.map(
        (option, i) => {
          if (indexOption === i) {
            option.isSelected = true;
          } else {
            option.isSelected = false;
          }
          return option;
        }
      );
    }
    formQuiz.setFieldsValue({ questions });
  };

  const handleFinish = (data) => {
    data.duration = data.duration.format(timeFormat);
    data.deadline = data.deadline.map((date) => date.format(dateFormat));
    console.log(data);
    createQuiz(data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getQuizById(id)
      .then((data) => {
        // data.deadline = data.deadline.map((date) =>
        //   dayjs(date?.toISOString(), dateFormat)
        // );
        // data.duration = dayjs(data.duration?.toISOString(), timeFormat);
        console.log(data);
        // dayjs(date, dateFormat)
        setInitialForm(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        viewContext.handleError(error);
      });
  }, [id]);

  return (
    <Spring>
      <Bread title="Edit a quiz" items={breadcrumb} />
      <div>
        {!isLoading && (
          <Form
            form={formQuiz}
            layout="vertical"
            initialValues={initialForm}
            // onValuesChange={handleFormQuizChange}
            onFinish={handleFinish}
          >
            <Row gutter={12}>
              <Col span={8}>
                <Row className="shadow-md border bg-white p-8">
                  <Col span={24}>
                    <Form.Item
                      name={"title"}
                      label={
                        <Typography.Title level={5}>Title</Typography.Title>
                      }
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={"duration"}
                      label={
                        <Typography.Title level={5}>
                          Quiz duration
                        </Typography.Title>
                      }
                    >
                      <TimePicker className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={"deadline"}
                      label={
                        <Typography.Title level={5}>
                          Quiz deadline
                        </Typography.Title>
                      }
                    >
                      <DatePicker.RangePicker
                        className="w-full"
                        showTime={{
                          format: "HH:mm",
                        }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={(value, dateString) =>
                          console.log(value, dateString)
                        }
                        onOk={(value) => console.log(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={"totalMarks"}
                      label={
                        <Typography.Title level={5}>
                          Total marks
                        </Typography.Title>
                      }
                    >
                      <InputNumber className="w-full" min={1} changeOnWheel />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={"passMarks"}
                      label={
                        <Typography.Title level={5}>
                          Pass marks
                        </Typography.Title>
                      }
                    >
                      <InputNumber className="w-full" min={1} changeOnWheel />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={16}>
                <Row className="shadow-md border bg-white p-8">
                  <Form.List name={"questions"}>
                    {(fields, { add, remove }) => (
                      <Row gutter={[12, 12]} className="w-full">
                        <Col span={24}>
                          <Flex align="center" justify="space-between">
                            <Button
                              htmlType="submit"
                              className="bg-[#754FFE] text-white"
                              size="large"
                            >
                              Save
                            </Button>
                            <Button
                              className=""
                              size="large"
                              onClick={() => add()}
                            >
                              Add a new question
                            </Button>
                          </Flex>
                        </Col>
                        {fields.map((field, index) => (
                          <Fragment key={index}>
                            <Col span={24}>
                              <Flex
                                align="center"
                                justify="space-between"
                                style={{ marginBottom: 12 }}
                              >
                                <Flex align="center" gap={8} flex={1}>
                                  <Typography.Title
                                    style={{ marginBottom: 0 }}
                                    level={5}
                                  >
                                    Question {index + 1}:
                                  </Typography.Title>
                                  <Form.Item
                                    style={{ marginBottom: 0 }}
                                    name={[field.name, "title"]}
                                  >
                                    <Input
                                      placeholder="Title here"
                                      style={{ width: "400px" }}
                                    />
                                  </Form.Item>
                                </Flex>
                                <Flex gap={4}>
                                  <Form.Item
                                    name={[field.name, "type"]}
                                    initialValue={"mcq"}
                                    noStyle
                                  >
                                    <Select placeholder="Select question type">
                                      <Select.Option value="mcq">
                                        Multiple choice
                                      </Select.Option>
                                      <Select.Option value="scq">
                                        Single choice and True/False
                                      </Select.Option>
                                      <Select.Option value="fill">
                                        Fill in the blank
                                      </Select.Option>
                                    </Select>
                                  </Form.Item>
                                  <Button
                                    onClick={() => remove(field.name)}
                                    danger
                                    icon={<DeleteOutlined />}
                                  ></Button>
                                </Flex>
                              </Flex>
                              <Form.Item>
                                <Form.List
                                  name={[field.name, "options"]}
                                  initialValue={[
                                    {
                                      isSelected: true,
                                      label: "",
                                    },
                                  ]}
                                >
                                  {(subFields, subOpt) => (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 16,
                                      }}
                                    >
                                      {subFields.map((subField) => (
                                        <Flex key={subField.key}>
                                          <Flex
                                            align="center"
                                            justify="space-between"
                                            className="w-full"
                                          >
                                            <Flex align="center" gap={12}>
                                              <ConfigProvider
                                                theme={{
                                                  components: {
                                                    Switch: {
                                                      // handleBg: '#ccc'
                                                    },
                                                  },
                                                  token: {
                                                    colorPrimary: "#754FFE",
                                                    /* here is your global tokens */
                                                  },
                                                }}
                                              >
                                                <Form.Item
                                                  noStyle
                                                  name={[
                                                    subField.name,
                                                    "isSelected",
                                                  ]}
                                                  valuePropName="checked"
                                                >
                                                  <Switch
                                                    onChange={() =>
                                                      handleSetAsDefaultChange(
                                                        field.key,
                                                        subField.key
                                                      )
                                                    }
                                                    checked
                                                  ></Switch>
                                                </Form.Item>
                                              </ConfigProvider>
                                              <Form.Item
                                                noStyle
                                                name={[subField.name, "label"]}
                                              >
                                                <Input
                                                  placeholder="Question title"
                                                  style={{ width: 400 }}
                                                />
                                              </Form.Item>
                                            </Flex>
                                            {subField.name === 0 && (
                                              <Button
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                  subOpt.add();
                                                }}
                                              ></Button>
                                            )}
                                            {subField.name !== 0 && (
                                              <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                  subOpt.remove(subField.name);
                                                }}
                                              ></Button>
                                            )}
                                          </Flex>
                                        </Flex>
                                      ))}
                                    </div>
                                  )}
                                </Form.List>
                              </Form.Item>
                            </Col>
                          </Fragment>
                        ))}
                      </Row>
                    )}
                  </Form.List>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </Spring>
  );
};

export default EditQuiz;
