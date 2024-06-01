import React, { useEffect, useState, useContext } from "react";
import Spring from "../../components/Spring";
import Bread from "../../components/Bread";
import {
  Form,
  Input,
  Image,
  Select,
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Progress,
  Radio,
  Space,
  Typography,
} from "antd";
import Axios from "axios";
import { Icon } from "@iconify/react";
import { ViewContext } from "../../context/View";
import axios from "axios";
const AddCategory = () => {
  const viewContext = useContext(ViewContext);
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin/category",
    },
    {
      title: "Add a new category",
    },
  ];

  const handleFinish = async (data) => {
    if (!data.title || !data.description) {
        viewContext.handleError("Title and Description are required.");
        return;
    }
    try {
        const response = await Axios({
            url: '/api/category',
            method: 'POST',
            data: data
        })
    } catch (error) {
      viewContext.handleError(error.toString());
    }
  };
  const [formCategory] = Form.useForm();
  return (
    <Spring>
      <Bread title="Add a new category" items={breadcrumb} />
      <div className="shadow-md border bg-white w-2/3 m-auto p-4">
        <Typography.Title level={5}>FORM ADD A NEW CATEGORY</Typography.Title>
        <Form form={formCategory} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name={"title"}
            label={<Typography.Title level={5}>Title</Typography.Title>}
          >
            <Input placeholder="title" />
          </Form.Item>
          <Form.Item
            name={"description"}
            label={<Typography.Title level={5}>Description</Typography.Title>}
          >
            <Input placeholder="description" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </div>
    </Spring>
  );
};

export default AddCategory;
