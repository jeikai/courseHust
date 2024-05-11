import React, { Fragment, useEffect, useRef, useState, useContext } from "react";
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
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
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

const AddCourse = () => {
  const viewContext = useContext(ViewContext);

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
      href: "",
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
  const [video, setVideo] = useState([]);

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
        console.log("hehe");

        if (!section?.specialIds) {
          (section.specialIds = []), (section.specials = []);
        }
        let obj = {
          id: lessonId,
          type: "lesson",
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

    console.log("data", data);
    console.log(JSON.stringify(data));
    console.log("fieldLessons", fieldLessons);
  };

  const handleEditLesson = () => {
    let newObject = formEditLesson.getFieldsValue();
    console.log(newObject);
    let { sections } = data;
    sections.forEach((section) => {
      let { specials } = section;
      let index = specials.findIndex((special) => special.id === idEditLesson);
      console.log(index);

      if (index !== -1) {
        // Tìm thấy đối tượng với id tương ứng
        // Xóa phần tử cũ
        specials.splice(index, 1);

        // Chèn đối tượng mới vào vị trí đó
        specials.splice(index, 0, newObject);
      }
    });

    setData((prevData) => ({
      ...prevData,
      sections: sections,
    }));

    setIdEditLesson(0);
    setOpenEditLesson(false);
    formEditLesson.resetFields();

    console.log(sections);
    console.log(data);
  };

  const openModalEditLesson = (id) => {
    const { sections } = data;
    console.log(id);
    sections.forEach((section) => {
      section?.specials?.forEach((item) => {
        if (item.id === id) {
          formEditLesson.setFieldValue("name", item.name);
          formEditLesson.setFieldValue(
            "content",
            item.content
          );
          formEditLesson.setFieldValue("file", item.file);
          formEditLesson.setFieldValue("sectionId", item.sectionId);

          setIdEditLesson(id);
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

    console.log("fieldSections", fieldSections);
    console.log(data);

    setData(data);
    setOpenInputSections(false);

    formSection.resetFields();
  };

  const handleEditSection = () => {
    data.sections.forEach((section) => {
      if (section.id === idEditSection) {
        let newName = formEditSection.getFieldValue("title");
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
      if (section.id === id) {
        console.log(data.sections);
        formEditSection.setFieldValue("title", section.title);
        setIdEditSection(id);
        setOpenEditSections(true);
      }
    });
  };

  const handleRemoveLesson = (id) => {
    let { sections } = data;
    sections.forEach((section) => {
      let { specials } = section;
      let index = specials.findIndex((special) => special.id === id);
      console.log(index);

      if (index !== -1) {
        // Tìm thấy đối tượng với id tương ứng
        // Xóa phần tử cũ
        specials.splice(index, 1);
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
    console.log(current);
  }, [current]);

  const serverUpload = async (options, callback) => {
    const { onSuccess, file, onError, onProgress } = options;
    console.log(file);
    callback([file]);
    onSuccess("ok");
  };

  const handleSubmit = async () => {
    // console.log(data.thumbnail);
    let thumbnail = await uploadFile(data.thumbnail.file.originFileObj)
    data.thumbnail = thumbnail.file_url
    // data.thumbnail = "img.png"
    setData({...data})
    let {sections} = data
    for (let section of sections){
      let {specials} = section
      for(let spec of specials){
        let uploadVid = await uploadFile(spec.file[0].originFileObj)
        spec.videoURL = uploadVid.file_url,
        spec.duration = uploadVid.duration
        // spec.videoURL = "vid.mp4",
        // spec.duration = 30
      }
    }
    // console.log(data);
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    // console.log(user.authenticated);
    try {
      const resCourse = await Axios({
          url: "/api/course",
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.authenticated}`
          },
          data: data
      })
      console.log(resCourse.data);
      viewContext.handleSuccess("Create course successfully")
    } catch (error) {
      console.log(error);
      viewContext.handleError(error);
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
                Short description (max: 50 words)
              </Typography.Title>
            }
            name="shortDes"
          >
            <Input.TextArea
              className="py-2"
              rows={6}
              placeholder="Short description for course"
              maxLength={50}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={
              <Typography.Title level={5}>Course Description</Typography.Title>
            }
            name="description"
          >
            <Editor
              apiKey="by05nyt9dhljko786tzo81q4vzgsn5hrdjq81e4kb3wi5yyp"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                placeholder: "Write something awesome",
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Spring>
  );

  const Information = ({ index }) => (
    <Spring className={`${current === index ? "block" : "hidden"}`}>
      <Row>
        <Col span={6}>
          <Typography.Title level={5}>Course faq</Typography.Title>
        </Col>
        <Col span={18}>
          <Form.List name="faq">
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <Flex key={field.name} gap={12} name={[field.name, "name"]}>
                  <div className="flex-1">
                    <Form.Item
                      className="w-full"
                      name={[field.name, "question"]}
                    >
                      <Input
                        placeholder="Faq question"
                        size="large"
                        showCount
                        maxLength={60}
                      />
                    </Form.Item>
                    <Form.Item className="w-full" name={[field.name, "answer"]}>
                      <Input.TextArea placeholder="Answer" size="large" />
                    </Form.Item>
                  </div>
                  {index === 0 ? (
                    <div>
                      <Button
                        onClick={() => add()}
                        classNames="bg-[#754FFE]"
                        icon={<PlusOutlined />}
                        size="large"
                      ></Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => remove(field.name)}
                        classNames="bg-[#754FFE]"
                        icon={<MinusOutlined />}
                        size="large"
                      ></Button>
                    </div>
                  )}
                </Flex>
              ))
            }
          </Form.List>
        </Col>

        <Divider />

        <Col span={6}>
          <Typography.Title level={5}>Requirements</Typography.Title>
        </Col>
        <Col span={18}>
          <Form.List name="requirements">
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <Flex key={field.name} gap={12} name={[field.name, "name"]}>
                  <div className="flex-1">
                    <Form.Item
                      className="w-full"
                      name={[field.name, "requirement"]}
                    >
                      <Input placeholder="Provide requirements" size="large" />
                    </Form.Item>
                  </div>
                  {index === 0 ? (
                    <div>
                      <Button
                        onClick={() => add()}
                        classNames="bg-[#754FFE]"
                        icon={<PlusOutlined />}
                        size="large"
                      ></Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => remove(field.name)}
                        classNames="bg-[#754FFE]"
                        icon={<MinusOutlined />}
                        size="large"
                      ></Button>
                    </div>
                  )}
                </Flex>
              ))
            }
          </Form.List>
        </Col>

        <Divider />

        <Col span={6}>
          <Typography.Title level={5}>Outcomes</Typography.Title>
        </Col>
        <Col span={18}>
          <Form.List name="outcomes">
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <Flex key={field.name} gap={12} name={[field.name, "name"]}>
                  <div className="flex-1">
                    <Form.Item
                      className="w-full"
                      name={[field.name, "outcome"]}
                    >
                      <Input placeholder="Provide outcomes" size="large" />
                    </Form.Item>
                  </div>
                  {index === 0 ? (
                    <div>
                      <Button
                        onClick={() => add()}
                        classNames="bg-[#754FFE]"
                        icon={<PlusOutlined />}
                        size="large"
                      ></Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => remove(field.name)}
                        classNames="bg-[#754FFE]"
                        icon={<MinusOutlined />}
                        size="large"
                      ></Button>
                    </div>
                  )}
                </Flex>
              ))
            }
          </Form.List>
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
              <Typography.Title level={5}>Course price ($)</Typography.Title>
            </Col>
            <Col span={18}>
              <Form.Item className="w-full" name="price">
                <Input placeholder="Enter course price" size="large" />
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
          <Form.Item name={"thumbnail"}>
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
        <Col span={8}>
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
        </Col>
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

                      fileList={video}
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
                  <Input />
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

  const progressData = [
    {
      id: 1,
      photo:
        "https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png",
      name: "Signe Thomson",
      email: "signeiner@gmail.com",
      enrolledDate: "11 Now 2020",
      completeOn: "Not completed yet",
      quizDone: 1,
      quizs: 10,
    },
  ];

  const ProgressAcademy = ({ index }) => {
    return (
      <div className={`${current === index ? "block" : "hidden"}`}>
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
          <Table.Column title="#" key={"id"} dataIndex={"id"} />
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
          <Table.Column title="Mark" key={"mark"} dataIndex={"mark"} />
          <Table.Column title="Status" key={"status"} dataIndex={"status"} />
          {/* <Table.Column
                        title="#"
                        key={"id"}
                        dataIndex={"id"}
                    /> */}
        </Table>
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
    // {
    //   title: (
    //     <Typography.Title
    //       level={5}
    //       style={{ display: "inline-block", marginBottom: 0 }}
    //     >
    //       Info
    //     </Typography.Title>
    //   ),
    //   content: <Information index={1} />,
    // },
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
                {current < steps.length - 1 && (
                  <Button
                    onClick={() => setCurrent(current + 1)}
                    className="bg-[#754FFE] text-white font-semibold"
                    size="large"
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
                  >
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button
                    onClick={() => setCurrent(current - 1)}
                    className="text-[#754FFE] font-semibold ml-2"
                    size="large"
                  >
                    Previous
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
