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
  Checkbox
} from "antd";
import Axios from "axios";
import {
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Card from "antd/es/card/Card";
import Question from "../../components/Question";
import Spring from "../../components/Spring";
import Loader from "../../components/Loader";
import scq from "../../assets/scq.svg";
import mcq from "../../assets/mcq.svg";
import fill from "../../assets/fill.svg";
import FormItem from "antd/es/form/FormItem";
import { createQuizWithSuggestedQues } from "../../api/quiz";
import { useAPI } from "../../hooks/api";
import { ViewContext } from "../../context/View";
import { useContext } from "react";
import AddQuestion from "./AddQuestion";
const AddQuiz = () => {
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin_main/quiz",
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
  const [suggestionModal, setSuggestionModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formattedQuestion, setFormattedQuestion] = useState([]);
  const [suggestedQuestion, setSuggestedQuestion] = useState([]);
  const [selectedSuggestQues, setSelectedSuggestQues] = useState([]);
  const [createQuestionModal, setCreateQuestionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user")).account;
  const courseResponseApi = useAPI(
    `/api/course/instructor/${userId._id}`,
    null
  ).data;
  const categoryResponseApi = useAPI(`/api/category`, null).data;
  useEffect(() => {
    const questions = async () => {
      const questionsData = await Axios({
        method: "GET",
        url: `/api/question/category/${selectedCategory._id}`,
      });
      console.log(questionsData.data.data);
      setSuggestedQuestion(questionsData.data.data);
    };
    if (selectedCategory) {
      questions();
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (categoryResponseApi) {
      setCategories(
        categoryResponseApi.map((category) => ({
          _id: category._id,
          title: category.title,
          description: category.description,
        }))
      );
    }
  }, [categoryResponseApi]);
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
  const handleRemoveQuestion = (index) => {
    const currentQuestions = formQuiz.getFieldValue("questions");
    const newQuestions = currentQuestions.filter((_, i) => i !== index);
    setFormattedQuestion(newQuestions);
    setSelectedSuggestQues(newQuestions);
    formQuiz.setFieldsValue({ questions: newQuestions });
  };
  const addNewSuggestQues = (question) => {
    const formatQues = {
      id: question._id,
      title: question.question,
      level: question.level,
      answer: question.answer,
      type: question.type,
      options: question.options.map((option) => ({
        isSelected: Array.isArray(question.answer)
          ? question.answer.includes(option)
          : option === question.answer,
        label: option,
      })),
    };

    console.log(formatQues);
    formQuiz.setFieldsValue({
      questions: [...formattedQuestion, formatQues],
    });
    setSelectedSuggestQues((prev) => [...prev, question]);
    setFormattedQuestion((prev) => [...prev, formatQues]);
  };
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

  const handleFinish = async (data) => {
    console.log(data);
    setIsLoading((prev) => true);
    await createQuizWithSuggestedQues(data)
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
    setIsLoading((prev) => false);
  };
  const handleCourseChange = (value) => {
    setSelectedCourseId(value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const fetchQuestions = async () => {
    if (selectedCategory) {
      const questionsData = await Axios({
        method: "GET",
        url: `/api/question/category/${selectedCategory?._id}`,
      });
      setSuggestedQuestion(questionsData.data.data);
    }
  };

  const handleCreateQuestionModalOk = async () => {
    setIsLoading(true);
    await fetchQuestions();
    setCreateQuestionModal(false);
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Spring>
          <Modal
            open={suggestionModal}
            okText="Finish"
            cancelText="Close"
            onCancel={() => setSuggestionModal(false)}
            onOk={() => setSuggestionModal(false)}
            className="min-h-[20rem] h-[20rem] w-auto"
          >
            <Flex justify="center" vertical={true} gap={10}>
              <Select
                placeholder="Select category"
                className="capitalize w-3/4"
                onSelect={(e) => {
                  const category = categories.find(
                    (category) => category.title == e
                  );
                  console.log(category);
                  setSelectedCategory(category);
                }}
              >
                {categories.map(({ title }, index) => (
                  <Select.Option value={title} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
              <p className="font-bold">Description</p>
              <p>{selectedCategory.description}</p>
              <div className="overflow-y-scroll max-h-[15rem] flex flex-col gap-5">
                {suggestedQuestion.map((question, index) => {
                  return (
                    <>
                      <Card key={question}>
                        <Flex
                          vertical={true}
                          flex={1}
                          justify="space-around"
                          gap={10}
                        >
                          <Flex vertical={false} justify="space-between">
                            <p className="text-base">
                              <span className="font-bold text-lg">
                                Question {index + 1}:
                              </span>{" "}
                              {question.question}
                            </p>
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() => addNewSuggestQues(question)}
                            />
                          </Flex>

                          <Flex vertical={true} gap={5} className="">
                            {question.options.map((opt, index) => (
                              <div
                                className={`py-2 rounded-xl pl-5 border-slate-200 border-[1px] ${
                                  Array.isArray(question.answer) &&
                                  question.answer.includes(opt)
                                    ? "bg-green-300"
                                    : ""
                                }`}
                                key={opt}
                              >
                                {index + 1}. {opt}
                              </div>
                            ))}
                          </Flex>
                        </Flex>
                      </Card>
                    </>
                  );
                })}
              </div>
            </Flex>
          </Modal>
          <Bread title="Add a new quiz" items={breadcrumb} />
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
                    <Col span={24}>
                      <Form.Item
                        name={"totalMarks"}
                        label={
                          <Typography.Title level={5}>
                            Total Marks
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
                            Pass Mark
                          </Typography.Title>
                        }
                      >
                        <InputNumber className="w-full" min={1} changeOnWheel />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name={"isReview"}
                        valuePropName="checked"
                        label={
                          <Typography.Title level={5}>
                            Check if students can review test
                          </Typography.Title>
                        }
                      >
                        <Checkbox />
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
                              <div>
                                <Button
                                  onClick={() => setSuggestionModal(true)}
                                >
                                  Add a New Question
                                </Button>
                                <span style={{ marginLeft: "10px" }}></span>{" "}
                                {/* Khoảng cách giữa nút */}
                                <Button
                                  type="primary"
                                  onClick={() => setCreateQuestionModal(true)}
                                >
                                  Create New Question
                                </Button>
                              </div>
                              <Button
                                htmlType="submit"
                                className="bg-[#754FFE] text-white"
                                size="large"
                              >
                                Save
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
                                  <Flex
                                    align="center"
                                    wrap="wrap"
                                    gap={8}
                                    flex={1}
                                  >
                                    <Typography.Title
                                      style={{
                                        marginBottom: 0,
                                        minWidth: "fit-content",
                                      }}
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
                                    <Flex gap={4}>
                                      <Form.Item
                                        name={[field.name, "level"]}
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
                                        onClick={() =>
                                          handleRemoveQuestion(index)
                                        }
                                        danger
                                        icon={<DeleteOutlined />}
                                      ></Button>
                                    </Flex>
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
                                              wrap="wrap"
                                              align="center"
                                              gap={5}
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
                                                  name={[
                                                    subField.name,
                                                    "label",
                                                  ]}
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
                                                    subOpt.remove(
                                                      subField.name
                                                    );
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
          <Modal
            open={createQuestionModal}
            title="Create New Question"
            onCancel={() => setCreateQuestionModal(false)}
            onOk={handleCreateQuestionModalOk}
            okText="Submit"
            cancelText="Cancel"
            width={1300}
          >
            <AddQuestion />
          </Modal>
        </Spring>
      )}
    </>
  );
};

export default AddQuiz;
