import React, { useEffect, useState, useContext } from 'react';
import { Button, Col, Form, Input, Row, Select, DatePicker, TimePicker, InputNumber, Typography, Tabs, Table, Menu } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import axios from 'axios';
import { createQuiz } from '../../api/quiz';
import { useAPI } from '../../hooks/api';
import { ViewContext } from '../../context/View';
import Loader from '../../components/Loader';
import Bread from '../../components/Bread';
import Spring from '../../components/Spring';
const { TabPane } = Tabs;
const { SubMenu } = Menu;

const AutoQuiz = () => {
  const breadcrumb = [
    {
      title: 'Home',
      href: '/admin/quiz',
    },
    {
      title: 'Quiz',
    },
  ];

  const viewContext = useContext(ViewContext);
  const [formQuiz] = Form.useForm();
  const [course, setCourse] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedSection, setSelectedSection] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loadingGenQuiz, setLoadingGenQuiz] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const userId = JSON.parse(localStorage.getItem('user')).account;

  const handleAutoGenQuiz = async () => {
    setLoadingGenQuiz(true);
    const fetchQuiz = await axios.get(`/api/section/${selectedCourseId}/random-questions`);
    setGeneratedQuestions(fetchQuiz.data.randomQuestions);
    setLoadingGenQuiz(false);
  };

  const courseResponseApi = useAPI(`/api/course/instructor/${userId._id}`, null).data;

  useEffect(() => {
    if (courseResponseApi) {
      setCourse(courseResponseApi.map((course) => ({
        label: course.title,
        value: course._id,
      })));
    }
  }, [courseResponseApi]);

  useEffect(() => {
    if (selectedCourseId) {
      setSections([]);
      const selectedCourse = courseResponseApi.find((c) => c._id === selectedCourseId);
      if (selectedCourse) {
        setSections(selectedCourse.sections);
      } else {
        setSections([]);
      }
    }
    formQuiz.setFieldsValue({ section: null });
  }, [selectedCourseId, courseResponseApi]);

  const handleFinish = async (data) => {
    try {
      data = {
        ...data,
        preProcessQues: true,
        ques: generatedQuestions,
      };
      await createQuiz(data)
        .then((res) => {
          if (res === true) {
            viewContext.handleSuccess('Create quiz successfully!');
          } else if (res === false) {
            viewContext.handleError('Create quiz failed');
          } else {
            viewContext.handleError(res.error);
          }
        })
        .catch((err) => {
          viewContext.handleError(err);
        });
    } catch (error) {
      viewContext.handleError(error);
    }
  };

  const handleCourseChange = (value) => {
    setSelectedCourseId(value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleNext = async () => {
    try {
      const values = await formQuiz.validateFields();
      if (values) {
        setCurrentTab(currentTab + 1);
      }
    } catch (error) {
      message.error('Please fill out all required fields.');
    }
  };

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt' },
    { title: 'Nội dung kiến thức', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Đơn vị kiến thức', dataIndex: 'donVi', key: 'donVi' },
    { title: 'Vị trí trong đề', dataIndex: 'viTri', key: 'viTri' },
    { title: 'Nhận biết', dataIndex: 'nhanBiet', key: 'nhanBiet' },
    { title: 'Thông hiểu', dataIndex: 'thongHieu', key: 'thongHieu' },
    { title: 'Vận dụng', dataIndex: 'vanDung', key: 'vanDung' },
    { title: 'Vận dụng cao', dataIndex: 'vanDungCao', key: 'vanDungCao' },
    { title: 'Tổng số câu hỏi', dataIndex: 'tongSoCH', key: 'tongSoCH' },
    { title: 'Thời gian', dataIndex: 'thoiGian', key: 'thoiGian' },
    { title: '% Tổng điểm', dataIndex: 'phanTram', key: 'phanTram' },
  ];

  const data = [
    {
      key: '1',
      stt: '1',
      noiDung: 'Bài 1. Lũy thừa',
      donVi: 'Dạng 1. Tính giá trị của biểu thức chứa lũy thừa',
      viTri: '2',
      nhanBiet: '2',
      thongHieu: '',
      vanDung: '',
      vanDungCao: '',
      tongSoCH: '2',
      thoiGian: '',
      phanTram: '',
    },
    {
      key: '2',
      stt: '2',
      noiDung: 'Bài 2. Hàm số lũy thừa',
      donVi: 'Dạng 2. Đạo hàm hàm số lũy thừa',
      viTri: '1',
      nhanBiet: '1',
      thongHieu: '',
      vanDung: '',
      vanDungCao: '',
      tongSoCH: '1',
      thoiGian: '',
      phanTram: '',
    },
  ];

  return (
    <Spring>
      <Bread title="Add a new quiz" items={breadcrumb} />
      <div>
        <Form form={formQuiz} layout="vertical" onFinish={handleFinish}>
          <Tabs activeKey={String(currentTab)} onChange={(key) => setCurrentTab(Number(key))}>
            <TabPane tab="Step 1: Basic Information" key="0">
              <Row className="shadow-md border bg-white p-8">
                <Col span={24}>
                  <Form.Item name="title" label={<Typography.Title level={5}>Title</Typography.Title>} rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="duration" label={<Typography.Title level={5}>Quiz duration</Typography.Title>} rules={[{ required: true }]}>
                    <TimePicker className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="deadline" label={<Typography.Title level={5}>Quiz deadline</Typography.Title>} rules={[{ required: true }]}>
                    <DatePicker.RangePicker className="w-full" showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="course" label={<Typography.Title level={5}>Course</Typography.Title>} rules={[{ required: true }]}>
                    <Select showSearch placeholder="Select a course" optionFilterProp="children" filterOption={filterOption} options={course} onChange={handleCourseChange} size="large" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="section" label={<Typography.Title level={5}>Section</Typography.Title>} rules={[{ required: true }]}>
                    <Select showSearch onSelect={(e) => setSelectedSection(e)} placeholder="Select a section" optionFilterProp="children" filterOption={filterOption} options={sections.map((section) => ({ label: section.title, value: section._id }))} size="large" disabled={!selectedCourseId} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="totalMarks" label={<Typography.Title level={5}>Total Marks</Typography.Title>} rules={[{ required: true }]}>
                    <InputNumber className="w-full" min={1} changeOnWheel />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="passMarks" label={<Typography.Title level={5}>Pass Marks</Typography.Title>} rules={[{ required: true }]}>
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
              <Row>
                <Col span={6}>
                  <Menu
                    mode="inline"
                    style={{ height: '100%', borderRight: 0 }}
                    defaultOpenKeys={['sub1', 'sub2', 'sub3', 'sub4', 'sub5']}
                  >
                    <SubMenu key="sub1" icon={<FolderOpenOutlined />} title="Dạng 1. Tập xác định của hàm số chứa hàm lũy thừa (106)">
                      <Menu.Item key="1">Bài 1. Lũy thừa</Menu.Item>
                      <Menu.Item key="2">Bài 2. Hàm số lũy thừa</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<FolderOpenOutlined />} title="Dạng 2. Đạo hàm hàm số lũy thừa (17)">
                      <Menu.Item key="3">Bài 1. Lôgarit</Menu.Item>
                      <Menu.Item key="4">Bài 2. Hàm số mũ, hàm số lôgarit</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<FolderOpenOutlined />} title="Bài 3. Lôgarit (391)">
                      <Menu.Item key="5">Bài 3. Phương trình mũ và phương trình lôgarit</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<FolderOpenOutlined />} title="Bài 4. Hàm số mũ, hàm số lôgarit (545)">
                      <Menu.Item key="6">Dạng 1. Phương trình cơ bản</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub5" icon={<FolderOpenOutlined />} title="Bài 5. Phương trình mũ và phương trình lôgarit (586)">
                      <Menu.Item key="7">Dạng 2. Phương pháp đưa về cùng cơ số</Menu.Item>
                    </SubMenu>
                  </Menu>
                </Col>
                <Col span={18}>
                  <Table columns={columns} dataSource={data} pagination={false} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Step 3: Review & Submit" key="2">
              <Row>
                <Col span={24}>
                  <Typography.Title level={4}>Review Your Quiz</Typography.Title>
                  {/* You can add more review details here */}
                  <Button type="primary" htmlType="submit">
                    Submit Quiz
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
