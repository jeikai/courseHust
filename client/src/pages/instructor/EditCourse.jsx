/* eslint-disable no-unused-vars */
import moment from "moment";
import AddScheduleModal from "../../components/admin/AddScheduleModal";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";
import { Scheduler } from "devextreme-react";
import { Editing, Scrolling } from "devextreme-react/scheduler";
import Bread from "../../components/Bread";
import Axios from "axios";
import {
  Avatar,
  Radio,
  Alert,
  Switch,
  Button,
  Checkbox,
  Col,
  Badge,
  Calendar,
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
  DatePicker,
  TimePicker,
  message,
  InputNumber,
} from "antd";
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
  ScheduleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RowSection from "../../components/admin/RowSection";
import Spring from "../../components/Spring";
import { useAPI } from "../../hooks/api";
import Loader from "../../components/Loader";
import { uploadFile } from "../../helpers";
import {
  handleCreateSchedule,
  handleUpdateCourse,
  handleUpdateSchedule,
} from "../../api/course";
import { ViewContext } from "../../context/View";
import dayjs from "dayjs";
import ReactQuill from "react-quill";

const EditCourse = () => {
  const [courseId, setCourseId] = useState(useParams().id);
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [formLesson] = Form.useForm();
  const [formEditLesson] = Form.useForm();
  const [formSection] = Form.useForm();
  const [formEditSection] = Form.useForm();
  const [formQuiz] = Form.useForm();

  //MEDIA TAB
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  //CURRICULUM TAB
  const [idEditSection, setIdEditSection] = useState();
  const [idEditLesson, setIdEditLesson] = useState();

  const [openInputSections, setOpenInputSections] = useState(false);
  const [openEditSections, setOpenEditSections] = useState(false);
  const [openInputLesson, setOpenInputLesson] = useState(false);
  const [openEditLesson, setOpenEditLesson] = useState(false);
  const [openInputQuiz, setOpenInputQuiz] = useState(false);
  const [openEditQuiz, setOpenEditQuiz] = useState(false);
  const [courseCategory, setCourseCategory] = useState([]);
  const [formSchedule] = Form.useForm();

  const [data, setData] = useState({
    _id: courseId,
    title: "",
    category: "",
    level: "basic",
    shortDes: "",
    description: "",
    faq: [],
    outcomes: [],
    requirements: [],
    price: 0,
    free: false,
    thumbnail: null,
    video: null,
    sections: [],
    isStream: false,
  });
  const courseDataApi = useAPI(`/api/course/${courseId}`, null);
  console.log(courseDataApi)
  const categoryDataApi = useAPI(`/api/category`, null);

  const breadcrumb = [
    {
      title: "Home",
      href: "/admin/manage_courses",
    },
    {
      title: "Add New Course",
    },
  ];

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const [thumbnail, setThumbnail] = useState([]);
  const [video, setVideo] = useState([]);

  //*Handle create new lesson

  const getFile = (e) => {
    console.log("Upload event:", e);

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
    onSuccess("ok");
  };
  // set thumbnail
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      console.log(data, formData);
      const dataReq = data;
      dataReq.title = formData.title;
      dataReq.category = formData.category;
      dataReq.description = formData.description;
      dataReq.shortDes = formData.shortDes;
      dataReq.level = formData.level;
      dataReq.price = formData.price;

      console.log({ thumbnail: data.thumbnail.file });
      if (data.thumbnail && typeof data.thumbnail != "string") {
        let thumbnail = await uploadFile(data.thumbnail);
        dataReq.thumbnail = thumbnail.file_url;
        console.log("get new link");
      }
      console.log(dataReq);
      setData((prev) => dataReq);
      const result = await handleUpdateCourse(dataReq);
      setIsLoading(false);
      message.success("Update successfully");
    } catch (error) {
      message.error(error.toString());
      setIsLoading(false);
      console.log(error);
    }
  };

  const BasicInformation = (props) => {
    const handleBasicInfoData = (basicInfo) => {
      console.log("data", data);
    };
    return (
      <Spring className={""}>
        <Typography.Title level={4}>Basic Information</Typography.Title>

        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              label={
                <Typography.Title level={5}>Course Title</Typography.Title>
              }
              name="title"
            >
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
              name="category"
            >
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
              name="level"
            >
              <Select
                placeholder="Select a level"
                options={[
                  {
                    label: "Specialized",
                    value: "specialized",
                    key: "specialized",
                  },
                  {
                    label: "Advanced",
                    value: "advanced",
                    key: "advanced",
                  },
                  {
                    label: "Intermediate",
                    value: "intermediate",
                    key: "intermediate",
                  },
                  {
                    label: "Beginner",
                    value: "beginner",
                    key: "beginner",
                  },
                  {
                    label: "Basic",
                    value: "basic",
                    key: "basic",
                  },
                ]}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <Typography.Title level={5}>
                  Short description (max: 250 words)
                </Typography.Title>
              }
              name="shortDes"
            >
              <Input.TextArea
                className="py-2"
                rows={6}
                placeholder="Short description for course"
                maxLength={250}
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
              name="description"
            >
              <ReactQuill
                className="py-2"
                placeholder="Detail description for course"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className="w-full"
              label={
                <Typography.Title level={5}>Price ( VND )</Typography.Title>
              }
              name="price"
            >
              <InputNumber
                placeholder="Enter course price"
                size="large"
                type="number"
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
      console.log("change thumbnail");
      setIsLoading((prev) => true);
      if (e.fileList.length > 0 && !e.file.url && !e.file.preview) {
        e.file.preview = await getBase64(e.file.originFileObj);
        setThumbnail((prev) => [
          {
            uid: e.file.uid,
            name: e.file.name,
            url: e.file.url || e.file.preview,
          },
        ]);
        setData((prev) => ({
          ...prev,
          thumbnail: e.file.originFileObj,
        }));
      }
      console.log("new thumb", {
        uid: e.file.uid,
        name: e.file.name,
        url: e.file.url || e.file.preview,
      });
      setIsLoading((prev) => false);
    };

    return (
      <Spring className={""}>
        <Typography.Title level={4}>Courses Media</Typography.Title>

        <Row>
          <Col span={8}>
            <Typography.Title level={5}>Course thumbnail</Typography.Title>
          </Col>
          <Col span={16}>
            <Form.Item name={"thumbnail"}>
              <Upload
                // customRequest={(options) => serverUpload(options, setThumbnail)}
                listType="picture-card"
                fileList={thumbnail}
                onRemove={() => setThumbnail((prev) => [])}
                onPreview={onPreview}
                onChange={handleChange}
              >
                {thumbnail.length < 1 && (
                  <button
                    style={{
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </button>
                )}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
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
    CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
    SECTION: "ACTIVE_DRAG_ITEM_TYPE_SECTION",
  };
  const [isDragging, setIsDragging] = useState(false);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  const handleDragStart = (event) => {
    console.log("drag start", event);
    setIsDragging(true);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.sectionId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.SECTION
    );
    setActiveDragItemData(event?.active?.data?.current);
    console.log("done drag start");
  };

  const handleDragEnd = (event) => {
    console.log("dragEnd", event);
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

      console.log("sectionActive", sectionActive);
      console.log("sectionOver", sectionOver);
      console.log("positionActive", positionActive);
      console.log("positionOver", positionOver);
      console.log("section", sections);
      console.log("data", data);
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
  const Card = ({ item, section, openModalEditLesson, handleRemoveLesson }) => {
    const {
      attributes,
      listeners,
      isDragging,
      setNodeRef,
      transform,
      transition,
    } = useSortable({
      id: item?.id,
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
          justify="space-between"
        >
          <Flex align="center" gap={6}>
            {item?.videoURL !== "" && item?.videoURL ? (
              <VideoCameraOutlined />
            ) : item?.docURL !== "" && item?.docURL ? (
              <FileTextOutlined />
            ) : (
              <QuestionCircleOutlined />
            )}
            <Typography.Title style={{ marginBottom: 0 }} level={5}>
              {item?.title}
            </Typography.Title>
          </Flex>
          <Space>
            <EditOutlined
              onClick={() =>
                item?.ques
                  ? navigate(`/admin/edit_quiz/${item?._id}`)
                  : openModalEditLesson(item?._id)
              }
            />
            <DeleteOutlined onClick={() => handleRemoveLesson(item?._id)} />
          </Space>
        </Flex>
      </div>
    );
  };
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
      id: section._id,
      data: { ...section },
    });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    return (
      <div
        key={section._id}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="border border-[#e2e8f0] item rounded text-nowrap bg-white text-[#64748b] p-4"
      >
        <div>
          <Flex align="center" justify="space-between" className="mb-4">
            <Typography.Title level={5}>{section.title}</Typography.Title>
            <Space className="text-base">
              <EditOutlined onClick={() => openModalEditSection(section._id)} />
              <DeleteOutlined
                onClick={() => handleRemoveSection(section._id)}
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
              formLesson.setFieldValue("sectionId", section._id);

              setOpenInputLesson(true);
            }}
            icon={<PlusOutlined />}
          >
            Lesson
          </Button>
        </Space>
      </div>
    );
  };

  const Curriculum = () => {
    const handleOkLesson = async () => {
      try {
        setIsLoading((prev) => true);
        setOpenInputLesson(false);
        const fieldLessons = formLesson.getFieldsValue();
        let lessonId = uuidv4();
        let sectionId = fieldLessons.sectionId;
        fieldLessons.id = lessonId;

        const { sections } = data;
        //get video URL
        let videoURL = "";
        let docURL = "";
        let duration = 0;
        if (fieldLessons.file && fieldLessons.file != undefined) {
          const upFile = await uploadFile(fieldLessons.file[0].originFileObj);
          const fileType = fieldLessons.file[0].type;
          if (
            fileType ==
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileType == "application/pdf"
          ) {
            docURL = upFile.file_url;
          } else {
            videoURL = upFile.file_url;
            duration = upFile.duration || 0;
          }
        }
        console.log({ fieldLessons });
        sections.forEach((section) => {
          if (section._id === sectionId) {
            if (!section?.specs) {
              (section.specs = []), (section.specs = []);
            }
            let obj = {
              _id: {
                content: fieldLessons.content,
                id: fieldLessons.id,
                sectionId: fieldLessons.sectionId,
                title: fieldLessons.title,
                videoURL: videoURL,
                docURL: docURL,
                duration: duration,
              },
              type: "lesson",
            };
            section.specs.push(obj);
          }
        });

        setData((prevData) => ({
          ...prevData,
          sections: sections,
        }));

        formLesson.resetFields();

        setIsLoading((prev) => false);
        console.log("data", data);
        console.log(JSON.stringify(data));
        console.log("fieldLessons", fieldLessons);
      } catch (error) {
        setIsLoading((prev) => false);
        console.log(error);
      }
    };

    const handleEditLesson = async () => {

      setIsLoading((prev) => true);
      setOpenEditLesson(false);

      let newLesson = formEditLesson.getFieldsValue();

      if (newLesson.file && newLesson.file != undefined) {
        const uploadedFile = await uploadFile(newLesson.file[0].originFileObj);
        const fileType = newLesson.file[0].type;
        if (
          fileType ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileType == "application/pdf"
        ) {
          newLesson.docURL = uploadedFile.file_url;
        } else {
          newLesson.videoURL = uploadedFile.file_url;
          newLesson.duration = uploadedFile.duration;
        }
      }
      console.log(newLesson)
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
            type: "lesson",
          });
        }
      });

      setData((prevData) => ({
        ...prevData,
        sections: sections,
      }));
      console.log(data);
      setIdEditLesson(0);

      formEditLesson.resetFields();
      setIsLoading(false);
    };

    const openModalEditLesson = (id) => {
      const { sections } = data;
      console.log(id);
      sections.forEach((section) => {
        section?.specs?.forEach((item) => {
          if (item?._id?._id === id) {
            console.log("item lesson", item._id);

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
      fieldSections._id = sectionId;

      data.sections.push({
        _id: fieldSections._id,
        title: fieldSections.sectionName,
        specs: [],
      });

      console.log("fieldSections", fieldSections);
      console.log(data);

      setData(data);
      setOpenInputSections(false);

      formSection.resetFields();
    };

    const handleEditSection = () => {
      data.sections.forEach((section) => {
        if (section._id === idEditSection) {
          let newName = formEditSection.getFieldValue("sectionName");
          section.title = newName;
          setData(data);

          formEditSection.resetFields();
          setOpenEditSections(false);
        }
      });
    };

    const openModalEditSection = (id) => {
      console.log(id);
      data.sections.forEach((section) => {
        if (section._id === id) {
          console.log(data.sections);
          formEditSection.setFieldValue("sectionName", section.title);
          setIdEditSection(id);
          setOpenEditSections(true);
        }
      });
    };

    const handleRemoveLesson = (id) => {
      let { sections } = data;
      sections.forEach((section) => {
        let { specs } = section;
        let index = specs.findIndex((spec) => spec?._id?._id === id);
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
        (section) => section._id !== id
      );

      // Xóa id trong mảng sectionIds
      const updatedSectionIds = data.sections.filter(
        (section) => section._id !== id
      );

      // Cập nhật dữ liệu mới
      setData((prevData) => ({
        ...prevData,
        sections: updatedSections,
      }));
    };

    return (
      <div className={""}>
        <Typography.Title level={4}>Curriculum</Typography.Title>
        <div className="p-4">
          <div className="bg-[#f1f5f9] p-2 rounded-md mb-4">
            <Flex vertical gap={12}>
              <DndContext
                sensors={sensors}
                // onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={data?.sections}
                  strategy={verticalListSortingStrategy}
                >
                  {data?.sections.map((section) => {
                    return (
                      <RowSection
                        key={section._id}
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
              }
            >
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
                          message: "Please enter lesson title",
                        },
                      ]}
                    >
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
                          message: "please enter description",
                        },
                      ]}
                    >
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
              }
            >
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
                          message: "Please enter lesson title",
                        },
                      ]}
                    >
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
                          message: "please enter description",
                        },
                      ]}
                    >
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
              onCancel={() => setOpenInputQuiz(false)}
            >
              <Form form={formQuiz} layout="vertical">
                <Form.Item
                  label={
                    <Typography.Title level={5}>Select quiz</Typography.Title>
                  }
                >
                  <Select placeholder="Select question type">
                    <Select.Option value="multiple">
                      Multiple choice
                    </Select.Option>
                    <Select.Option value="single">
                      Single choice and True/False
                    </Select.Option>
                    <Select.Option value="text">
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
                    defaultBorderColor: "#754FFE",
                    defaultHoverColor: "white",
                    defaultHoverBorderColor: "#754FFE",
                    defaultHoverBg: "#754FFE",
                  },
                },
              }}
            >
              <Button
                onClick={() => setOpenInputSections(true)}
                className="mt-8 text-[#754FFE] font-semibold"
              >
                Add section
              </Button>

              <Modal
                title="Add a new section"
                open={openInputSections}
                onOk={handleOkSection}
                onCancel={() => setOpenInputSections(false)}
              >
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
                onCancel={() => setOpenEditSections(false)}
              >
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

  const Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [openEditSchedule, setOpenEditSchedule] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [message, setMessage] = useState({
      message: "",
      error: false,
    });
    const [targetScheduleId, setTargetScheduleId] = useState("");
    const [scheduleFormatData, setScheduleFormatData] = useState([]);

    const getDatesBetween = (startDate, endDate, dayOfWeek) => {
      const dates = [];
      let current = moment(startDate).startOf("day");
      if (current.day() !== dayOfWeek) {
        current.day(dayOfWeek);
      }

      while (current.isSameOrBefore(endDate)) {
        if (current.isSameOrAfter(startDate)) {
          dates.push(current.clone().format("YYYY-MM-DD"));
        }
        current.add(1, "week");
      }

      return dates;
    };

    const transformData = (data) => {
      return data.flatMap((item) => {
        const dates = getDatesBetween(
          item.day_start,
          item.day_end,
          item.dayOfWeek
        );
        let temp = dates;
        const exceptions = item.exceptions;
        exceptions.forEach((exceptDate) => {
          const tempDate = moment(exceptDate).format("YYYY-MM-DD");
          temp = temp.filter((date) => date != tempDate);
        });
        return temp.map((date) => ({
          ...item,
          text: item.title,
          startDate: moment(date + "T" + item.time_start).toISOString(),
          endDate: moment(date + "T" + item.time_end).toISOString(),
        }));
      });
    };

    const appointmentRender = (e) => {
      return (
        <div className="flex flex-col items-center justify-center align-middle h-full w-full">
          <div className="text-lg font-bold">{e.appointmentData.title}</div>
        </div>
      );
    };
    const handleDeleteAppointment = async (data) => {
      setIsLoading(true);
      console.log("Delete", data);
      const startDate = data.displayStartDate;
      const id = data._id;
      const exceptions = data.exceptions;
      exceptions.push(new Date(startDate));
      const updateSchedule = await Axios({
        method: "PUT",
        url: `/api/calendar/${id}`,
        data: {
          exceptions: exceptions,
        },
      });
      const scheduleDataApi = await Axios({
        url: `/api/calendar/${courseId}`,
        method: "GET",
      });

      setSchedule((prev) => scheduleDataApi.data);
      const formatData = transformData(scheduleDataApi.data || []);
      setScheduleFormatData((prev) => [...formatData]);

      setIsLoading(false);
    };
    const handleDeleteSchedule = async () => {
      setIsLoading(true);
      await Axios({
        method: "DELETE",
        url: `/api/calendar/${targetScheduleId}`,
      });
      setIsLoading(false);
    };
    const appointmentTooltipRender = ({
      targetedAppointmentData,
      appointmentData,
    }) => {
      return (
        <>
          <div className="flex flex-col w-full items-start px-5 pt-5">
            <Flex
              vertical={false}
              justify="space-between"
              className="w-full"
              align="center"
            >
              <div>
                <span className="text-base font-bold">Title: </span>
                {appointmentData.title}
              </div>
              <Flex vertical={false} gap={3}>
                <Button
                  icon={<DeleteOutlined />}
                  className=""
                  danger
                  onClick={() =>
                    handleDeleteAppointment(targetedAppointmentData)
                  }
                ></Button>
                <Button
                  icon={<EditOutlined />}
                  className=""
                  type="primary"
                  onClick={() => handleOpenEditSchedule(appointmentData)}
                ></Button>
              </Flex>
            </Flex>
            <div className="w-full overflow-hidden text-ellipsis">
              <span className="text-base w-full font-bold">Description:</span>
              {appointmentData.description}
            </div>
          </div>
          <Button className="mt-3" href={appointmentData.urlMeet}>
            Join Meeting
          </Button>
        </>
      );
    };

    const formatTime = (time) => {
      const { hours, minutes, seconds } = {
        hours: time["$H"],
        minutes: time["$m"],
        seconds: time["$s"],
      };

      const hoursNumber = parseInt(hours);
      const minutesNumber = parseInt(minutes);
      const secondsNumber = parseInt(seconds);

      const formattedTime = `${hoursNumber
        .toString()
        .padStart(2, "0")}:${minutesNumber
        .toString()
        .padStart(2, "0")}:${secondsNumber.toString().padStart(2, "0")}`;

      return formattedTime;
    };
    const onOkSchedule = async () => {
      setIsLoading(true);
      const scheduleForm = formSchedule.getFieldsValue();
      const { startTime, endTime } = scheduleForm;
      for (const prop in scheduleForm) {
        console.log("prop: ", scheduleForm[prop]);
        if (scheduleForm[prop] == undefined) {
          setMessage((prev) => ({
            message: `${prop} must be filled`,
            error: true,
          }));
          return;
        }
      }
      if (startTime >= endTime) {
        setMessage((prev) => ({
          message: `"Start time" cannot be greater than "End time"`,
          error: true,
        }));
        return;
      }
      scheduleForm.userId = userId;
      scheduleForm.courseId = courseId;
      const newSchedule = await handleCreateSchedule(scheduleForm);
      setIsLoading(false);
      formSchedule.resetFields();
      setMessage((prev) => ({
        message: newSchedule.message,
        error: newSchedule.error,
      }));
    };
    const handleOpenEditSchedule = async (appointmentData) => {
      console.log({ appointmentData });
      //title, description, deadline, dayOfWeek, startTime, endTime, urlMeet
      const data = {
        title: appointmentData.title,
        description: appointmentData.description,
        urlMeet: appointmentData.urlMeet,
      };
      const startDay = dayjs(appointmentData.day_start, "YYYY-MM-DD");
      const endDay = dayjs(appointmentData.day_end, "YYYY-MM-DD");
      data.deadline = [startDay, endDay];
      data.startTime = dayjs(appointmentData.time_start, "HH:mm:ss");
      data.endTime = dayjs(appointmentData.time_end, "HH:mm:ss");
      switch (appointmentData.dayOfWeek) {
        case 1:
          data.dayOfWeek = "Monday";
          break;
        case 2:
          data.dayOfWeek = "Tuesday";
          break;
        case 3:
          data.dayOfWeek = "Wednesday";
          break;
        case 4:
          data.dayOfWeek = "Thursday";
          break;
        case 5:
          data.dayOfWeek = "Friday";
          break;
        case 6:
          data.dayOfWeek = "Saturday";
          break;
        default:
          data.dayOfWeek = "Sunday";
      }
      data._id = appointmentData._id;
      setTargetScheduleId((prev) => appointmentData._id);
      formSchedule.setFieldsValue(data);
      setOpenEditSchedule((prev) => true);
    };

    const handleOkEditSchedule = async () => {
      setIsLoading(true);
      const data = formSchedule.getFieldsValue();
      data.courseId = courseId;
      data.userId = userId;
      data._id = targetScheduleId;
      const update = await handleUpdateSchedule(data);
      setMessage((prev) => ({
        error: true,
        message: update.message,
      }));
      setIsLoading(false);
    };

    const handleOpenMeet = (e) => {
      console.log("open", e);
    };
    const dayOfWeek = [
      {
        value: "Monday",
        label: "Monday",
      },
      {
        value: "Tuesday",
        label: "Tuesday",
      },
      {
        value: "Wednesday",
        label: "Wednesday",
      },
      {
        value: "Thursday",
        label: "Thursday",
      },
      {
        value: "Friday",
        label: "Friday",
      },
      {
        value: "Saturday",
        label: "Saturday",
      },
      {
        value: "Sunday",
        label: "Sunday",
      },
    ];
    const scheduleDataApi = useAPI(`/api/calendar/${courseId}`, null);
    useEffect(() => {
      if (scheduleDataApi.data) {
        console.log({ scheduleData: scheduleDataApi.data });
        setSchedule((prev) => scheduleDataApi.data);
        const formatData = transformData(scheduleDataApi.data || []);
        setScheduleFormatData((prev) => [...formatData]);
      }
    }, [scheduleDataApi]);

    return (
      <>
        <Flex vertical={true} align="center" justify="center" gap={10}>
          <Button
            onClick={() => {
              setOpenCalendar((prev) => true);
            }}
            className="bg-[#754FFE] text-white font-semibold self-end"
            size="large"
          >
            Add Schedule
          </Button>

          <Drawer
            title="Edit Schedule"
            width={"35rem"}
            onClose={() => {
              setOpenEditSchedule((prev) => false);
              formSchedule.resetFields();
            }}
            open={openEditSchedule}
            styles={{
              body: {
                paddingBottom: 80,
              },
            }}
            extra={
              <Space>
                <Button
                  onClick={() => {
                    formSchedule.resetFields();
                    setOpenEditSchedule((prev) => false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleOkEditSchedule} type="primary">
                  Update
                </Button>
              </Space>
            }
          >
            {message.message != "" &&
              (message.error ? (
                <Alert message={message.message} type="error" showIcon />
              ) : (
                <Alert message={message.message} type="success" showIcon />
              ))}

            <Form form={formSchedule}>
              <Row gutter={16}>
                <Col span={24}>
                  <Typography.Title level={5}>Schedule Title</Typography.Title>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "Please enter lesson title",
                      },
                    ]}
                  >
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
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter description",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Please enter description"
                    />
                  </Form.Item>
                </Col>
                <Row gutter={16} className="w-full">
                  <Col>
                    <Col span={24}>
                      <Typography.Title level={5}>
                        Start Date - End Date
                      </Typography.Title>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="deadline">
                        <DatePicker.RangePicker
                          className="w-full"
                          format={"YYYY-MM-DD"}
                          onChange={(value, dateString) =>
                            console.log(value, dateString)
                          }
                          onOk={(value) => console.log(value)}
                        />
                      </Form.Item>
                    </Col>
                  </Col>
                </Row>

                <Row
                  className="flex flex-row w-full gap-3 justify-between"
                  gutter={16}
                >
                  <Col id="day-of-week" className="w-[40%]">
                    <Col span={24}>
                      <Typography.Title level={5}>
                        Date Of Week
                      </Typography.Title>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="dayOfWeek">
                        <Select
                          showSearch
                          placeholder="Day Of Week"
                          options={dayOfWeek}
                        />
                      </Form.Item>
                    </Col>
                  </Col>
                  <Row className="flex flex-row flex-1 gap-3">
                    <Col className="">
                      <Col span={24}>
                        <Typography.Title level={5}>
                          Start Time
                        </Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="startTime">
                          <TimePicker className="" />
                        </Form.Item>
                      </Col>
                    </Col>
                    <Col className="">
                      <Col span={24}>
                        <Typography.Title level={5}>End Time</Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="endTime">
                          <TimePicker className="" />
                        </Form.Item>
                      </Col>
                    </Col>
                  </Row>
                </Row>
                <Col span={24}>
                  <Typography.Title level={5}>Meet URL</Typography.Title>
                  <Form.Item name="urlMeet">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className="flex flex-row justify-end w-full">
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteSchedule()}
                className=""
                danger
              >
                Delete This Schedule
              </Button>
            </div>
          </Drawer>
          <Drawer
            title="Add Schedule"
            width={"35rem"}
            onClose={() => setOpenCalendar((prev) => false)}
            open={openCalendar}
            styles={{
              body: {
                paddingBottom: 80,
              },
            }}
            extra={
              <Space>
                <Button onClick={() => setOpenCalendar((prev) => false)}>
                  Cancel
                </Button>
                <Button onClick={onOkSchedule} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            {message.message != "" &&
              (message.error ? (
                <Alert message={message.message} type="error" showIcon />
              ) : (
                <Alert message={message.message} type="success" showIcon />
              ))}

            <Form form={formSchedule}>
              <Row gutter={16}>
                <Col span={24}>
                  <Typography.Title level={5}>Schedule Title</Typography.Title>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "Please enter lesson title",
                      },
                    ]}
                  >
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
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter description",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Please enter description"
                    />
                  </Form.Item>
                </Col>
                <Row gutter={16}>
                  <Col>
                    <Col span={24}>
                      <Typography.Title level={5}>
                        Start Date - End Date
                      </Typography.Title>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="deadline">
                        <DatePicker.RangePicker
                          className="w-full"
                          format={"YYYY-MM-DD"}
                          onChange={(value, dateString) =>
                            console.log(value, dateString)
                          }
                          onOk={(value) => console.log(value)}
                        />
                      </Form.Item>
                    </Col>
                  </Col>
                </Row>

                <Row
                  className="flex flex-row w-full gap-3 justify-between"
                  gutter={16}
                >
                  <Col id="day-of-week" className="w-[40%]">
                    <Col span={24}>
                      <Typography.Title level={5}>
                        Date Of Week
                      </Typography.Title>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="dayOfWeek">
                        <Select
                          showSearch
                          placeholder="Day Of Week"
                          options={dayOfWeek}
                        />
                      </Form.Item>
                    </Col>
                  </Col>
                  <Row className="flex flex-row flex-1 gap-3">
                    <Col className="">
                      <Col span={24}>
                        <Typography.Title level={5}>
                          Start Time
                        </Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="startTime">
                          <TimePicker className="" />
                        </Form.Item>
                      </Col>
                    </Col>
                    <Col className="">
                      <Col span={24}>
                        <Typography.Title level={5}>End Time</Typography.Title>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="endTime">
                          <TimePicker className="" />
                        </Form.Item>
                      </Col>
                    </Col>
                  </Row>
                </Row>
                <Col span={24}>
                  <Typography.Title level={5}>Meet URL</Typography.Title>
                  <Form.Item name="urlMeet">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>

          <Scheduler
            height={730}
            showAllDayPanel={false}
            dataSource={scheduleFormatData}
            currentView={"week"}
            appointmentRender={appointmentRender}
            appointmentTooltipRender={appointmentTooltipRender}
            startDayHour={7}
            onAppointmentFormOpening={(e) => {
              e.cancel = true;
              setOpenEditSchedule(true);
            }}
            crossScrollingEnabled={true}
          >
            <Scrolling mode="virtual" />
          </Scheduler>
        </Flex>
      </>
    );
  };
  // Tabs

  let tabs = [
    {
      icon: TagsOutlined,
      name: "Overview",
      child: BasicInformation,
    },
    {
      icon: UserOutlined,
      name: "Media",
      child: Media,
    },
    {
      icon: CommentOutlined,
      name: "Curriculum",
      child: Curriculum,
    },
  ];
  if (data.isStream) {
    const schedule = tabs.find((tab) => tab.name == "Schedule");

    tabs.push({
      icon: ScheduleOutlined,
      name: "Schedule",
      child: Schedule,
      props: {},
    });
  }
  useEffect(() => {
    if (courseDataApi.data) {
      const courseData = courseDataApi.data;
      const isStream =
        courseData.isStream != null || courseData.isStream != undefined
          ? courseData.isStream
          : false;
      setData((prev) => ({
        ...prev,
        description: courseData.description,
        title: courseData.title,
        level: courseData.level,
        shortDes: courseData.shortDes,
        category: courseData.categoryId.title,
        thumbnail: courseData.thumbnail,
        sections: courseData.sections,
        price: courseData.price,
        isStream: isStream,
      }));

      setThumbnail((prev) => [
        {
          url: courseData.thumbnail,
        },
      ]);

      form.setFieldsValue(data);
    }
  }, [courseDataApi]);
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
  }, [categoryDataApi]);

  return (
    <>
      <section>
        {(courseDataApi.loading || categoryDataApi.loading || isLoading) && (
          <Loader />
        )}

        <Spring>
          <Bread title="Add new courses" items={breadcrumb} />

          <div className="w-full p-8 my-8">
            <Form
              form={form}
              layout="vertical"
              className="flex flex-col"
              onFinish={handleSubmit}
              onValuesChange={(e) => console.log("Form change", e)}
            >
              <Button
                htmlType="submit"
                className="bg-[#754FFE] text-white font-semibold self-end"
                size="large"
              >
                Save
              </Button>

              <ConfigProvider
                theme={{
                  components: {
                    Tabs: {
                      // cardGutter: 12
                      horizontalItemGutter: 50,
                      itemHoverColor: "#754FFE",
                      itemSelectedColor: "#754FFE",
                      inkBarColor: "#754FFE",
                      horizontalItemMarginRTL: "",
                    },
                  },
                }}
              >
                <Tabs
                  centered
                  className="p-4 py-10 shadow-xl rounded-md mt-8 bg-white"
                  size="large"
                  defaultActiveKey="2"
                  items={tabs.map((item, i) => {
                    return {
                      key: i,
                      label: (
                        <span className="font-semibold text-base xl:text-lg px">
                          {item.name}
                        </span>
                      ),
                      children: <item.child {...item.props} />,
                      className: "",
                      icon: <item.icon className=" text-base" />,
                    };
                  })}
                />
              </ConfigProvider>
            </Form>
          </div>
        </Spring>
      </section>
    </>
  );
};

export default EditCourse;
