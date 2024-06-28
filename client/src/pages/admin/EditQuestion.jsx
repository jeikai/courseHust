import React, { Fragment, useEffect, useState } from 'react';
import Bread from '../../components/Bread';
import Loader from '../../components/Loader';
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
	Row,
	Select,
	Switch,
	TimePicker,
	Typography,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Spring from '../../components/Spring';
import { getQuizById, updateQuiz } from '../../api/quiz';
import { useParams } from 'react-router-dom';
import { ViewContext } from '../../context/View';
import { useContext } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Axios from 'axios';

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD HH:mm';
const timeFormat = 'HH:mm:ss';

const EditQuestion = () => {
	const id = useParams().id;
	const userId = JSON.parse(localStorage.getItem('user')).account._id;
	const viewContext = useContext(ViewContext);
	const breadcrumb = [
		{
			title: 'Home',
			href: '/admin_main/quiz',
		},
		{
			title: 'Question',
		},
	];
	const [formQuestion] = Form.useForm();
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const handleSetAsDefaultChange = (indexQuestion, indexOption) => {
		const fieldQuiz = formQuestion.getFieldsValue();
		const { questions } = fieldQuiz;
		if (questions[indexQuestion].type === 'single') {
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
		formQuestion.setFieldsValue({ questions });
		console.log(questions);
	};

	const handleFinish = async (data) => {
		setIsLoading(true);
		data.id = id;
		console.log(data);
		// await updateQuiz(data)
		//   .then((res) => {
		//     console.log(res);
		//   })
		//   .catch((err) => {
		//     console.log(err);
		//   });
		setIsLoading(false);
	};

	useEffect(() => {
		const getQuestionData = async () => {
			try {
				const responseGetQuestion = await Axios({
					method: 'GET',
					url: `/api/question/${id}`,
				});
				const question = responseGetQuestion.data.data;
				const formatQues = {
					id: question._id,
					userId: question.userId,
					question: question.question,
					level: question.level,
					answer: question.answer[0],
					type: question.type,
					options: [],
				};
				for (const option of question.options) {
					formatQues.options.push({
						isSelected: option === formatQues.answer,
						label: option,
					});
				}
				formQuestion.setFieldsValue(formatQues);
			} catch (error) {
				console.log(error);
				viewContext.handleError(error);
			}
		};
		setIsLoading(true);
		getQuestionData();
		setIsLoading(false);
	}, [id]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<Spring>
					<Bread title="Edit a question" items={breadcrumb} />
					<div>
						{!isLoading && (
							<Form
								form={formQuestion}
								layout="vertical"
								onFinish={handleFinish}>
								<Row gutter={12}>
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
													</Flex>
												</Col>

												<Col span={24}>
													<Flex
														align="center"
														justify="space-between"
														style={{ marginBottom: 12 }}>
														<Flex align="center" gap={8} flex={1}>
															<Form.Item
																style={{ marginBottom: 0 }}
																name={'question'}>
																<Input
																	placeholder="Title here"
																	style={{ width: '400px' }}
																/>
															</Form.Item>
														</Flex>
														<Flex vertical={false} gap={5} align="center">
															<p className="font-bold">Level:</p>
															<Form.Item
																name={'level'}
																initialValue={'perception'}
																noStyle>
																<Select
																	placeholder="Select question type"
																	disabled={false}>
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
															<p className="font-bold">Category:</p>
															<Form.Item name={'category'} noStyle>
																<Select
																	placeholder="Select category"
																	disabled={false}>
																	{categories.map((category) => (
																		<Select.Option
																			value={category}
																			key={category}>
																			<span className="capitalize">
																				{category}
																			</span>
																		</Select.Option>
																	))}
																</Select>
															</Form.Item>
															<p className="font-bold">Subcategory:</p>
															<Form.Item name={'subcategory'} noStyle>
																<Select
																	placeholder="Select subcategory"
																	disabled={false}>
																	{categories.map((category) => (
																		<Select.Option
																			value={category}
																			key={category}>
																			<span className="capitalize">
																				{category}
																			</span>
																		</Select.Option>
																	))}
																</Select>
															</Form.Item>
															<p className="font-bold">Type:</p>
															<Form.Item name={'type'} noStyle className='min-w-fit'>
																<Select
																	placeholder="Select Type"
																	disabled={false}
                                  className='min-w-fit'
                                  >
																	<Select.Option value="single" >
																		Single
																	</Select.Option>
																	<Select.Option value="multiple">
																		Multiple
																	</Select.Option>
																	<Select.Option value="text">
																		Text
																	</Select.Option>
																</Select>
															</Form.Item>
														</Flex>
													</Flex>
													<Form.Item>
														<Form.List
															name={'options'}
															initialValue={[
																{
																	isSelected: true,
																	label: '',
																},
															]}>
															{(subFields, subOpt) => (
																<div
																	style={{
																		display: 'flex',
																		flexDirection: 'column',
																		rowGap: 16,
																	}}>
																	{subFields.map((subField) => (
																		<Flex key={subField.key}>
																			<Flex
																				align="center"
																				justify="space-between"
																				className="w-full">
																				<Flex align="center" gap={12}>
																					<ConfigProvider
																						theme={{
																							token: {
																								colorPrimary: '#754FFE',
																							},
																						}}>
																						<Form.Item
																							noStyle
																							name={[
																								subField.name,
																								'isSelected',
																							]}
																							valuePropName="checked">
																							<Switch
																								onChange={() =>
																									handleSetAsDefaultChange(
																										0,
																										subField.key
																									)
																								}
																								checked></Switch>
																						</Form.Item>
																					</ConfigProvider>
																					<Form.Item
																						noStyle
																						name={[subField.name, 'label']}>
																						<Input
																							placeholder="Question title"
																							style={{ width: 400 }}
																						/>
																					</Form.Item>
																				</Flex>
																				{true && subField.name === 0 && (
																					<Button
																						icon={<PlusOutlined />}
																						onClick={() => {
																							subOpt.add();
																						}}></Button>
																				)}
																				{true && subField.name !== 0 && (
																					<Button
																						danger
																						icon={<DeleteOutlined />}
																						onClick={() => {
																							subOpt.remove(subField.name);
																						}}></Button>
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
									</Col>
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
