import { Button, Modal, Typography, Flex, Form, Row, Col, Input } from 'antd';

const AddScheduleModal = (props) => {
	return (
		<>
			<Modal
				open={props.open}
				onCancel={props.onCancel}
				className=""
				okButtonProps={{
					hidden: true,
				}}
				cancelButtonProps={{
					hidden: true,
				}}>
				<Form
					layout="vertical"
					className="flex flex-col"
					onFinish={props.onFinish}
					onValuesChange={(e) => console.log('Form change', e)}>
					<Row>
						<Form.Item
							label={
								<span>
									<Typography.Title level={5}>Title</Typography.Title>
								</span>
							}
							name={'title'}>
							<Input type="text" />
						</Form.Item>
					</Row>
					<Flex vertical={false} gap={5} justify="end">
						<Button
							htmlType="submit"
							type="default"
							size="large"
							onClick={props.onCancel}>
							Cancel
						</Button>
						<Button htmlType="submit" type="primary" size="large">
							Save
						</Button>
					</Flex>
				</Form>
			</Modal>
		</>
	);
};

export default AddScheduleModal;
