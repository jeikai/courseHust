import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	QuestionCircleOutlined,
	UploadOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import {
	Button,
	Col,
	Drawer,
	Flex,
	Form,
	Input,
	Space,
	Typography,
	Upload,
} from 'antd';
import React, { useRef } from 'react';
import Card from './Card';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const RowSection = ({
	section,
	openModalEditSection,
	handleRemoveSection,
	openModalEditLesson,
	handleRemoveLesson,
	formLesson,
	setOpenInputLesson,
	someoneIsDragging,
	formQuiz,
	setOpenEditQuiz,
	setOpenInputQuiz,
}) => {
	const {
		attributes,
		listeners,
		isDragging,
		setNodeRef,
		transform,
		transition,
	} = useSortable({
		id: section.id,
		data: { ...section },
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};
	return (
		<div
			key={section.id}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="border border-[#e2e8f0] item rounded text-nowrap bg-white text-[#64748b] p-4">
			<div>
				<Flex align="center" justify="space-between" className="mb-4">
					<Typography.Title level={5}>{section.title}</Typography.Title>
					<Space className="text-base">
						<EditOutlined onClick={() => openModalEditSection(section.id)} />
						<DeleteOutlined onClick={() => handleRemoveSection(section.id)} />
					</Space>
				</Flex>
				<SortableContext items={[]}>
					{section?.specials?.map((item, index) => {
						return (
							<Card
								key={index}
								item={item}
								section={section}
								openModalEditLesson={openModalEditLesson}
								handleRemoveLesson={handleRemoveLesson}
							/>
						);
					})}
				</SortableContext>
			</div>
			<Space>
				<Button
					onClick={() => {
						formLesson.setFieldValue('sectionId', section.id);
						console.log(formLesson.getFieldsValue());
						setOpenInputLesson(true);
					}}
					icon={<PlusOutlined />}>
					Lesson
				</Button>
			</Space>
		</div>
	);
};

export default RowSection;
