import React, { useState, useEffect } from "react";
import Bread from "../../components/Bread";
import Spring from "../../components/Spring";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  Row,
  Table,
  Tabs,
  Modal,
  Form,
  message,
} from "antd";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Axios from "axios";

const Category = () => {
  const [category, setCategory] = useState({ loading: true, data: null });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

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

  const showModal = (id) => {
    setCurrentCategoryId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
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

      setIsModalVisible(false);
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
                  <Button type="primary" onClick={() => showModal(record._id)}>
                    +
                  </Button>
                );
              }}
            />
          </Table>
        </div>
        <Modal
          title="Add sub category"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>
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
      </>
    </Spring>
  );
};

export default Category;
