import React, { Fragment, useEffect, useRef, useState } from 'react';
import Bread from '../../components/Bread';
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
} from 'antd';
import {
	CloseOutlined,
	DeleteOutlined,
	MoreOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import Card from 'antd/es/card/Card';
import Question from '../../components/Question';
import Spring from '../../components/Spring';
import scq from '../../assets/scq.svg';
import mcq from '../../assets/mcq.svg';
import fill from '../../assets/fill.svg';
import FormItem from 'antd/es/form/FormItem';
import { createQuestions } from '../../api/quiz';
import { useAPI } from '../../hooks/api';
import { ViewContext } from '../../context/View';
import { useContext } from 'react';
const AddQuestion = () => {
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
	const [categories, setCategories] = useState([]);

	const categoryResponseApi = useAPI(`/api/category`, null).data;
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

	const handleSetAsDefaultChange = (indexQuestion, indexOption) => {
		const fieldQuiz = formQuiz.getFieldsValue();
		const { questions } = fieldQuiz;
		console.log('questions', questions);
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
		// console.log(data);

		createQuestions(data)
			.then((res) => {
				if (res == true) {
					viewContext.handleSuccess('Create questions successfully!');
				} else if (res == false) {
					viewContext.handleError('Create question failed');
				} else {
					viewContext.handleError(res.error);
				}
			})
			.catch((err) => {
				console.log(err);
				viewContext.handleError(err);
			});
	};

	return (
		<Spring>
			<Bread title="Add a new quiz" items={breadcrumb} />
			<div>
				<Form
					form={formQuiz}
					layout="vertical"
					// onValuesChange={handleFormQuizChange}
					onFinish={handleFinish}>
					<Row gutter={12} justify={'center'}>
						<Col span={16}>
							<Row className="shadow-md border bg-white p-8">
								<Form.List name={'questions'}>
									{(fields, { add, remove }) => (
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
														onClick={() => {
															add();
														}}>
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
															style={{ marginBottom: 12 }}>
															<Flex align="center" wrap="wrap" gap={8} flex={1}>
																<Typography.Title
																	style={{
																		marginBottom: 0,
																		minWidth: 'fit-content',
																	}}
																	level={5}>
																	Question {index + 1}:
																</Typography.Title>
																<Form.Item
																	style={{ marginBottom: 0 }}
																	name={[field.name, 'title']}>
																	<Input
																		placeholder="Title here"
																		style={{ width: '400px' }}
																	/>
																</Form.Item>
																<Flex gap={4}>
																	<Form.Item
																		name={[field.name, 'type']}
																		initialValue={'perception'}
																		noStyle>
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
																	<Form.Item
																		name={[field.name, 'category']}
																		noStyle>
																		<Select
																			placeholder="Select category"
																			className="capitalize"
																			onSelect={(e) => console.log('event', e)}>
																			{categories.map(({_id, title}, index) => (
																				<Select.Option
																					value={_id}
																					key={index}>
																					{title}
																				</Select.Option>
																			))}
																		</Select>
																	</Form.Item>
																	<Button
																		onClick={() => remove(field.name)}
																		danger
																		icon={<DeleteOutlined />}></Button>
																</Flex>
															</Flex>
														</Flex>
														<Form.Item>
															<Form.List
																name={[field.name, 'options']}
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
																					wrap="wrap"
																					align="center"
																					gap={5}
																					justify="space-between"
																					className="w-full">
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
																									/* here is your global tokens */
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
																											field.key,
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
																					{subField.name === 0 && (
																						<Button
																							icon={<PlusOutlined />}
																							onClick={() => {
																								subOpt.add();
																							}}></Button>
																					)}
																					{subField.name !== 0 && (
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
