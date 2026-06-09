import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Typography,
  Tabs,
  Table,
  Menu,
  Radio,
  message,
  Checkbox
} from "antd";
import {
  FolderOpenOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Axios from "axios";
import { createQuiz } from "../../api/quiz";
import { useAPI } from "../../hooks/api";
import { ViewContext } from "../../context/View";
import Loader from "../../components/Loader";
import Bread from "../../components/Bread";
import Spring from "../../components/Spring";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const { SubMenu } = Menu;

const EditableCell = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  let childNode = children;

  const handleChange = (value) => {
    const updatedRecord = { ...record, [dataIndex]: value };
    handleSave(updatedRecord);
  };

  if (editable) {
    childNode = (
      <InputNumber value={record[dataIndex]} onChange={handleChange} />
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const AutoQuiz = () => {
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin_main/quiz",
    },
    {
      title: "Quiz",
    },
  ];
  const navigate = useNavigate();
  const viewContext = useContext(ViewContext);
  const [formQuiz] = Form.useForm();
  const [course, setCourse] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loadingGenQuiz, setLoadingGenQuiz] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [remainingQuestions, setRemainingQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user")).account;

  const courseResponseApi = useAPI(
    `/api/course/instructor/${userId._id}`,
    null
  ).data;

  const categoryResponseApi = useAPI(
    `/api/category/number_question`,
    null
  )?.data;
  console.log(categoryResponseApi);
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

  const handleFinish = async () => {
    try {
      console.log(formQuiz.getFieldsValue());
      const formData = formQuiz.getFieldsValue();
      const data = {
        title: formData.title,
        deadline: formData.deadline,
        section: formData.section,
        duration: formData.duration,
        totalMarks: formData.totalMarks,
        questions: questions,
        passMarks: formData.passMarks,
        ques: questions,
      };
      console.log("submit data", data);
      await createQuiz(data)
        .then((res) => {
          if (res == true) {
            viewContext.handleSuccess("Create quiz successfully!");
            navigate("/admin_main/quiz");
          } else if (res == false) {
            console.log(res.error);
            viewContext.handleError("Create quiz failed");
          } else {
            viewContext.handleError(res.error);
          }
        })
        .catch((err) => {
          console.log(err);
          viewContext.handleError(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCourseChange = (value) => {
    setSelectedCourseId(value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleNext = async () => {
    try {
      const values = await formQuiz.validateFields();
      if (values) {
        setTotalQuestions(values.totalQuestions);
        setRemainingQuestions(values.totalQuestions);
        setCurrentTab(currentTab + 1);
      }
      console.log(values, formQuiz);
    } catch (error) {
      message.error("Please fill out all required fields.");
    }
  };

  const handleMenuClick = (item) => {
    const totalItems =
      item.perception +
      item.comprehensive +
      item.application +
      item["advanced application"];
    if (remainingQuestions - totalItems < 0) {
      message.error(
        "Cannot add more questions. Total number of questions exceeded."
      );
      return;
    }
    const newItem = {
      key: item._id,
      stt: tableData.length + 1,
      noiDung: item.title,
      donVi: item.title,
      nhanBiet: item.perception,
      thongHieu: item.comprehensive,
      vanDung: item.application,
      vanDungCao: item["advanced application"],
    };
    if (!tableData.some((data) => data.noiDung === newItem.noiDung)) {
      setTableData([...tableData, newItem]);
      setRemainingQuestions(remainingQuestions - totalItems);
    }
  };

  const handleDelete = (key) => {
    const deletedItem = tableData.find((item) => item.key === key);
    const totalItems =
      deletedItem.nhanBiet +
      deletedItem.thongHieu +
      deletedItem.vanDung +
      deletedItem.vanDungCao;
    setRemainingQuestions(remainingQuestions + totalItems);
    setTableData(tableData.filter((item) => item.key !== key));
  };

  const handleSave = (row) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    const totalItemsChanged =
      row.nhanBiet +
      row.thongHieu +
      row.vanDung +
      row.vanDungCao -
      (item.nhanBiet + item.thongHieu + item.vanDung + item.vanDungCao);

    if (remainingQuestions - totalItemsChanged < 0) {
      message.error(
        "Cannot update. Total remaining questions would be negative."
      );
      return;
    }

    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    setTableData(newData);
    setRemainingQuestions(remainingQuestions - totalItemsChanged);
  };

  const handleNextStep2 = async () => {
    setLoadingGenQuiz(true);
    const totalItemsInTable = tableData.reduce(
      (sum, item) =>
        sum + item.nhanBiet + item.thongHieu + item.vanDung + item.vanDungCao,
      0
    );
    if (
      tableData.length > 0 &&
      totalItemsInTable <= totalQuestions &&
      remainingQuestions <= totalQuestions
    ) {
      // call api in here
      const dataToSend = tableData.map((item) => ({
        categoryId: item.key,
        perception: item.nhanBiet,
        comprehensive: item.thongHieu,
        application: item.vanDung,
        advancedApplication: item.vanDungCao,
      }));
      console.log(dataToSend);
      try {
        // Call API to send data
        const response = await Axios({
          url: "/api/question/autoquiz/getQues",
          method: "POST",
          data: dataToSend,
        });
        console.log(response);

        if (response.status === 200) {
          message.success("Get questions successfully.");
          setQuestions(response?.data?.data);
          setCurrentTab(currentTab + 1);
        } else {
          message.error("Failed to get questions. Please try again.");
        }
        setLoadingGenQuiz(false);
        setCurrentTab(currentTab + 1);
      } catch (error) {
        setLoadingGenQuiz(false);
        message.error("Error saving questions: " + error.message);
      }
    } else {
      setLoadingGenQuiz(false);
      message.error(
        "Please ensure there is at least one question in the table and the total number of questions does not exceed the specified limit."
      );
    }
  };

  const columns = [
    { title: "Index", dataIndex: "stt", key: "stt" },
    { title: "Knowledge content", dataIndex: "noiDung", key: "noiDung" },
    {
      title: "Perception",
      dataIndex: "nhanBiet",
      key: "nhanBiet",
      editable: true,
    },
    {
      title: "Comprehension",
      dataIndex: "thongHieu",
      key: "thongHieu",
      editable: true,
    },
    {
      title: "Application",
      dataIndex: "vanDung",
      key: "vanDung",
      editable: true,
    },
    {
      title: "Advanced application",
      dataIndex: "vanDungCao",
      key: "vanDungCao",
      editable: true,
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const renderSingleChoice = (question, index) => (
    <div>
      {question.options.map((option, optIndex) => (
        <div
          key={optIndex}
          style={{
            color: question.answer[0] === option ? "green" : "black",
          }}
        >
          {option}
        </div>
      ))}
    </div>
  );

  const renderMultipleChoice = (question, index) => (
    <div>
      {question.options.map((option, optIndex) => (
        <div
          key={optIndex}
          style={{
            color: question.answer.includes(option) ? "green" : "black",
          }}
        >
          {option}
        </div>
      ))}
    </div>
  );

  const renderTextAnswer = (question, index) => (
    <div>
      <Typography.Text>{question.answer[0]}</Typography.Text>
    </div>
  );

  return (
    <Spring>
      <Bread title="Add a new quiz" items={breadcrumb} />
      <div>
        <Form form={formQuiz} layout="vertical">
          <Tabs
            activeKey={String(currentTab)}
            // onChange={(key) => setCurrentTab(Number(key))}
          >
            <TabPane tab="Step 1: Basic Information" key="0">
              <Row className="shadow-md border bg-white p-8">
                <Col span={24}>
                  <Form.Item
                    name="title"
                    label={<Typography.Title level={5}>Title</Typography.Title>}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="duration"
                    label={
                      <Typography.Title level={5}>
                        Quiz duration
                      </Typography.Title>
                    }
                    rules={[{ required: true }]}
                  >
                    <TimePicker className="w-full" />
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
                      format="YYYY-MM-DD HH:mm"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="course"
                    label={
                      <Typography.Title level={5}>Course</Typography.Title>
                    }
                    rules={[{ required: true }]}
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
                    name="section"
                    label={
                      <Typography.Title level={5}>Section</Typography.Title>
                    }
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      onSelect={(e) => setSelectedSection(e)}
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
                    name="totalMarks"
                    label={
                      <Typography.Title level={5}>Total Marks</Typography.Title>
                    }
                    rules={[{ required: true }]}
                  >
                    <InputNumber className="w-full" min={1} changeOnWheel />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="passMarks"
                    label={
                      <Typography.Title level={5}>Pass Marks</Typography.Title>
                    }
                    rules={[{ required: true }]}
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
                <Col span={24}>
                  <Form.Item
                    name="totalQuestions"
                    label={
                      <Typography.Title level={5}>
                        Total Number of Questions
                      </Typography.Title>
                    }
                    rules={[{ required: true }]}
                  >
                    <InputNumber className="w-full" min={1} changeOnWheel />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Button type="primary" onClick={handleNext}>
                    Next
                  </Button>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Step 2: Quiz Questions" key="1">
              <Row className="shadow-md border bg-white p-8">
                <Col
                  span={24}
                  style={{ textAlign: "right", marginBottom: "20px" }}
                >
                  <Typography.Text>
                    Total number of questions: {totalQuestions || 0}
                  </Typography.Text>
                  <Typography.Text style={{ marginLeft: "20px" }}>
                    Remaining questions: {remainingQuestions}
                  </Typography.Text>
                </Col>
                <Col span={6}>
                  <Menu
                    mode="inline"
                    style={{ height: "100%", borderRight: 0 }}
                    defaultOpenKeys={["sub1", "sub2", "sub3", "sub4", "sub5"]}
                  >
                    {categoryResponseApi?.map((category) => {
                      return (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClick(category);
                            }}
                          />
                          <SubMenu
                            key={category?._id}
                            icon={<FolderOpenOutlined />}
                            title={<span>{category?.title}</span>}
                          >
                            {category?.subCategory.map((subcategory) => {
                              return (
                                <Menu.Item
                                  key={subcategory?._id}
                                  onClick={() => handleMenuClick(subcategory)}
                                >
                                  {subcategory?.title}
                                </Menu.Item>
                              );
                            })}
                          </SubMenu>
                        </div>
                      );
                    })}
                  </Menu>
                </Col>
                <Col span={18}>
                  <Table
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    bordered
                    dataSource={tableData}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                  />
                </Col>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleNextStep2}
                  >
                    Next
                  </Button>
                </Form.Item>
              </Row>
            </TabPane>
            <TabPane tab="Step 3: Review & Submit" key="2">
              <Row className="shadow-md border bg-white p-8">
                <Col span={24}>
                  <Typography.Title level={4}>
                    Review Your Test
                  </Typography.Title>
                  <div>
                    {questions.map((question, index) => (
                      <>
                        <Typography.Title level={5} style={{ color: "black" }}>
                          {question?.question}
                        </Typography.Title>
                        {question.type === "single" &&
                          renderSingleChoice(question, index)}
                        {question.type === "multiple" &&
                          renderMultipleChoice(question, index)}
                        {question.type === "text" &&
                          renderTextAnswer(question, index)}
                      </>
                    ))}
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleFinish}
                  >
                    Submit Test
                  </Button>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
        {loadingGenQuiz && <Loader />}
      </div>
    </Spring>
  );
};

export default AutoQuiz;
