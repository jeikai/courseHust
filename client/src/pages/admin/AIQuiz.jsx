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
import scq from "../../assets/scq.svg";
import mcq from "../../assets/mcq.svg";
import fill from "../../assets/fill.svg";
import FormItem from "antd/es/form/FormItem";
import { createQuiz } from "../../api/quiz";
import { useAPI } from "../../hooks/api";
import { ViewContext } from "../../context/View";
import { useContext } from "react";
const AddQuiz = () => {
  const breadcrumb = [
    {
      title: "Home",
      href: "",
    },
    {
      title: "Quiz",
    },
  ];
  const viewContext = useContext(ViewContext);
  const [formQuiz] = Form.useForm();
  const [course, setCourse] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user")).account;
  const courseResponseApi = useAPI(
    `/api/course/instructor/${userId._id}`,
    null
  ).data;
  useEffect(() => {
    if (courseResponseApi) {
      setCourse(
        courseResponseApi.map((course) => ({
          label: course.title,
          value: course._id,
        }))
      );
    }
  }, [courseResponseApi]);
  useEffect(() => {
    if (selectedCourseId) {
      setSections([]);
      const selectedCourse = courseResponseApi.find(
        (c) => c._id === selectedCourseId
      );
      if (selectedCourse) {
        setSections(selectedCourse.sections);
      } else {
        setSections([]);
      }
    }
    formQuiz.setFieldsValue({ section: null });
  }, [selectedCourseId, courseResponseApi]);

  const handleSetAsDefaultChange = (indexQuestion, indexOption) => {
    const fieldQuiz = formQuiz.getFieldsValue();
    const { questions } = fieldQuiz;

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

    formQuiz.setFieldsValue({ questions });
  };

  const handleFinish = (data) => {
    console.log(data);

    createQuiz(data)
      .then((res) => {
        if (res == true) {
          viewContext.handleSuccess("Create quiz successfully!");
        } else if (res == false) {
          viewContext.handleError("Create quiz failed");
        } else {
          viewContext.handleError(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
        viewContext.handleError(err);
      });
  };
  const handleCourseChange = (value) => {
    setSelectedCourseId(value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <Spring>
      <Bread title="AI Quiz" items={breadcrumb} />
      <div>
        <Form
          form={formQuiz}
          layout="vertical"
          // onValuesChange={handleFormQuizChange}
          onFinish={handleFinish}
        >
          <Row gutter={12}>
            <Col span={8}>
              <Row className="shadow-md border bg-white p-8">
                <Col span={24}>
                  <Form.Item
                    name={"title"}
                    label={<Typography.Title level={5}>Title</Typography.Title>}
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
                    name={"course"}
                    label={
                      <Typography.Title level={5}>Course</Typography.Title>
                    }
                  >
                    <Select
                      showSearch
                      placeholder="Select a course"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={course}
                      onChange={handleCourseChange}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name={"section"}
                    label={
                      <Typography.Title level={5}>Section</Typography.Title>
                    }
                  >
                    <Select
                      showSearch
                      placeholder="Select a section"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={sections.map((section) => ({
                        label: section.title,
                        value: section._id,
                      }))}
                      size="large"
                      disabled={!selectedCourseId}
                    />
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
                                  initialValue={"perception"}
                                  noStyle
                                >
                                  <Select placeholder="Select question type">
                                    <Select.Option value="perception">
                                      Perception
                                    </Select.Option>
                                    <Select.Option value="comprehension">
                                      Comprehension
                                    </Select.Option>
                                    <Select.Option value="application">
                                      Application
                                    </Select.Option>
                                    <Select.Option value="advanced application">
                                      Advanced application
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
      </div>
    </Spring>
  );
};

export default AddQuiz;
