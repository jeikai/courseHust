import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  TimePicker,
  Typography,
  Card
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import Axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getQuizById, updateQuiz } from "../../api/quiz";
import { ViewContext } from "../../context/View";
import Loader from "../../components/Loader";
import Bread from "../../components/Bread";
import Spring from "../../components/Spring";
import { useAPI } from "../../hooks/api";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD HH:mm";
const timeFormat = "HH:mm:ss";

const EditQuiz = () => {
  const id = useParams().id;
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const viewContext = useContext(ViewContext);
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin_main/quiz",
    },
    {
      title: "Quiz",
    },
  ];

  const [formQuiz] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [initialForm, setInitialForm] = useState({});
  const [suggestionModal, setSuggestionModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestedQuestion, setSuggestedQuestion] = useState([]);
  const [formattedQuestion, setFormattedQuestion] = useState([]);
  const [selectedSuggestQues, setSelectedSuggestQues] = useState([]);
  const categoryResponseApi = useAPI(`/api/category`, null).data;
  const handleSetAsDefaultChange = (indexQuestion, indexOption) => {
    const fieldQuiz = formQuiz.getFieldsValue();
    const { questions } = fieldQuiz;
    if (questions[indexQuestion].type === "single") {
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
    console.log(questions);
  };

  const handleFinish = async (data) => {
    setIsLoading(true);
    data.id = id;
    console.log(data);
    await updateQuiz(data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    getQuizById(id)
      .then((data) => {
        console.log(data);
        setInitialForm({ ...data });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        viewContext.handleError(error);
      });
  }, [id]);

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

  const fetchQuestions = async (categoryId) => {
    const response = await Axios.get(`/api/question/category/${categoryId}`);
    setSuggestedQuestion(response.data.data);
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
    setFormattedQuestion((prev) => {
      const updatedQuestions = [...prev, formatQues];
      formQuiz.setFieldsValue({
        questions: updatedQuestions,
      });
      return updatedQuestions;
    });
    setSelectedSuggestQues((prev) => [...prev, question]);
    setSuggestionModal(false); // Close the modal after adding the question
  };
  
  // Make sure to update initial values in the form correctly
  useEffect(() => {
    if (initialForm.questions) {
      setFormattedQuestion(initialForm.questions);
    }
  }, [initialForm]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Spring>
          <Bread title="Edit a quiz" items={breadcrumb} />
          <div>
            {!isLoading && (
              <Form
                form={formQuiz}
                layout="vertical"
                initialValues={initialForm}
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
                          <TimePicker className="w-full" format={timeFormat} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="deadline"
                          label={
                            <Typography.Title level={5}>
                              Quiz deadline
                            </Typography.Title>
                          }
                        >
                          <DatePicker.RangePicker
                            className="w-full"
                            showTime={{ format: "HH:mm" }}
                            format={dateFormat}
                            onChange={(value, dateString) =>
                              console.log(value, dateString)
                            }
                            onOk={(value) => console.log(value)}
                            value={
                              initialForm.deadline
                                ? [
                                    dayjs(initialForm.deadline[0]),
                                    dayjs(initialForm.deadline[1]),
                                  ]
                                : []
                            }
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
                          <InputNumber
                            className="w-full"
                            min={1}
                            changeOnWheel
                          />
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
                          <InputNumber
                            className="w-full"
                            min={1}
                            changeOnWheel
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
                                  onClick={() => setSuggestionModal(true)}
                                >
                                  Add a new question
                                </Button>
                              </Flex>
                            </Col>
                            {fields.map((field, index) => {
                              const question = initialForm.questions[field.name];
                              const isEditable = true;

                              return (
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
                                            disabled={!isEditable}
                                          />
                                        </Form.Item>
                                      </Flex>
                                      <Flex
                                        vertical={false}
                                        gap={5}
                                        align="center"
                                      >
                                        <p className="font-bold">Level:</p>
                                        <Form.Item
                                          name={[field.name, "level"]}
                                          initialValue={"perception"}
                                          noStyle
                                        >
                                          <Select
                                            placeholder="Select question type"
                                            disabled={!isEditable}
                                          >
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
                                        {isEditable && (
                                          <Button
                                            onClick={() => remove(field.name)}
                                            danger
                                            icon={<DeleteOutlined />}
                                          ></Button>
                                        )}
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
                                                          colorPrimary:
                                                            "#754FFE",
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
                                                          disabled={!isEditable}
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
                                                        disabled={!isEditable}
                                                      />
                                                    </Form.Item>
                                                  </Flex>
                                                  {isEditable && subField.name === 0 && (
                                                    <Button
                                                      icon={<PlusOutlined />}
                                                      onClick={() => {
                                                        subOpt.add();
                                                      }}
                                                    ></Button>
                                                  )}
                                                  {isEditable && subField.name !== 0 && (
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
                              );
                            })}
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
      )}

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
                (category) => category.title === e
              );
              setSelectedCategory(category);
              fetchQuestions(category._id); // Fetch questions for the selected category
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
            {suggestedQuestion.map((question, index) => (
              <Card key={question._id}>
                <Flex vertical={true} flex={1} justify="space-around" gap={10}>
                  <Flex vertical={false} justify="space-between">
                    <p className="text-base">
                      <span className="font-bold text-lg">Question {index + 1}:</span>{" "}
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
            ))}
          </div>
        </Flex>
      </Modal>
    </>
  );
};

export default EditQuiz;
