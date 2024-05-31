import React, { useEffect, useState, useContext } from "react";
import Banner from "../components/Banner";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import Sidenav from "../components/sidenav/Sidenav";
import {
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Spring from "../components/Spring";
import Axios from "axios";
import Loader from "../components/Loader";
import { ViewContext } from "../context/View";

const Account = () => {
  const userId = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState();
  const [loading, isLoading] = useState(false);
  const [form] = Form.useForm();
  const viewContext = useContext(ViewContext);

  const handleGetData = async () => {
    try {
      isLoading(true);
      const response = await Axios({
        url: `/api/user/get/${userId.account._id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userId.authenticated}`,
        },
      });
      setUser(response.data);
      form.setFieldsValue({
        email: response.data.email,
        name: response.data.name,
        phoneNumber: response.data.phoneNumber,
      });
      isLoading(false);
    } catch (error) {
      viewContext.handleError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleSaveChanges = async (values) => {
    try {
      isLoading(true);
      const { password, newpassword, c_password, ...rest } = values;

      if (newpassword && newpassword !== c_password) {
        viewContext.handleError(
          "New password and confirm password do not match!"
        );
        isLoading(false);
        return;
      }

      const updateData = { ...rest };

      if (password) {
        updateData.password = password;
        if (newpassword) {
          updateData.newpassword = newpassword;
        }
      }

      const response = await Axios.put(
        `/api/user/update/${userId.account._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${userId.authenticated}`,
          },
        }
      );

      if (response.data.error) {
        viewContext.handleError(response.data.error);
      } else {
        setUser(response.data);
        viewContext.handleSuccess("Profile updated successfully!");
      }

      isLoading(false);
    } catch (error) {
      viewContext.handleError(error);
      isLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Banner name="Credentials" />
      <section className="max-w-screen-xl m-auto my-12">
        <Row gutter={12}>
          <Col span={6}>
            <Sidenav />
          </Col>
          <Col span={18}>
            <Spring className="bg-white shadow-lg border rounded-lg px-6 py-8">
              <Flex align="center" justify="space-between" className="mb-6">
                <Flex align="center" gap={12}>
                  <Avatar
                    size={98}
                    shape="circle"
                    src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
                  />
                  <Space direction="vertical">
                    <Typography.Title level={5}>Profile photo</Typography.Title>
                  </Space>
                </Flex>
              </Flex>
              <Typography.Title level={3}>Account information</Typography.Title>
              <Form
                form={form}
                className="w-full"
                layout="vertical"
                onFinish={handleSaveChanges}
              >
                <Row
                  gutter={[12, 30]}
                  className="pt-6 border-t pb-6 mb-8 border-b"
                >
                  <Col span={24}>
                    <Form.Item
                      name="email"
                      label={
                        <Typography.Title level={5}>Email</Typography.Title>
                      }
                      rules={[
                        { required: true, message: "Please input your Email!" },
                        {
                          type: "email",
                          message: "Please enter valid email address",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <MailOutlined className="site-form-item-icon" />
                        }
                        disabled
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="name"
                      label={
                        <Typography.Title level={5}>Name</Typography.Title>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="phoneNumber"
                      label={
                        <Typography.Title level={5}>
                          Phonenumber
                        </Typography.Title>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your phone number!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <PhoneOutlined className="site-form-item-icon" />
                        }
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="password"
                      label={
                        <Typography.Title level={5}>
                          Current password
                        </Typography.Title>
                      }
                    >
                      <Input.Password
                        prefix={<KeyOutlined className="site-form-item-icon" />}
                        placeholder="Enter current password"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="newpassword"
                      label={
                        <Typography.Title level={5}>
                          New password
                        </Typography.Title>
                      }
                    >
                      <Input.Password
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        placeholder="Enter new password"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="c_password"
                      label={
                        <Typography.Title level={5}>
                          Confirm password
                        </Typography.Title>
                      }
                    >
                      <Input.Password
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        placeholder="Re-type your password"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      className="bg-[#754FFE] px-6"
                      htmlType="submit"
                    >
                      Save changes
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Spring>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Account;
