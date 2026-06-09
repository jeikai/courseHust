import React, { useEffect, useState } from 'react';
import Bread from '../../components/Bread';
import { Button, Col, Divider, Flex, Row, Space, Typography } from 'antd';
import {
	ClockCircleOutlined,
	DeleteOutlined,
	FileOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
// import QuizData from '../../db/QuizData'
import Spring from '../../components/Spring';
import { deleteQuiZ, getQuizs } from '../../api/quiz';
import { da } from '@faker-js/faker';
import Loader from '../../components/Loader';
import { useAPI } from '../../hooks/api';
import Axios from 'axios';

const Quiz = () => {
	const userId = JSON.parse(localStorage.getItem('user')).account._id;
	const [isLoading, setIsLoading] = useState(true);
	const breadcrumb = [
		{
			title: 'Home',
			href: '',
		},
		{
			title: 'Quiz',
		},
	];
	const [data, setData] = useState([]);
	async function fetchData(userId) {
		try {
			const responseAPI = await Axios({
				url: `/api/quiz/instructor/${userId}`,
				method: 'GET',
			});
			console.log('response', responseAPI.data);
			const arrayFormatData = [];
			responseAPI.data.data.map((quiz) => {
				if (quiz._id != null) {
					arrayFormatData.push({
						id: quiz._id._id,
						title: quiz._id.title,
						numberOfQuestions: quiz._id.ques.length,
						duration: quiz._id.duration,
					});
				} else {
					console.log('null quiz', quiz);
				}
			});

			setData(arrayFormatData);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		fetchData(userId);
	}, []);
	if (isLoading) return <Loader />;
	const handleDeleteQuiz = async (id) => {
		console.log(id);
		const status = await deleteQuiZ(id);

		if (status) {
			let newData = data;
			let index = newData.findIndex((item) => item.id === id);
			newData.splice(index, 1);
			setData((prev) => [...newData]);
		}
		console.log(status);
	};
	return (
		<section>
			<Bread
				title="Quiz"
				items={breadcrumb}
				label={['Create Quiz', 'AutoQuiz']}
				link={[
					'/admin_main/add_quiz',
					'/admin_main/auto_quiz'
				]}
			/>
			<div className="shadow-md border bg-white p-8">
				{data.map((quiz, index) => {
					return (
						<Spring index={index} key={quiz.id}>
							<Row align="middle">
								<Col span={20}>
									<Space direction="vertical">
										<Typography.Title level={4} style={{ marginBottom: 0 }}>
											{quiz.title}
										</Typography.Title>
										<Flex gap={16}>
											<Flex
												align="center"
												className="text-sm text-[#64748b]"
												gap={4}>
												<UnorderedListOutlined />
												<span>{quiz.numberOfQuestions} Questions</span>
											</Flex>
											<Flex
												align="center"
												className="text-sm text-[#64748b]"
												gap={4}>
												<ClockCircleOutlined />
												<span>{quiz.duration}</span>
											</Flex>
											<Link className="group">
												<Flex
													align="center"
													className="group-hover:text-[#754FFE] text-sm text-[#64748b]"
													gap={4}>
													<FileOutlined />
													<span>Result</span>
												</Flex>
											</Link>
										</Flex>
									</Space>
								</Col>
								<Col span={4}>
									<Flex gap={5} wrap="wrap" align="center">
										<Flex justify="flex-end" onClick={() => quiz.id}>
											<Button
												className="text-base text-blue-500 border-blue-400"
												href={`/admin_main/edit_quiz/${quiz.id}`}>
												Update
											</Button>
										</Flex>
										<Flex
											justify="flex-end"
											onClick={() => handleDeleteQuiz(quiz.id)}>
											<DeleteOutlined className="text-base text-red-600" />
										</Flex>
									</Flex>
								</Col>
								<Divider />
							</Row>
						</Spring>
					);
				})}
			</div>
		</section>
	);
};

export default Quiz;
