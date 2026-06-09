import React, { useState, useEffect } from "react";
import Bread from "../../components/Bread";
import Spring from "../../components/Spring";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Menu,
  Flex,
  Input,
  Row,
  Table,
  Tabs,
  Modal,
  Form,
  message,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Axios from "axios";

const Category = () => {
  const [category, setCategory] = useState({ loading: true, data: null });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`/api/category`);
      setCategory({ loading: false, data: response.data });
    } catch (error) {
      setCategory({ loading: false, data: null });
      message.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchData();
    console.log(category);
  }, []);

  const showAddModal = (id) => {
    setCurrentCategoryId(id);
    setIsAddModalVisible(true);
  };

  const showUpdateModal = (id) => {
    const selectedCategory = category.data.find((cat) => cat._id === id);
    updateForm.setFieldsValue({
      title: selectedCategory.title,
      description: selectedCategory.description,
    });
    setCurrentCategoryId(id);
    setIsUpdateModalVisible(true);
  };

  const showSubCategoryUpdateModal = (id, subCategory) => {
    updateForm.setFieldsValue({
      title: subCategory.title,
      description: subCategory.description,
    });
    setCurrentSubCategoryId(id);
    setIsUpdateModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
  };

  const handleAddSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      console.log("Submitted values: ", values);
      console.log("For category ID: ", currentCategoryId);

      const data = {
        title: values?.title,
        description: values?.description,
      };

      const responseAPI = await Axios.post(
        `/api/subcategory/${currentCategoryId}`,
        data
      );

      console.log("API Response: ", responseAPI);

      setIsAddModalVisible(false);
      form.resetFields();
      setIsLoading(false);
      message.success("Create successfully");
      fetchData(); // Refresh the categories after adding a subcategory
    } catch (error) {
      setIsLoading(false);
      message.error(error.toString());
      console.log("Validation Failed or API error:", error);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await updateForm.validateFields();
      console.log("Submitted values: ", values);
      console.log("For category ID: ", currentCategoryId);

      const data = {
        title: values?.title,
        description: values?.description,
      };

      const responseAPI = currentSubCategoryId
        ? await Axios.put(`/api/subcategory/${currentSubCategoryId}`, data)
        : await Axios.put(`/api/category/${currentCategoryId}`, data);

      console.log("API Response: ", responseAPI);

      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      setIsLoading(false);
      message.success("Update successfully");
      fetchData(); // Refresh the categories after updating a category or subcategory
    } catch (error) {
      setIsLoading(false);
      message.error(error.toString());
      console.log("Validation Failed or API error:", error);
    }
  };

  if (category.loading || isLoading) return <Loader />;

  const breadcrumb = [
    {
      title: "Home",
      href: "/admin_main/manage_courses",
    },
    {
      title: "Category",
    },
  ];

  function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + "...";
    }
  }

  const menu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={() => showAddModal(record._id)}>
        Add new sub category
      </Menu.Item>
      <Menu.Item key="2" onClick={() => showUpdateModal(record._id)}>
        Update
      </Menu.Item>
    </Menu>
  );

  const subCategoryColumns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text) => truncateString(text, 5),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, subCategory) => {
        return (
          <Button
            type="primary"
            onClick={() => showSubCategoryUpdateModal(subCategory._id, subCategory)}
          >
            Update
          </Button>
        );
      },
    },
  ];

  return (
    <Spring>
      <Bread
        title="Categories"
        items={breadcrumb}
        label={"Add new category"}
        link={"/admin_main/add_category"}
      />
      <>
        <div>
          <Table
            size="large"
            dataSource={category?.data}
            pagination={true}
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  columns={subCategoryColumns}
                  dataSource={record.subCategory}
                  pagination={false}
                  rowKey="_id"
                />
              ),
            }}
          >
            <Table.Column
              sorter={{
                compare: (a, b) => a.id - b.id,
              }}
              title="#"
              dataIndex={"id"}
              key={"id"}
              render={(_, record) => {
                return <>{truncateString(record._id, 5)}</>;
              }}
            />
            <Table.Column
              width={250}
              title="Title"
              dataIndex={"title"}
              key={"title"}
              render={(_, record) => {
                return (
                  <Flex vertical>
                    <Link className="font-semibold text-[#775FFE] text-line-1 w-[99%] block">
                      {record.title}
                    </Link>
                  </Flex>
                );
              }}
            />
            <Table.Column
              title="Description"
              key={"description"}
              render={(_, record) => {
                return (
                  <Flex vertical className="text-[#98a6ad] text-md">
                    <p>
                      <span className="font-semibold">
                        {record?.description}
                      </span>
                    </p>
                  </Flex>
                );
              }}
            />
            <Table.Column
              title="Actions"
              key="actions"
              render={(_, record) => {
                return (
                  <Dropdown overlay={menu(record)} trigger={["click"]}>
                    <Button icon={<EllipsisOutlined />} />
                  </Dropdown>
                );
              }}
            />
          </Table>
        </div>
        <Modal
          title="Add sub category"
          visible={isAddModalVisible}
          onCancel={handleAddCancel}
          footer={[
            <Button key="cancel" onClick={handleAddCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleAddSubmit}>
              Submit
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Update"
          visible={isUpdateModalVisible}
          onCancel={handleUpdateCancel}
          footer={[
            <Button key="cancel" onClick={handleUpdateCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
              Submit
            </Button>,
          ]}
        >
          <Form form={updateForm} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </Spring>
  );
};

export default Category;
