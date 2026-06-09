import React, { Fragment, useEffect, useState, useContext } from "react";
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
import Card from "antd/es/card/Card";
import Question from "../../components/Question";
import Spring from "../../components/Spring";
import scq from "../../assets/scq.svg";
import mcq from "../../assets/mcq.svg";
import fill from "../../assets/fill.svg";
import FormItem from "antd/es/form/FormItem";
import { createQuestions } from "../../api/quiz";
import { useAPI } from "../../hooks/api";
import { ViewContext } from "../../context/View";
import Loader from "../../components/Loader";
import { en } from "@faker-js/faker";

const AddQuestion = () => {
  const breadcrumb = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Quiz",
    },
  ];
  const userId = JSON.parse(localStorage.getItem("user"))?.account?._id;
  const viewContext = useContext(ViewContext);
  const [formQuiz] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [enableAddAnswers, setEnableAddAnswers] = useState([]);
  const [enableMultipleChoice, setEnableMultipleChoice] = useState([]);
  const [isSelectedType, setIsSelectedType] = useState([]);
  const categoryResponseApi = useAPI(`/api/category`, null).data;

  useEffect(() => {
    if (categoryResponseApi) {
      setCategories(
        categoryResponseApi.map((category) => ({
          _id: category._id,
          title: category.title,
          description: category.description,
          subCategory: category.subCategory,
        }))
      );
    }
  }, [categoryResponseApi]);

  const handleSetAsDefaultChange = (indexQuestion, indexOption, index) => {
    const fieldQuiz = formQuiz.getFieldsValue();
    const { questions } = fieldQuiz;
    if (enableMultipleChoice[index] === undefined) {
      enableMultipleChoice[index] = false;
    }
    console.log(enableMultipleChoice[index]);
    questions[index].options = questions[index].options.map(
      (option, i) => {
        if (enableMultipleChoice[index] === false) {
          option.isSelected = indexOption === i;
        } else {
          if (i === indexOption && option.isSelected) {
            option.isSelected = option.isSelected;
          }
        }
        return option;
      }
    );

    formQuiz.setFieldsValue({ questions });
  };

  const handleFinish = (data) => {
    console.log(data);
    setIsLoading(true);
    createQuestions(data, userId)
      .then((res) => {
        if (res === true) {
          viewContext.handleSuccess("Create questions successfully!");
          formQuiz.resetFields();
          formQuiz.setFieldsValue({ questions: [] });
        } else if (res === false) {
          viewContext.handleError("Create question failed");
        } else {
          viewContext.handleError(res.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        viewContext.handleError(err);
      });
  };

  const handleValuesChange = (_, allValues) => {
    const updatedSelectedCategories = {};
    allValues.questions?.forEach((question, index) => {
      console.log(question);
      if (question?.category) {
        updatedSelectedCategories[index] =
          categories.find((cat) => cat._id === question.category)
            ?.subCategory || [];
      }
    });
    setSelectedCategories(updatedSelectedCategories);
  };

  if (isLoading) return <Loader />;
  return (
    <Spring>
      <Bread title="Add a new quiz" items={breadcrumb} />
      <div>
        <Form
          form={formQuiz}
          layout="vertical"
          onValuesChange={handleValuesChange}
          onFinish={handleFinish}
        >
          <Row gutter={12} justify={"center"}>
            <Col span={16}>
              <Row className="shadow-md border bg-white p-8" style={{ width: "950px" }}>
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
                            onClick={() => {
                              add();
                            }}
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
                              <Flex align="center" wrap="wrap" gap={8} flex={1}>
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
                                <Flex
                                  gap={20}
                                  vertical={false}
                                  justify="space-between"
                                >
                                  <Flex vertical={false} gap={5} align="center">
                                    <p className="font-bold">Category:</p>
                                    <Form.Item
                                      name={[field.name, "category"]}
                                      noStyle
                                    >
                                      <Select
                                        placeholder="Select category"
                                        className="capitalize"
                                        onSelect={(e) =>
                                          console.log("event", e)
                                        }
                                      >
                                        {categories.map(
                                          ({ _id, title }, index) => (
                                            <Select.Option
                                              value={_id}
                                              key={index}
                                            >
                                              {title}
                                            </Select.Option>
                                          )
                                        )}
                                      </Select>
                                    </Form.Item>
                                  </Flex>
                                  <Flex vertical={false} gap={5} align="center">
                                    <p className="font-bold">Subcategory:</p>
                                    <Form.Item
                                      name={[field.name, "subcategory"]}
                                      noStyle
                                    >
                                      <Select
                                        placeholder="Select subcategory"
                                        className="capitalize"
                                        disabled={
                                          !selectedCategories[index]?.length
                                        }
                                      >
                                        {selectedCategories[index]?.map(
                                          (subcat, idx) => (
                                            <Select.Option
                                              value={subcat._id}
                                              key={idx}
                                            >
                                              {subcat.title}
                                            </Select.Option>
                                          )
                                        )}
                                      </Select>
                                    </Form.Item>
                                  </Flex>
                                  <Flex vertical={false} gap={5} align="center">
                                    <p className="font-bold">Level:</p>
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
                                    {/* <Button
                                      onClick={() => remove(field.name)}
                                      danger
                                      icon={<DeleteOutlined />}
                                    ></Button> */}
                                  </Flex>

                                  {/* Choose type of choice */}
                                  <Flex vertical={false} gap={5} align="center">
                                    <p className="font-bold">Type:</p>
                                    <Form.Item
                                      name={[field.name, "kind"]}
                                      initialValue={"single"}
                                      noStyle
                                    >
                                      <Select
                                        onChange={(value) => {
                                          const newIsSelectedType = [
                                            ...isSelectedType,
                                          ];
                                          const newEnableAddAnswers = [
                                            ...enableAddAnswers,
                                          ];
                                          const newEnableMultiple = [
                                            ...enableMultipleChoice,
                                          ];
                                          newIsSelectedType[index] = true;
                                          setIsSelectedType(newIsSelectedType);
                                          value === "text"
                                            ? (newEnableAddAnswers[
                                                index
                                              ] = false)
                                            : (newEnableAddAnswers[
                                                index
                                              ] = true);
                                          value === "multiple"
                                            ? (newEnableMultiple[index] = true)
                                            : (newEnableMultiple[
                                                index
                                              ] = false);
                                          setEnableAddAnswers(
                                            newEnableAddAnswers
                                          );
                                          setEnableMultipleChoice(
                                            newEnableMultiple
                                          );
                                        }}
                                        placeholder="Select kind of question"
                                        disabled={
                                          isSelectedType[index] === undefined
                                            ? false
                                            : isSelectedType[index]
                                        }
                                      >
                                        <Select.Option value="multiple">
                                          Multiple choice
                                        </Select.Option>
                                        <Select.Option value="single">
                                          Single choice
                                        </Select.Option>
                                        <Select.Option value="text"></Select.Option>
                                      </Select>
                                    </Form.Item>
                                    <Button
                                      onClick={() => {
                                        const deletedIsSelectedType = [...isSelectedType];
                                        const deletedEnableMultiple = [...enableAddAnswers];
                                        const deletedEnableAddAnswers = [...enableAddAnswers];
                                        console.log("deletedIsSelectedType", deletedIsSelectedType, deletedEnableAddAnswers, deletedEnableMultiple)
                                        if (enableAddAnswers.length === 0 && index === enableAddAnswers.length -1) {
                                          deletedIsSelectedType[index] = false;
                                          deletedEnableMultiple[index] = false;
                                          deletedEnableAddAnswers[index] = true
                                        } else {
                                          console.log("aaaaaaa", index)
                                          for (let i = index; i < enableAddAnswers.length-1; i++) {
                                            if (deletedIsSelectedType[i+1] !== undefined) {
                                              deletedIsSelectedType[i] = deletedIsSelectedType[i+1]
                                            } else {
                                              deletedIsSelectedType[i] = false;
                                            }

                                            if (deletedEnableMultiple[i+1] !== undefined) {
                                              deletedEnableMultiple[i] = deletedEnableMultiple[i+1];
                                            } else {
                                              deletedEnableMultiple[i] = false;
                                            }

                                            if (deletedEnableAddAnswers[i+1] !== undefined) {
                                              deletedEnableAddAnswers[i] = deletedEnableAddAnswers[i+1]
                                            } else {
                                              deletedEnableAddAnswers[i] = true;
                                            }
                                          }
                                          deletedIsSelectedType[enableAddAnswers.length-1] = false;
                                          deletedEnableMultiple[enableAddAnswers.length-1] = false;
                                          deletedEnableAddAnswers[enableAddAnswers.length-1] = true
                                        }
                                        // deletedIsSelectedType[index] = false;
                                        setEnableAddAnswers(deletedEnableAddAnswers);
                                        setEnableMultipleChoice(deletedEnableAddAnswers);
                                        setIsSelectedType(deletedIsSelectedType)
                                        console.log("after", isSelectedType, enableAddAnswers, enableMultipleChoice)
                                        remove(field.name)}
                                      }
                                      danger
                                      icon={<DeleteOutlined />}
                                    ></Button>
                                  </Flex>
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
                                                      subField.key,
                                                      index
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
                                          {(enableAddAnswers[index] === true ||
                                            enableAddAnswers[index] ===
                                              undefined) &&
                                            subField.name === 0 && (
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

export default AddQuestion;
