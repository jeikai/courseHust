import React, {
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
  } from "react";
  import Bread from "../../components/Bread";
  import Loader from "../../components/Loader";
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
    message,
    Row,
    Select,
    Switch,
    TimePicker,
    Typography,
  } from "antd";
  import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
  import Spring from "../../components/Spring";
  import { getQuizById, updateQuiz } from "../../api/quiz";
  import { useParams } from "react-router-dom";
  import { ViewContext } from "../../context/View";
  import { useContext } from "react";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import Axios from "axios";
  import { getQuestionById, updateQuestion } from "../../api/question";
  import { useAPI } from "../../hooks/api";
  
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD HH:mm";
  const timeFormat = "HH:mm:ss";
  
  const SelectComponent = (props) => (
    <div className="w-full flex flex-row items-center flex-[0] gap-2">
      <p className="font-bold capitalize">{props.title}:</p>
      <Form.Item name={props.name} noStyle>
        <Select
          placeholder={props.placeholder}
          onSelect={props.onSelect}
          className="min-w-[6rem]"
        >
          {props.options.map((option, index) => (
            <Select.Option value={option} key={index}>
              <span className="capitalize">{option}</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
  
  const EditQuestion = () => {
    const id = useParams().id;
    const userId = JSON.parse(localStorage.getItem("user")).account._id;
    const viewContext = useContext(ViewContext);
    const breadcrumb = [
      {
        title: "Home",
        href: "/admin/question",
      },
      {
        title: "Question",
      },
    ];
    const [formQuestion] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCagories] = useState([]);
    const [settings, setSettings] = useState({
      category: "",
      subcategory: [],
      level: "",
      type: "",
    });
  
    const getCagories = async () => {
      const responseGetCategories = await Axios({
        method: "GET",
        url: "/api/category",
      });
  
      setCagories([...responseGetCategories.data]);
      return responseGetCategories.data;
    };
  
    const handleSetAsDefaultChange = (
      indexQuestion,
      indexOption,
      isText = false
    ) => {
      const question = formQuestion.getFieldsValue();
      if (isText) {
        question.options = question.options.map((option, i) => {
          if (i === 0) {
            option.isSelected = true;
          } else {
            option.isSelected = false;
          }
          return option;
        });
        formQuestion.setFieldsValue(question);
        return;
      }
      if (question.type === "single") {
        question.options = question.options.map((option, i) => {
          if (indexOption === i) {
            option.isSelected = true;
          } else {
            option.isSelected = false;
          }
          return option;
        });
      }
      formQuestion.setFieldsValue(question);
    };
  
    const getSubCategory = (event, categories) => {
      let subArray = [];
      categories.forEach((category) => {
        if (category.title == event) {
          setSettings((prev) => ({
            ...prev,
            subcategory: [...category.subCategory],
          }));
  
          subArray = category.subCategory;
        }
      });
      formQuestion.setFieldValue("subcategory", "");
      return subArray;
    };
    const handleFinish = async (data) => {
      setIsLoading(true);
      // data.id = id;
      console.log(data);
      const reqCategory = categories.find(
        (category) => category.title == data.category
      );
  
      const reqSubcategory = reqCategory.subCategory.find(
        (sub) => sub.title == data.subcategory
      );
      data.questionId = id;
      data.categoryId = reqCategory._id;
      data.subcategoryId = reqSubcategory?._id || "";
  
      await updateQuestion(data);
      message.success("Update successfully")
      setIsLoading(false);
    };
  
    useLayoutEffect(() => {
      setIsLoading(true);
      getCagories().then(async (cats) => {
        await getQuestionById(id)
          .then((response) => {
            if (response.data) {
              const subCate = getSubCategory(response.data.category.title, cats);
              setSettings((prev) => ({
                category: response.data.category.title,
                subcategory: [...subCate],
                level: response.data.level,
                type: response.data.type,
              }));
              formQuestion.setFieldsValue({
                ...response.data,
                category: response.data.category.title,
                subcategory: response.data.subcategory.title,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            viewContext.handleError(error);
          });
      });
      setIsLoading(false);
    }, [id]);
  
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <Spring>
            <Bread title="Edit a question" items={breadcrumb} />
            <div className="ml-auto mr-auto w-1/2">
              {!isLoading && (
                <Form
                  form={formQuestion}
                  layout="vertical"
                  onFinish={handleFinish}
                  className=""
                >
                  <Row className="shadow-md border bg-white p-8 w-full">
                    <Row gutter={[12, 12]} className="w-full">
                      <Button
                        htmlType="submit"
                        className="bg-[#754FFE] text-white ml-auto"
                        size="large"
                      >
                        Save
                      </Button>
  
                      <Col span={24} className="w-full">
                        <Flex
                          align=""
                          justify=""
                          className="w-full"
                          vertical={true}
                          gap={10}
                          style={{ marginBottom: 12 }}
                        >
                          <Flex
                            className="w-full"
                            align="center"
                            gap={8}
                            flex={1}
                            vertical={false}
                          >
                            <p className="font-bold">Title:</p>
                            <Form.Item
                              className="w-1/2"
                              style={{ marginBottom: 0 }}
                              name={"question"}
                            >
                              <Input
                                className="min-w-[20rem] max-w-[25rem]"
                                placeholder="Question title"
                              />
                            </Form.Item>
                          </Flex>
                          <div className="w-full justify-start flex flex-[0] gap-3 items-center flex-wrap">
                            <SelectComponent
                              name="level"
                              title="level"
                              options={[
                                "perception",
                                "comprehension",
                                "application",
                                "advanced application",
                              ]}
                            />
                            <SelectComponent
                              name="category"
                              title="category"
                              placeholder="Select category"
                              options={categories.map(
                                (category) => category.title
                              )}
                              onSelect={(e) => {
                                setSettings((prev) => ({
                                  ...prev,
                                  category: e,
                                }));
                                getSubCategory(e, categories);
                              }}
                            />
                            <SelectComponent
                              name="subcategory"
                              title="subcategory"
                              placeholder="Select Subcategory"
                              options={settings.subcategory.map(
                                (sub) => sub.title
                              )}
                            />
                            <SelectComponent
                              name="type"
                              title="type"
                              placeholder="Select Type"
                              onSelect={(e) => {
                                setSettings((prev) => ({
                                  ...prev,
                                  type: e,
                                }));
                                if (e == "text") {
                                  handleSetAsDefaultChange(0, 0, true);
                                }
                              }}
                              options={["single", "multiple", "text"]}
                            />
                          </div>
                        </Flex>
                        <Form.Item>
                          <Form.List
                            name={"options"}
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
                                            token: {
                                              colorPrimary: "#754FFE",
                                            },
                                          }}
                                        >
                                          <Form.Item
                                            noStyle
                                            name={[subField.name, "isSelected"]}
                                            valuePropName="checked"
                                          >
                                            <Switch
                                              onChange={() =>
                                                handleSetAsDefaultChange(
                                                  0,
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
                                            disabled={
                                              settings.type == "text" &&
                                              subField.key != 0
                                            }
                                            placeholder="Question title"
                                            className="min-w-[20rem] max-w-[25rem]"
                                          />
                                        </Form.Item>
                                      </Flex>
                                      {true && subField.name === 0 && (
                                        <Button
                                          icon={<PlusOutlined />}
                                          onClick={() => {
                                            subOpt.add();
                                          }}
                                          disabled={settings.type == "text"}
                                        />
                                      )}
                                      {true && subField.name !== 0 && (
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
                    </Row>
                  </Row>
                </Form>
              )}
            </div>
          </Spring>
        )}
      </>
    );
  };
  
  export default EditQuestion;
  