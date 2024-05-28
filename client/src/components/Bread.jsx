import {
	Breadcrumb,
	Button,
	Col,
	ConfigProvider,
	Flex,
	Row,
	Space,
	Typography,
} from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Bread = ({ title, items, label, link }) => {
	const navigate = useNavigate();
	return (
		<Row className="mb-8 grow">
			<Col span={24}>
				<Flex align="center" justify="space-between">
					<ConfigProvider
						theme={{
							components: {
								Breadcrumb: {
									/* here is your component tokens */
									linkColor: '#754FFE',
								},
							},
							token: {
								colorBgTextHover: 'bg-transparent',
							},
						}}>
						<Space direction="vertical">
							<Typography.Title level={3} style={{ marginBottom: 0 }}>
								{title}
							</Typography.Title>
							<Breadcrumb separator=">" items={items} />
						</Space>
					</ConfigProvider>

					{label &&
						(typeof label == 'string' ? (
							<Button
								onClick={() => navigate(link)}
								className="bg-[#754FFE] text-white font-semibold"
								size="large">
								{label}
							</Button>
						) : (
							/* typeof label == array*/
							<Flex gap={5}>
								{label.map((l, index) => (
									<Button
										key={index}
										onClick={() => navigate(link[index])}
										className="bg-[#754FFE] text-white font-semibold"
										size="large">
										{l}
									</Button>
								))}
							</Flex>
						))}
				</Flex>
			</Col>
		</Row>
	);
};

export default Bread;
