/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Bread from '../../components/Bread';
import {
	Avatar,
	Button,
	Checkbox,
	Col,
	ConfigProvider,
	Divider,
	Drawer,
	Flex,
	Form,
	Image,
	Input,
	Modal,
	Progress,
	Row,
	Select,
	Space,
	Steps,
	Table,
	Typography,
	Upload,
	Tabs,
} from 'antd';
import {
	CreditCardOutlined,
	MinusOutlined,
	PlusOutlined,
	UploadOutlined,
	CalendarOutlined,
	CommentOutlined,
	ProfileOutlined,
	TagsOutlined,
	UserOutlined,
	VideoCameraOutlined,
	QuestionCircleOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';

import {
	DndContext,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RowSection from '../../components/admin/RowSection';
import Spring from '../../components/Spring';
import { useAPI } from '../../hooks/api';
import Loader from '../../components/Loader';
import { uploadFile } from '../../helpers';

const EditCourse = () => {
	const courseId = useParams().id;
	const [isLoading, setIsLoading] = useState(false);

	const [form] = Form.useForm();
	const [basicInfoForm] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [formLesson] = Form.useForm();
	const [formEditLesson] = Form.useForm();
	const [formSection] = Form.useForm();
	const [formEditSection] = Form.useForm();
	const [formQuiz] = Form.useForm();
	const [formEditQuiz] = Form.useForm();

	const [idEditSection, setIdEditSection] = useState();
	const [idEditLesson, setIdEditLesson] = useState();

	const [openInputSections, setOpenInputSections] = useState(false);
	const [openEditSections, setOpenEditSections] = useState(false);
	const [openInputLesson, setOpenInputLesson] = useState(false);
	const [openEditLesson, setOpenEditLesson] = useState(false);
	const [openInputQuiz, setOpenInputQuiz] = useState(false);
	const [openEditQuiz, setOpenEditQuiz] = useState(false);
	//MEDIA TAB
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const [courseCategory, setCourseCategory] = useState([]);

	const [data, setData] = useState({
		title: '',
		category: '',
		level: 'basic',
		shortDes: '',
		description: '',
		faq: [],
		outcomes: [],
		requirements: [],
		price: undefined,
		free: false,
		thumbnail: null,
		video: null,
		sections: [],
	});
	const courseDataApi = useAPI(`/api/course/${courseId}`, null);
	const categoryDataApi = useAPI(`/api/category`, null);
	// useEffect(() => {
	// 	if (categoryDataApi.data) {
	// 		setCourseCategory((prev) =>
	// 			categoryDataApi.data.map((category) => ({
	// 				label: category.title,
	// 				value: category.title,
	// 				_id: category._id,
	// 			}))
	// 		);
	// 	}
	// }, [categoryDataApi]);
	useEffect(() => {
		if (categoryDataApi.data) {
			setCourseCategory((prev) =>
				categoryDataApi.data.map((category) => ({
					label: category.title,
					value: category.title,
					_id: category._id,
				}))
			);
		}
		if (courseDataApi.data) {
			const courseData = courseDataApi.data;

			setData((prev) => ({
				...prev,
				description: courseData.description,
				title: courseData.title,
				level: courseData.level,
				shortDes: courseData.shortDes,
				category: courseData.categoryId.title,
				thumbnail: courseData.thumbnail,
				sections: courseData.sections,
			}));
			setThumbnail((prev) => [
				{
					url: courseData.thumbnail,
				},
			]);

			form.setFieldsValue(data);
		}
		return () => {};
	}, [courseDataApi, categoryDataApi]);

	const breadcrumb = [
		{
			title: 'Home',
			href: '',
		},
		{
			title: 'Add New Course',
		},
	];

	const filterOption = (input, option) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	const [thumbnail, setThumbnail] = useState([]);
	const [video, setVideo] = useState([]);

	//*Handle create new lesson
	const handleOkLesson = () => {
		// debugger
		// callback()
		const fieldLessons = formLesson.getFieldsValue();
		let lessonId = uuidv4();
		let sectionId = fieldLessons.sectionId;
		fieldLessons.id = lessonId;

		const { sections } = data;

		sections.forEach((section) => {
			if (section.id === sectionId) {
				console.log('hehe');

				if (!section?.specialIds) {
					(section.specialIds = []), (section.specials = []);
				}
				let obj = {
					id: lessonId,
					type: 'lesson',
				};
				section.specialIds.push(obj), section.specials.push(fieldLessons);
			}
		});

		setData((prevData) => ({
			...prevData,
			sections: sections,
		}));

		setOpenInputLesson(false);
		formLesson.resetFields();

		console.log('data', data);
		console.log(JSON.stringify(data));
		console.log('fieldLessons', fieldLessons);
	};

	const handleEditLesson = async () => {
		setIsLoading((prev) => true);
		let newLesson = formEditLesson.getFieldsValue();
		const uploadedFile = await uploadFile(newLesson.file[0].originFileObj);
		newLesson.videoURL = uploadedFile.file_url;
		let { sections } = data;
		sections.forEach((section) => {
			let { specs } = section;

			let specIndex = -1;
			specs.forEach((spec, index) => {
				if (spec._id._id == idEditLesson) specIndex = index;
			});

			if (specIndex !== -1) {
				specs.splice(specIndex, 1, {
					_id: { ...newLesson },
					type: 'lesson',
				});
			}
		});

		setData((prevData) => ({
			...prevData,
			sections: sections,
		}));

		setIdEditLesson(0);
		setOpenEditLesson(false);
		formEditLesson.resetFields();
		setIsLoading(false);
	};

	const openModalEditLesson = (id) => {
		const { sections } = data;
		console.log(id);
		sections.forEach((section) => {
			section?.specs?.forEach((item) => {
				if (item._id._id === id) {
					console.log('item lesson', item._id);

					formEditLesson.setFieldsValue({
						title: item._id.title,
						content: item._id.content,
						docURL: item._id.docURL,
						videoURL: item._id.videoURL,
						sectionId: section._id,
						duration: item._id.duration,
					});

					setIdEditLesson(item._id._id);
					setOpenEditLesson(true);
				}
			});
		});
	};

	const handleOkSection = () => {
		// debugger

		const fieldSections = formSection.getFieldsValue();
		let sectionId = uuidv4();
		fieldSections.id = sectionId;

		if (!data.sectionIds) {
			data.sectionIds = [];
			data.sections = [];
		}

		data.sectionIds.push(sectionId);
		data.sections.push(fieldSections);

		console.log('fieldSections', fieldSections);
		console.log(data);

		setData(data);
		setOpenInputSections(false);

		formSection.resetFields();
	};

	const handleEditSection = () => {
		data.sections.forEach((section) => {
			if (section.id === idEditSection) {
				let newName = formEditSection.getFieldValue('sectionName');
				section.sectionName = newName;
				setData(data);

				formEditSection.resetFields();
				setOpenEditSections(false);
			}
		});
	};

	const openModalEditSection = (id) => {
		console.log(id);
		data.sections.forEach((section) => {
			if (section.id === id) {
				console.log(data.sections);
				formEditSection.setFieldValue('sectionName', section.sectionName);
				setIdEditSection(id);
				setOpenEditSections(true);
			}
		});
	};

	const handleRemoveLesson = (id) => {
		let { sections } = data;
		sections.forEach((section) => {
			let { specs } = section;
			let index = specs.findIndex((spec) => spec._id._id === id);
			console.log(index);

			if (index !== -1) {
				// Tìm thấy đối tượng với id tương ứng
				// Xóa phần tử cũ
				specs.splice(index, 1);
			}
		});
		setData((prevData) => ({
			...prevData,
			sections: sections,
		}));
	};

	const handleRemoveSection = (id) => {
		console.log(id);
		// Xóa phần tử trong mảng sections
		const updatedSections = data.sections.filter(
			(section) => section.id !== id
		);

		// Xóa id trong mảng sectionIds
		const updatedSectionIds = data.sectionIds.filter((id) => id !== id);

		// Cập nhật dữ liệu mới
		setData((prevData) => ({
			...prevData,
			sections: updatedSections,
			sectionIds: updatedSectionIds,
		}));
	};

	const getFile = (e) => {
		console.log('Upload event:', e);

		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	useEffect(() => {
		const field = form.getFieldsValue();
		field.description = field.description?.level?.content;
		setData({ ...data, ...field });
	}, [current]);

	const serverUpload = async (options, callback) => {
		const { onSuccess, file, onError, onProgress } = options;
		console.log(file);
		callback([file]);
		onSuccess('ok');
	};

	const handleSubmit = async (formData) => {
		// if (typeof form.getFieldValue('thumbnail') == Object) {
		// 	console.log('object');
		// }
		// let thumbnail = await uploadFile(data.thumbnail.file.originFileObj);
		// data.thumbnail = thumbnail.file_url;
		// console.log(data.thumbnail);
		console.log('Submitted data', data);
	};

	const BasicInformation = (props) => {
		const handleBasicInfoData = (basicInfo) => {
			console.log('data', data);
		};
		return (
			<Spring className={''}>
				<Typography.Title level={4}>Basic Information</Typography.Title>

				<Row gutter={[24, 0]}>
					<Col span={24}>
						<Form.Item
							label={
								<Typography.Title level={5}>Course Title</Typography.Title>
							}
							name="title">
							<Input
								placeholder="Course Title"
								size="large"
								showCount
								maxLength={60}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={
								<Typography.Title level={5}>Courses category</Typography.Title>
							}
							name="category">
							<Select
								showSearch
								placeholder="Select a category"
								optionFilterProp="children"
								// filterOption={filterOption}
								options={courseCategory}
								size="large"
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={
								<Typography.Title level={5}>Courses level</Typography.Title>
							}
							name="level">
							<Select
								placeholder="Select a level"
								options={[
									{
										label: 'Specialized',
										value: 'specialized',
									},
									{
										label: 'Advanced',
										value: 'advanced',
									},
									{
										label: 'Intermediate',
										value: 'intermediate',
									},
									{
										label: 'Beginner',
										value: 'beginner',
									},
									{
										label: 'Basic',
										value: 'basic',
									},
								]}
								size="large"
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={
								<Typography.Title level={5}>Short description</Typography.Title>
							}
							name="shortDes">
							<Input.TextArea
								className="py-2"
								rows={6}
								placeholder="Short description for course"
								maxLength={5}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={
								<Typography.Title level={5}>
									Course Description
								</Typography.Title>
							}
							name="description">
							<Editor
								apiKey="by05nyt9dhljko786tzo81q4vzgsn5hrdjq81e4kb3wi5yyp"
								init={{
									plugins:
										'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
									toolbar:
										'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
									placeholder: 'Write something awesome',
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Spring>
		);
	};

	const Media = () => {
		const getBase64 = (file) =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		const onPreview = async (file) => {
			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj);
			}
			setPreviewImage(file.url || file.preview);
			setPreviewOpen(true);
		};
		const handleChange = async (e) => {
			if (e.fileList.length > 0 && !e.file.url && !e.file.preview) {
				e.file.preview = await getBase64(e.file.originFileObj);
				setThumbnail((prev) => [
					{
						uid: e.file.uid,
						name: e.file.name,
						url: e.file.url || e.file.preview,
					},
				]);
			}
		};

		return (
			<Spring className={''}>
				<Typography.Title level={4}>Courses Media</Typography.Title>

				<Row>
					<Col span={8}>
						<Typography.Title level={5}>Course thumbnail</Typography.Title>
					</Col>
					<Col span={16}>
						<Form.Item name={'thumbnail'}>
							<Upload
								// customRequest={(options) => serverUpload(options, setThumbnail)}
								listType="picture-card"
								fileList={thumbnail}
								onRemove={() => setThumbnail((prev) => [])}
								onPreview={onPreview}
								onChange={handleChange}>
								{thumbnail.length < 1 && (
									<button
										style={{
											border: 0,
											background: 'none',
										}}
										type="button">
										<PlusOutlined />
										<div
											style={{
												marginTop: 8,
											}}>
											Upload
										</div>
									</button>
								)}
							</Upload>
							{previewImage && (
								<Image
									wrapperStyle={{
										display: 'none',
									}}
									preview={{
										visible: previewOpen,
										onVisibleChange: (visible) => setPreviewOpen(visible),
										afterOpenChange: (visible) =>
											!visible && setPreviewImage(''),
									}}
									src={previewImage}
								/>
							)}
						</Form.Item>
					</Col>
				</Row>
			</Spring>
		);
	};

	const ACTIVE_DRAG_ITEM_TYPE = {
		CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
		SECTION: 'ACTIVE_DRAG_ITEM_TYPE_SECTION',
	};
	const [isDragging, setIsDragging] = useState(false);
	const [activeDragItemId, setActiveDragItemId] = useState(null);
	const [activeDragItemType, setActiveDragItemType] = useState(null);
	const [activeDragItemData, setActiveDragItemData] = useState(null);

	const handleDragStart = (event) => {
		console.log('drag start', event);
		setIsDragging(true);
		setActiveDragItemId(event?.active?.id);
		setActiveDragItemType(
			event?.active?.data?.current?.sectionId
				? ACTIVE_DRAG_ITEM_TYPE.CARD
				: ACTIVE_DRAG_ITEM_TYPE.SECTION
		);
		setActiveDragItemData(event?.active?.data?.current);
		console.log('done drag start');
	};

	const handleDragEnd = (event) => {
		console.log('dragEnd', event);
		const { active, over } = event;
		const { sections } = data;

		if (active?.data?.current?.sectionId && over?.data?.current?.sectionId) {
			let specActive = active?.data?.current;
			delete specActive.sortable;

			let specOver = over?.data?.current;
			delete specOver.sortable;

			let sectionIdActive = active?.data?.current?.sectionId;
			let sectionIdOver = over?.data?.current?.sectionId;

			let sectionActive = sections.find(
				(section) => section.id == sectionIdActive
			);
			let sectionOver = sections.find((section) => section.id == sectionIdOver);

			let positionActive = sectionActive?.specials.findIndex(
				(item) => item.id === specActive.id
			);

			let positionOver = sectionOver?.specials.findIndex(
				(item) => item.id === specOver.id
			);

			let typeActive = sectionActive.specialIds[positionActive];
			let typeOver = sectionOver.specialIds[positionOver];
			// hoán đổi id section của mỗi special.
			specActive.sectionId = sectionIdOver;
			specOver.sectionId = sectionIdActive;

			// Trong specials (section) active, xóa bỏ object active và thay vào object được over
			sectionActive.specials.splice(positionActive, 1);
			sectionActive.specials.splice(positionActive, 0, specOver);
			sectionActive.specialIds.splice(positionActive, 1);
			sectionActive.specialIds.splice(positionActive, 0, typeOver);
			// trong specials (section) over, xóa bỏ object over và thay vào object active
			sectionOver.specials.splice(positionOver, 1);
			sectionOver.specials.splice(positionOver, 0, specActive);
			sectionOver.specialIds.splice(positionOver, 1);
			sectionOver.specialIds.splice(positionOver, 0, typeActive);

			console.log('sectionActive', sectionActive);
			console.log('sectionOver', sectionOver);
			console.log('positionActive', positionActive);
			console.log('positionOver', positionOver);
			console.log('section', sections);
			console.log('data', data);
			return;
		}

		if (active.id === over.id) return;

		if (active.id !== over.id) {
			//Lấy vị trí cũ  (từ thằng active)
			const oldIndex = sections.findIndex(
				(section) => section.id === active.id
			);
			//Lấy vị trí mới  (từ thằng over)
			const newIndex = sections.findIndex((section) => section.id === over.id);

			const dndOrdered = arrayMove(sections, oldIndex, newIndex);
			const dndOrderedIds = dndOrdered.map((item) => item.id);
			console.log(dndOrdered);
			console.log(dndOrderedIds);
			setData((prevData) => ({
				...prevData,
				sectionIds: dndOrderedIds,
				sections: dndOrdered,
			}));
			console.log(data);
		}
	};

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 10, // Enable sort function when dragging 10px   💡 here!!!
		},
	});

	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: 250,
			tolerance: 500,
		},
	});

	const sensors = useSensors(mouseSensor, touchSensor);

	const Curriculum = () => {
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
			const Card = ({
				item,
				section,
				openModalEditLesson,
				handleRemoveLesson,
			}) => {
				const {
					attributes,
					listeners,
					isDragging,
					setNodeRef,
					transform,
					transition,
				} = useSortable({
					id: item.id,
					data: { ...item },
				});

				const style = {
					transform: CSS.Translate.toString(transform),
					transition,
				};
				return (
					<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
						<Flex
							className="border px-4 p-2 mb-3 bg-[#f1f5f9]"
							align="center"
							justify="space-between">
							<Flex align="center" gap={6}>
								{section?.specs?.filter((spec) => spec.type === 'lesson') ? (
									<VideoCameraOutlined />
								) : (
									<QuestionCircleOutlined />
								)}
								<Typography.Title style={{ marginBottom: 0 }} level={5}>
									{item.title}
								</Typography.Title>
							</Flex>
							<Space>
								<EditOutlined onClick={() => openModalEditLesson(item._id)} />
								<DeleteOutlined onClick={() => handleRemoveLesson(item._id)} />
							</Space>
						</Flex>
					</div>
				);
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
								<EditOutlined
									onClick={() => openModalEditSection(section.id)}
								/>
								<DeleteOutlined
									onClick={() => handleRemoveSection(section.id)}
								/>
							</Space>
						</Flex>
						<SortableContext items={[]}>
							{section?.specs?.map((item, index) => {
								return (
									<Card
										key={index}
										item={item._id}
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

								setOpenInputLesson(true);
							}}
							icon={<PlusOutlined />}>
							Lesson
						</Button>
					</Space>
				</div>
			);
		};

		return (
			<div className={''}>
				<Typography.Title level={4}>Curriculum</Typography.Title>
				<div className="p-4">
					<div className="bg-[#f1f5f9] p-2 rounded-md mb-4">
						<Flex vertical gap={12}>
							<DndContext
								sensors={sensors}
								// onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}>
								<SortableContext
									items={data?.sections}
									strategy={verticalListSortingStrategy}>
									{data?.sections.map((section) => {
										return (
											<RowSection
												key={section.id}
												section={section}
												openModalEditSection={openModalEditSection}
												handleRemoveSection={handleRemoveSection}
												openModalEditLesson={openModalEditLesson}
												handleRemoveLesson={handleRemoveLesson}
												formLesson={formLesson}
												setOpenInputLesson={setOpenInputLesson}
												someoneIsDragging={isDragging}
												setOpenInputQuiz={setOpenInputQuiz}
												openInputQuiz={openInputQuiz}
												setOpenEditQuiz={setOpenEditQuiz}
												openEditQuiz={openEditQuiz}
												formQuiz={formQuiz}
											/>
										);
									})}
								</SortableContext>
							</DndContext>
						</Flex>
						<Drawer
							title="Create a new lesson"
							width={720}
							onClose={() => setOpenInputLesson(false)}
							open={openInputLesson}
							styles={{
								body: {
									paddingBottom: 80,
								},
							}}
							extra={
								<Space>
									<Button onClick={() => setOpenInputLesson(false)}>
										Cancel
									</Button>
									<Button onClick={handleOkLesson} type="primary">
										Submit
									</Button>
								</Space>
							}>
							<Form form={formLesson}>
								<Row gutter={16}>
									<Col span={24}>
										<Typography.Title level={5}>Lesson Title</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item
											name="title"
											rules={[
												{
													required: true,
													message: 'Please enter lesson title',
												},
											]}>
											<Input placeholder="Please enter lesson title" />
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={16}>
									<Col span={24}>
										<Typography.Title level={5}>Description</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item
											name="content"
											rules={[
												{
													required: true,
													message: 'please enter description',
												},
											]}>
											<Input.TextArea
												rows={4}
												placeholder="please enter description"
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Typography.Title level={5}>
											Upload video or document
										</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item name="file" getValueFromEvent={getFile}>
											<Upload

											// fileList={video}
											>
												<Button icon={<UploadOutlined />}>
													Upload your file
												</Button>
											</Upload>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Typography.Title level={5}>Section Id</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item name="sectionId">
											<Input />
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Drawer>
						<Drawer
							title="Edit a lesson"
							width={720}
							onClose={() => setOpenEditLesson(false)}
							open={openEditLesson}
							styles={{
								body: {
									paddingBottom: 80,
								},
							}}
							extra={
								<Space>
									<Button onClick={() => setOpenEditLesson(false)}>
										Cancel
									</Button>
									<Button onClick={handleEditLesson} type="primary">
										Submit
									</Button>
								</Space>
							}>
							<Form form={formEditLesson}>
								<Row gutter={16}>
									<Col span={24}>
										<Typography.Title level={5}>Lesson Title</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item
											name="title"
											rules={[
												{
													required: true,
													message: 'Please enter lesson title',
												},
											]}>
											<Input placeholder="Please enter lesson title" />
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={16}>
									<Col span={24}>
										<Typography.Title level={5}>Description</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item
											name="content"
											rules={[
												{
													required: true,
													message: 'please enter description',
												},
											]}>
											<Input.TextArea
												rows={4}
												placeholder="please enter description"
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Typography.Title level={5}>Document URL</Typography.Title>
										<Form.Item name="docURL">
											<Input />
										</Form.Item>
										<Typography.Title level={5}>Video URL</Typography.Title>
										<Form.Item name="videoURL">
											<Input />
										</Form.Item>
										<Typography.Title level={5}>
											Upload video or document
										</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item name="file" getValueFromEvent={getFile}>
											<Upload>
												<Button icon={<UploadOutlined />}>
													Upload your file
												</Button>
											</Upload>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Typography.Title level={5}>Section Id</Typography.Title>
									</Col>
									<Col span={24}>
										<Form.Item name="sectionId">
											<Input />
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Drawer>
						<Modal
							title={<Typography.Title level={5}>Add a quiz</Typography.Title>}
							open={openInputQuiz}
							onCancel={() => setOpenInputQuiz(false)}>
							<Form form={formQuiz} layout="vertical">
								<Form.Item
									label={
										<Typography.Title level={5}>Select quiz</Typography.Title>
									}>
									<Select placeholder="Select question type">
										<Select.Option value="mcq">Multiple choice</Select.Option>
										<Select.Option value="scq">
											Single choice and True/False
										</Select.Option>
										<Select.Option value="fill">
											Fill in the blank
										</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item name="sectionId">
									<Input disabled />
								</Form.Item>
							</Form>
						</Modal>
						<ConfigProvider
							theme={{
								components: {
									Button: {
										defaultBorderColor: '#754FFE',
										defaultHoverColor: 'white',
										defaultHoverBorderColor: '#754FFE',
										defaultHoverBg: '#754FFE',
									},
								},
							}}>
							<Button
								onClick={() => setOpenInputSections(true)}
								className="mt-8 text-[#754FFE] font-semibold">
								Add section
							</Button>

							<Modal
								title="Add a new section"
								open={openInputSections}
								onOk={handleOkSection}
								onCancel={() => setOpenInputSections(false)}>
								<Form form={formSection}>
									<Row>
										<Col span={24}>
											<Typography.Title level={5}>
												Section name
											</Typography.Title>
										</Col>
										<Col span={24}>
											<Form.Item name="sectionName">
												<Input />
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</Modal>
							<Modal
								title="Edit a section"
								open={openEditSections}
								onOk={handleEditSection}
								onCancel={() => setOpenEditSections(false)}>
								<Form form={formEditSection}>
									<Row>
										<Col span={24}>
											<Typography.Title level={5}>
												Section name
											</Typography.Title>
										</Col>
										<Col span={24}>
											<Form.Item name="sectionName">
												<Input />
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</Modal>
						</ConfigProvider>
					</div>
				</div>
			</div>
		);
	};

	const progressData = [
		{
			id: 1,
			photo:
				'https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png',
			name: 'Signe Thomson',
			email: 'signeiner@gmail.com',
			enrolledDate: '11 Now 2020',
			completeOn: 'Not completed yet',
			quizDone: 1,
			quizs: 10,
		},
	];

	const ProgressAcademy = ({ index }) => {
		return (
			<div className={''}>
				<Table dataSource={progressData}>
					<Table.Column
						width={50}
						title="Avatar"
						render={(_, record) => {
							return (
								<div>
									<Avatar size={48} shape="circle" src={record.photo} />
								</div>
							);
						}}
					/>
					<Table.Column
						title="Student"
						render={(_, record) => {
							return (
								<Flex vertical>
									<Typography.Title level={5}>{record.name}</Typography.Title>
									<Typography.Text className="p-1 shadow bg-[#e3eaef] w-fit rounded">
										{record.email}
									</Typography.Text>
								</Flex>
							);
						}}
					/>
					<Table.Column
						title="Date"
						render={(_, record) => {
							return (
								<Flex vertical>
									<Typography.Text>
										<span className="font-semibold">Enroll from: </span>
										{record.enrolledDate}
									</Typography.Text>
									<Typography.Text>
										<span className="font-semibold">Last seen on: </span>
										{record.completeOn}
									</Typography.Text>
								</Flex>
							);
						}}
					/>
					<Table.Column
						title="Progress"
						render={(_, record) => {
							return (
								<Flex vertical className="w-[85%]">
									<Progress percent={20} />
									<Typography.Text>
										<span className="font-semibold">Complete quiz: </span>
										{record.quizDone}
										<span> out of </span>
										{record.quizs}
									</Typography.Text>
								</Flex>
							);
						}}
					/>
					<Table.Column
						title="Actions"
						render={(_, record) => {
							return (
								<Flex align="center">
									<Button icon={<CreditCardOutlined />}></Button>
								</Flex>
							);
						}}
					/>
				</Table>

				<Table>
					<Table.Column title="#" key={'id'} dataIndex={'id'} />
					<Table.Column
						title="Student"
						render={(_, record) => {
							return (
								<Flex vertical>
									<Typography.Title level={5}>{record.name}</Typography.Title>
									<Typography.Text className="p-1 shadow bg-[#e3eaef] w-fit rounded">
										{record.email}
									</Typography.Text>
								</Flex>
							);
						}}
					/>
					<Table.Column title="Mark" key={'mark'} dataIndex={'mark'} />
					<Table.Column title="Status" key={'status'} dataIndex={'status'} />
					{/* <Table.Column
                        title="#"
                        key={"id"}
                        dataIndex={"id"}
                    /> */}
				</Table>
			</div>
		);
	};

	// const steps = [
	// 	{
	// 		title: (
	// 			<Typography.Title
	// 				level={5}
	// 				style={{ display: 'inline-block', marginBottom: 0 }}>
	// 				Basic infomation
	// 			</Typography.Title>
	// 		),
	// 		content: <BasicInformation index={0} />,
	// 	},
	// 	{
	// 		title: (
	// 			<Typography.Title
	// 				level={5}
	// 				style={{ display: 'inline-block', marginBottom: 0 }}>
	// 				Info
	// 			</Typography.Title>
	// 		),
	// 		content: <Information index={1} />,
	// 	},
	// 	{
	// 		title: (
	// 			<Typography.Title
	// 				level={5}
	// 				style={{ display: 'inline-block', marginBottom: 0 }}>
	// 				Pricing
	// 			</Typography.Title>
	// 		),
	// 		content: <Pricing index={2} />,
	// 	},
	// 	{
	// 		title: (
	// 			<Typography.Title
	// 				level={5}
	// 				style={{ display: 'inline-block', marginBottom: 0 }}>
	// 				Media
	// 			</Typography.Title>
	// 		),
	// 		content: <Media index={3} />,
	// 	},
	// 	{
	// 		title: (
	// 			<Typography.Title
	// 				level={5}
	// 				style={{ display: 'inline-block', marginBottom: 0 }}>
	// 				Curriculum
	// 			</Typography.Title>
	// 		),
	// 		content: <Curriculum index={4} />,
	// 	},
	// {
	//     title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Academic progress</Typography.Title>,
	//     content: <ProgressAcademy index={5} />,
	// },
	// ];
	//TABS
	const items = [
		{
			icon: TagsOutlined,
			name: 'Overview',
			child: BasicInformation,
			props: {},
		},
		{
			icon: UserOutlined,
			name: 'Media',
			child: Media,
			props: { index: 2 },
		},
		{
			icon: CommentOutlined,
			name: 'Curriculum',
			child: Curriculum,
			props: { index: 4 },
		},
	];
	return (
		<>
			{courseDataApi.loading || categoryDataApi.loading || isLoading ? (
				<Loader />
			) : (
				<section>
					<Spring>
						<Bread title="Add new courses" items={breadcrumb} />

						<div className="w-full p-8 my-8">
							<Form
								form={form}
								layout="vertical"
								className="flex flex-col"
								onFinish={handleSubmit}
								onValuesChange={(e) => console.log('Form change', e)}>
								<Button
									htmlType="submit"
									className="bg-[#754FFE] text-white font-semibold self-end"
									size="large">
									Save
								</Button>

								<ConfigProvider
									theme={{
										components: {
											Tabs: {
												// cardGutter: 12
												horizontalItemGutter: 50,
												itemHoverColor: '#754FFE',
												itemSelectedColor: '#754FFE',
												inkBarColor: '#754FFE',
												horizontalItemMarginRTL: '',
											},
										},
									}}>
									<Tabs
										centered
										className="p-4 py-10 shadow-xl rounded-md mt-8 bg-white"
										size="large"
										defaultActiveKey="2"
										items={items.map((item, i) => {
											return {
												key: i,
												label: (
													<span className="font-semibold text-base xl:text-lg px">
														{item.name}
													</span>
												),
												children: <item.child {...item.props} />,
												className: '',
												icon: <item.icon className=" text-base" />,
											};
										})}
									/>
								</ConfigProvider>
							</Form>
							{/* <div className="w-full overflow-x-auto">
						<Flex
							align="center"
							justify="space-between"
							className="px-5"
							gap={6}>
							{steps.map((step, index) => {
								return (
									<Fragment key={index}>
										<Flex
											className="flex-1 cursor-pointer min-w-max"
											align="center"
											gap={12}
											onClick={() => setCurrent(index)}>
											<Flex
												align="center"
												justify="center"
												className={`font-semibold w-10 h-10 ${
													current >= index
														? 'bg-[#754FFE] text-white'
														: 'bg-gray-200'
												} rounded-full`}>
												{index + 1}
											</Flex>
											{step.title}
										</Flex>

	</span>									{index < steps.length - 1 && (
											<Flex className="flex-1">
												<Divider className={`bg-[#754FFE]`} />
											</Flex>
										)}
									</Fragment>
								);
							})}
						</Flex>
					</div> */}

							{/* <div className="mt-8">
						<Form
							form={form}
							layout="vertical"
							onFinish={handleSubmit}
							initialValues={{
								faq: [null],
								requirements: [null],
								outcomes: [null],
							}}
							// onValuesChange={handleChangeValue}
						>
							{ste</div>ps.map((step, index) => {
								return <Fragment key={index}>{step.content}</Fragment>;
							})}
							<div style={{ marginTop: 24 }}>
								{current < steps.length - 1 && (
									<Button
										onClick={() => setCurrent(current + 1)}
										className="bg-[#754FFE] text-white font-semibold"
										size="large">
										Next
									</Button>
								)}
								{current === steps.length - 1 && (
									<Button
										htmlType="submit"
										type="submit"
										className="bg-[#754FFE] text-white font-semibold"
										size="large">
										Done
									</Button>
								)}
								{current > 0 && (
									<Button
										onClick={() => setCurrent(current - 1)}
										className="text-[#754FFE] font-semibold ml-2"
										size="large">
										Previous
									</Button>
								)}
							</div>
						</Form>
					</div> */}
						</div>
					</Spring>
				</section>
			)}
		</>
	);
};

export default EditCourse;
