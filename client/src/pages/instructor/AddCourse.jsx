import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import Bread from "../../components/Bread";
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  Divider,
  Drawer,
  Dropdown,
  Flex,
  Form,
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
  message,
  theme,
} from "antd";
import {
  CheckOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  MoreOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { parse, v4 as uuidv4 } from "uuid";
import { ViewContext } from "../../context/View";
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
import Axios from "axios";
import { uploadFile } from "../../helpers";
import Loader from "../../components/Loader";

const AddCourse = () => {
  const viewContext = useContext(ViewContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
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
  const optionResponseApi = useAPI("/api/category", null).data;
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    category: "",
    level: "basic",
    shortDes: "",
    description: "",
    faq: [],
    outcomes: [],
    requirements: [],
    price: undefined,
    free: false,
    thumbnail: null,
    courseVideo: null,
    sections: [],
  });
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin/manage_courses",
    },
    {
      title: "Add New Course",
    },
  ];

  useEffect(() => {
    if (optionResponseApi) {
      setOptions(
        optionResponseApi.map((category) => ({
          label: category.title,
          value: category._id,
        }))
      );
    }
  }, [optionResponseApi]);
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const [previewOpen, setPreviewOpen] = useState(false);

  const [thumbnail, setThumbnail] = useState([]);
  // Dedicated file-list state per drawer instance, separate from `thumbnail`.
  // Sharing one state across lesson drawers was why Lesson 1's file kept showing in Lesson 2.
  const [lessonFileList, setLessonFileList] = useState([]);
  const [editLessonFileList, setEditLessonFileList] = useState([]);

  const handleOkLesson = () => {
    const fieldLessons = formLesson.getFieldsValue();
    const lessonId = uuidv4();
    const sectionId = fieldLessons.sectionId;
    const newLesson = { ...fieldLessons, id: lessonId };

    setData((prevData) => ({
      ...prevData,
      sections: (prevData.sections || []).map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          specialIds: [
            ...(section.specialIds || []),
            { id: lessonId, type: "lesson" },
          ],
          specials: [...(section.specials || []), newLesson],
        };
      }),
    }));

    setOpenInputLesson(false);
    setLessonFileList([]);
    viewContext.handleSuccess("Create successfully");
    formLesson.resetFields();
  };

  const handleEditLesson = () => {
    const newValues = formEditLesson.getFieldsValue();

    setData((prevData) => ({
      ...prevData,
      sections: (prevData.sections || []).map((section) => {
        if (!section.specials?.some((special) => special.id === idEditLesson))
          return section;
        return {
          ...section,
          specials: section.specials.map((special) =>
            special.id === idEditLesson
              ? { ...special, ...newValues, id: idEditLesson }
              : special
          ),
        };
      }),
    }));

    setIdEditLesson(undefined);
    setOpenEditLesson(false);
    setEditLessonFileList([]);
    formEditLesson.resetFields();
  };

  const openModalEditLesson = (id) => {
    const section = data.sections.find((s) =>
      s.specials?.some((item) => item.id === id)
    );
    const item = section?.specials?.find((item) => item.id === id);
    if (!item) return;

    formEditLesson.setFieldsValue({
      title: item.title,
      content: item.content,
      file: item.file,
      sectionId: section.id,
    });
    setEditLessonFileList(item.file || []);
    setIdEditLesson(id);
    setOpenEditLesson(true);
  };

  const closeLessonDrawer = () => {
    setOpenInputLesson(false);
    setLessonFileList([]);
    formLesson.resetFields();
  };

  const closeEditLessonDrawer = () => {
    setOpenEditLesson(false);
    setEditLessonFileList([]);
    setIdEditLesson(undefined);
    formEditLesson.resetFields();
  };

  const handleOkSection = () => {
    const fieldSections = formSection.getFieldsValue();
    const sectionId = uuidv4();
    const newSection = {
      ...fieldSections,
      id: sectionId,
      specialIds: [],
      specials: [],
    };

    setData((prevData) => ({
      ...prevData,
      sectionIds: [...(prevData.sectionIds || []), sectionId],
      sections: [...(prevData.sections || []), newSection],
    }));

    setOpenInputSections(false);
    formSection.resetFields();
  };

  const handleEditSection = () => {
    const newTitle = formEditSection.getFieldValue("title");

    setData((prevData) => ({
      ...prevData,
      sections: (prevData.sections || []).map((section) =>
        section.id === idEditSection
          ? { ...section, title: newTitle }
          : section
      ),
    }));

    formEditSection.resetFields();
    setOpenEditSections(false);
  };

  const openModalEditSection = (id) => {
    const section = data.sections.find((s) => s.id === id);
    if (!section) return;
    formEditSection.setFieldValue("title", section.title);
    setIdEditSection(id);
    setOpenEditSections(true);
  };

  const handleRemoveLesson = (id) => {
    setData((prevData) => ({
      ...prevData,
      sections: (prevData.sections || []).map((section) => ({
        ...section,
        specialIds: (section.specialIds || []).filter(
          (special) => special.id !== id
        ),
        specials: (section.specials || []).filter(
          (special) => special.id !== id
        ),
      })),
    }));
  };

  const handleRemoveSection = (id) => {
    setData((prevData) => ({
      ...prevData,
      sections: (prevData.sections || []).filter(
        (section) => section.id !== id
      ),
      sectionIds: (prevData.sectionIds || []).filter(
        (sectionId) => sectionId !== id
      ),
    }));
  };

  const getFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    const field = form.getFieldsValue();
    setData({ ...data, ...field });
    console.log(current);
  }, [current]);

  const serverUpload = async (options, callback) => {
    const { onSuccess, file, onError, onProgress } = options;
    console.log(file);
    callback([file]);
    onSuccess("ok");
    viewContext.handleSuccess("Upload successfully");
  };

  const fieldStepIndex = {
    title: 0,
    categoryId: 0,
    level: 0,
    shortDes: 0,
    description: 0,
    isStream: 0,
    free: 1,
    price: 1,
    thumbnail: 2,
    courseVideo: 2,
  };

  const handleSubmitFailed = ({ errorFields }) => {
    const firstErrorField = errorFields?.[0]?.name?.[0];
    if (firstErrorField in fieldStepIndex) {
      setCurrent(fieldStepIndex[firstErrorField]);
    }
    message.error("Please fill in all required fields");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!data.thumbnail?.file?.originFileObj) {
        throw new Error("You need to upload thumbnail!");
      }

      const thumbnailUpload = await uploadFile(
        data.thumbnail.file.originFileObj
      );
      const nextData = { ...data, thumbnail: thumbnailUpload.file_url };

      nextData.sections = await Promise.all(
        (nextData.sections || []).map(async (section) => {
          if (!Array.isArray(section.specials)) return section;

          const specials = await Promise.all(
            section.specials.map(async (spec) => {
              if (!spec.file || spec.file.length === 0) return spec;

              const uploadFileResponse = await uploadFile(
                spec.file[0].originFileObj
              );
              const fileType = spec.file[0].type;
              const isDocument =
                fileType ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                fileType === "application/pdf";

              return {
                ...spec,
                ...(isDocument
                  ? {
                      docURL: uploadFileResponse.file_url,
                      docFileName: uploadFileResponse.originalName,
                      docMimeType: uploadFileResponse.mimeType,
                    }
                  : {
                      videoURL: uploadFileResponse.file_url,
                      duration: uploadFileResponse.duration,
                    }),
              };
            })
          );
          return { ...section, specials };
        })
      );

      if (nextData.free) {
        nextData.price = 0;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      await Axios({
        url: "/api/course",
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.authenticated}`,
        },
        data: nextData,
      });

      setData(nextData);
      viewContext.handleSuccess("Create course successfully");
      navigate("/admin/manage_courses");
    } catch (error) {
      viewContext.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const BasicInfor = ({ index }) => (
    <Spring className={`${current === index ? "block" : "hidden"}`}>
      <Typography.Title level={4}>Basic Infomation</Typography.Title>
      <Divider></Divider>
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <Form.Item
            label={<Typography.Title level={5}>Course Title</Typography.Title>}
            name="title"
            rules={[{ required: true, message: "Please enter the course title" }]}
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
            name="categoryId"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              showSearch
              placeholder="Select a category"
              optionFilterProp="children"
              filterOption={filterOption}
              options={options}
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<Typography.Title level={5}>Courses level</Typography.Title>}
            name="level"
            initialValue="basic"
            rules={[{ required: true, message: "Please select a level" }]}
          >
            <Select
              placeholder="Select a level"
              options={[
                {
                  label: "basic",
                  value: "basic",
                },
                {
                  label: "intermediate",
                  value: "intermediate",
                },
                {
                  label: "advanced",
                  value: "advanced",
                },
                {
                  label: "specialized",
                  value: "specialized",
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
              <Typography.Title level={5}>Course Description</Typography.Title>
            }
            name="description"
            required
            rules={[
              {
                validator: (_, value) => {
                  const text = (value || "").replace(/<(.|\n)*?>/g, "").trim();
                  if (!text) {
                    return Promise.reject(
                      new Error("Please enter a course description")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
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
        <Col span={18}>
          <Form.Item
            className="w-full"
            name="isStream"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Check if you create a stream course</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Spring>
  );

  const Pricing = ({ index }) => (
    <Spring className={`${current === index ? "block" : "hidden"}`}>
      <Row>
        <Col span={6}>
          <Typography.Title level={5}></Typography.Title>
        </Col>
        <Col span={18}>
          <Form.Item className="w-full" name="free" valuePropName="checked">
            <Checkbox>Check if this is a free course</Checkbox>
          </Form.Item>
        </Col>

        <Divider />
        {!form.getFieldValue("free") && (
          <>
            <Col span={6}>
              <Typography.Title level={5}>Course price (VND)</Typography.Title>
            </Col>
            <Col span={18}>
              <Form.Item className="w-full" name="price">
                <Input
                  placeholder="Enter course price"
                  size="large"
                  type="number"
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
    </Spring>
  );

  const Media = ({ index }) => (
    <Spring className={`${current === index ? "block" : "hidden"}`}>
      <Typography.Title level={4}>Courses Media</Typography.Title>
      <Divider />
      <Row>
        <Col span={8}>
          <Typography.Title level={5}>Course thumbnail</Typography.Title>
        </Col>
        <Col span={16}>
          <Form.Item
            name={"thumbnail"}
            rules={[{ required: true, message: "Please upload a course thumbnail" }]}
          >
            <Upload
              customRequest={(options) => serverUpload(options, setThumbnail)}
              listType="picture-card"
              fileList={thumbnail}
              onRemove={() => setThumbnail([])}
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
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Typography.Title level={5}>Course video</Typography.Title>
        </Col>
        <Col span={16}>
          <Form.Item name={"courseVideo"}>
            <Upload
              customRequest={(options) => serverUpload(options, setVideo)}
              fileList={video}
              onRemove={() => setVideo([])}
            >
              <Button icon={<UploadOutlined />}>Upload your short video</Button>
            </Upload>
          </Form.Item>
        </Col> */}
      </Row>
    </Spring>
  );

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
      debugger;
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

  if (isLoading) return <Loader />;

  const Curriculum = ({ index }) => {
    return (
      <div className={`${current === index ? "block" : "hidden"}`}>
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
              onClose={closeLessonDrawer}
              open={openInputLesson}
              styles={{
                body: {
                  paddingBottom: 80,
                },
              }}
              extra={
                <Space>
                  <Button onClick={closeLessonDrawer}>
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
                    <Typography.Title level={5}>Lesson Name</Typography.Title>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter lesson name",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter lesson name" />
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
                        fileList={lessonFileList}
                        customRequest={(options) =>
                          serverUpload(options, setLessonFileList)
                        }
                        onRemove={() => setLessonFileList([])}
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
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Drawer>
            <Drawer
              title="Edit a lesson"
              width={720}
              onClose={closeEditLessonDrawer}
              open={openEditLesson}
              styles={{
                body: {
                  paddingBottom: 80,
                },
              }}
              extra={
                <Space>
                  <Button onClick={closeEditLessonDrawer}>
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
                    <Typography.Title level={5}>Lesson Name</Typography.Title>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter lesson name",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter lesson name" />
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
                        fileList={editLessonFileList}
                        customRequest={(options) =>
                          serverUpload(options, setEditLessonFileList)
                        }
                        onRemove={() => setEditLessonFileList([])}
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
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Drawer>

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
                      <Form.Item name="title">
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
                      <Form.Item name="title">
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

  const steps = [
    {
      title: (
        <Typography.Title
          level={5}
          style={{ display: "inline-block", marginBottom: 0 }}
        >
          Basic infomation
        </Typography.Title>
      ),
      content: <BasicInfor index={0} />,
    },
    {
      title: (
        <Typography.Title
          level={5}
          style={{ display: "inline-block", marginBottom: 0 }}
        >
          Pricing
        </Typography.Title>
      ),
      content: <Pricing index={1} />,
    },
    {
      title: (
        <Typography.Title
          level={5}
          style={{ display: "inline-block", marginBottom: 0 }}
        >
          Media
        </Typography.Title>
      ),
      content: <Media index={2} />,
    },
    {
      title: (
        <Typography.Title
          level={5}
          style={{ display: "inline-block", marginBottom: 0 }}
        >
          Curriculum
        </Typography.Title>
      ),
      content: <Curriculum index={3} />,
    },
    // {
    //     title: <Typography.Title level={5} style={{ display: 'inline-block', marginBottom: 0 }}>Academic progress</Typography.Title>,
    //     content: <ProgressAcademy index={5} />,
    // },
  ];

  return (
    <section>
      <Spring>
        <Bread title="Add new courses" items={breadcrumb} />
        <div className="w-full p-8 bg-white shadow-md my-8">
          <div className="w-full overflow-x-auto">
            <Flex
              align="center"
              justify="space-between"
              className="px-5"
              gap={6}
            >
              {steps.map((step, index) => {
                return (
                  <Fragment key={index}>
                    <Flex
                      className="flex-1 cursor-pointer min-w-max"
                      align="center"
                      gap={12}
                      onClick={() => setCurrent(index)}
                    >
                      <Flex
                        align="center"
                        justify="center"
                        className={`font-semibold w-10 h-10 ${
                          current >= index
                            ? "bg-[#754FFE] text-white"
                            : "bg-gray-200"
                        } rounded-full`}
                      >
                        {index + 1}
                      </Flex>
                      {step.title}
                    </Flex>

                    {index < steps.length - 1 && (
                      <Flex className="flex-1">
                        <Divider className={`bg-[#754FFE]`} />
                      </Flex>
                    )}
                  </Fragment>
                );
              })}
            </Flex>
          </div>

          <div className="mt-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onFinishFailed={handleSubmitFailed}
              initialValues={{
                faq: [null],
                requirements: [null],
                outcomes: [null],
              }}
              // onValuesChange={handleChangeValue}
            >
              {steps.map((step, index) => {
                return <Fragment key={index}>{step.content}</Fragment>;
              })}
              <div style={{ marginTop: 24 }}>
                {current > 0 && (
                  <Button
                    onClick={() => setCurrent(current - 1)}
                    className="text-[#754FFE] font-semibold ml-2"
                    size="large"
                  >
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button
                    onClick={() => setCurrent(current + 1)}
                    className="bg-[#754FFE] text-white font-semibold"
                    size="large"
                    style={{ marginLeft: 10 }}
                  >
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    htmlType="submit"
                    type="submit"
                    className="bg-[#754FFE] text-white font-semibold"
                    size="large"
                    style={{ marginLeft: 10 }}
                  >
                    Done
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </Spring>
    </section>
  );
};

export default AddCourse;
