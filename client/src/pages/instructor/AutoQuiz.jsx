import { useEffect, useState } from 'react';
import Bread from '../../components/Bread';
import {
	Button,
	Col,
	ConfigProvider,
	DatePicker,
	Flex,
	Form,
	Input,
	Row,
	Select,
	Switch,
	TimePicker,
	InputNumber,
	Typography,
} from 'antd';
import Loader from '../../components/Loader';
import { DeleteOutlined } from '@ant-design/icons';
import Spring from '../../components/Spring';
import { createQuiz } from '../../api/quiz';
import { useAPI } from '../../hooks/api';
import { ViewContext } from '../../context/View';
import { useContext } from 'react';
import axios from 'axios';
const AutoQuiz = () => {
	const breadcrumb = [
		{
			title: 'Home',
			href: '',
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
	const userId = JSON.parse(localStorage.getItem('user')).account;
	const handleAutoGenQuiz = async () => {
		setLoadingGenQuiz(true);
		const fetchQuiz = await axios.get(
			`/api/section/${selectedSection}/random-questions`
		);
		console.log('quiz fetch', fetchQuiz.data.randomQuestions);
		const quizzes = fetchQuiz.data.randomQuestions;

		setGeneratedQuestions(quizzes);
		setLoadingGenQuiz(false);
		console.log('Generated Quiz', generatedQuestions);
		return;
	};
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

	const handleFinish = async (data) => {
		console.log(data);
		data = {
			...data,
			preProcessQues: true,
			ques: generatedQuestions,
		};
		console.log('submit data', data);
		await createQuiz(data)
			.then((res) => {
				if (res == true) {
					viewContext.handleSuccess('Create quiz successfully!');
				} else if (res == false) {
					viewContext.handleError('Create quiz failed');
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
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	const QuizAnswer = ({ answer, correct }) => {
		return (
			<>
				<Flex>
					<Flex align="center" justify="space-between" className="w-full">
						<Flex align="center" gap={12}>
							<ConfigProvider
								theme={{
									components: {
										Switch: {
											// handleBg: '#ccc'
										},
									},
									token: {
										colorPrimary: '#754FFE',
									},
								}}>
								<Switch onChange={() => {}} checked={correct} disabled></Switch>
							</ConfigProvider>

							<Input
								placeholder="Question title"
								value={`${answer}`}
								style={{ width: 400 }}
							/>
						</Flex>
					</Flex>
				</Flex>
			</>
		);
	};

	const Quiz = ({ quiz, index }) => {
		return (
			<>
				<Flex
					align="center"
					justify="space-between"
					style={{ marginBottom: 12 }}>
					<Flex align="center" gap={8} flex={1}>
						<Typography.Title style={{ marginBottom: 0 }} level={5}>
							Question {index + 1}:
						</Typography.Title>
						<Form.Item style={{ marginBottom: 0 }}>
							<Input
								placeholder="Title here"
								value={quiz.question}
								style={{ width: '400px' }}
							/>
						</Form.Item>
					</Flex>
					<Flex gap={4}>
						<Select placeholder="Select question type" value={quiz.level}>
							<Select.Option value="perception">Perception</Select.Option>
							<Select.Option value="comprehension">Comprehension</Select.Option>
							<Select.Option value="application">Application</Select.Option>
							<Select.Option value="advanced application">
								Advanced application
							</Select.Option>
						</Select>
						<Button danger icon={<DeleteOutlined />}></Button>
					</Flex>
				</Flex>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						rowGap: 16,
					}}>
					{quiz.options.map((option) => (
						<QuizAnswer
							answer={option}
							correct={quiz.answer == option}
							key={option}
						/>
					))}
				</div>
			</>
		);
	};

	return (
		<Spring>
			<Bread title="Add a new quiz" items={breadcrumb} />
			<div>
				<Form form={formQuiz} layout="vertical" onFinish={handleFinish}>
					<Row gutter={12}>
						<Col span={8}>
							<Row className="shadow-md border bg-white p-8">
								<Col span={24}>
									<Form.Item
										name={'title'}
										label={
											<Typography.Title level={5}>Title</Typography.Title>
										}>
										<Input />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										name={'duration'}
										label={
											<Typography.Title level={5}>
												Quiz duration
											</Typography.Title>
										}>
										<TimePicker className="w-full" />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										name={'deadline'}
										label={
											<Typography.Title level={5}>
												Quiz deadline
											</Typography.Title>
										}>
										<DatePicker.RangePicker
											className="w-full"
											showTime={{
												format: 'HH:mm',
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
										name={'course'}
										label={
											<Typography.Title level={5}>Course</Typography.Title>
										}>
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
										name={'section'}
										label={
											<Typography.Title level={5}>Section</Typography.Title>
										}>
										<Select
											showSearch
											onSelect={(e) => {
												setSelectedSection(e);
											}}
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
										name={'totalMarks'}
										label={
											<Typography.Title level={5}>Total Marks</Typography.Title>
										}>
										<InputNumber className="w-full" min={1} changeOnWheel />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										name={'passMarks'}
										label={
											<Typography.Title level={5}>Pass Marks</Typography.Title>
										}>
										<InputNumber className="w-full" min={1} changeOnWheel />
									</Form.Item>
								</Col>
							</Row>
						</Col>
						<Col span={16}>
							<Row className="shadow-md border bg-white p-8">
								<Row gutter={[12, 12]} className="w-full">
									<Col span={24}>
										<Flex align="center" justify="space-between">
											<Button
												htmlType="submit"
												className="bg-[#754FFE] text-white"
												size="large">
												Save
											</Button>
											<Button
												className=""
												size="large"
												disabled={selectedSection == ''}
												onClick={() => {
													handleAutoGenQuiz();
												}}>
												Auto generate
											</Button>
										</Flex>
									</Col>
									<Col span={24}>
										{loadingGenQuiz && <Loader />}
										{generatedQuestions != [] ? (
											generatedQuestions.map((quiz, index) => (
												<Quiz quiz={quiz.data} index={index} key={index} />
											))
										) : (
											<></>
										)}
									</Col>
								</Row>
							</Row>
						</Col>
					</Row>
				</Form>
			</div>
		</Spring>
	);
};

export default AutoQuiz;
