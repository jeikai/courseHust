import { Button, Col, Form, Input, Row, Typography } from "antd"
// import Layout from "../../layout/AppLayout"
import login from '../../assets/login-security.gif'
import { KeyOutlined, UserOutlined } from "@ant-design/icons"
import { useFormik } from "formik";
import * as Yup from 'yup';
import { AuthContext } from "../../context/Auth";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { ViewContext } from "../../context/View";
import axios from "axios";


const Login = () => {

  const authContext = useContext(AuthContext);
  const viewContext = useContext(ViewContext);

  const navigate = useNavigate()
  const [form] = Form.useForm();

  const handleSubmit = async (data) => {
    try {
      const res = await Axios({
        url: "/api/user/login",
        method: "POST",
        data: data,
      })
      console.log(res);
      navigate(authContext.signin(res))
    } catch (error) {
      console.log(error);
      viewContext.handleError(error)
    }
  }

  useEffect(() => {
    if(authContext?.user) {
      navigate('/', {replace: true})
    }
  } ,[])
  return (
    <section className="max-w-screen-xl m-auto py-24 min-h-96">
        <Row>
          <Col span={14} className="flex items-center justify-center">
            <img src={login} alt="" />
          </Col>
          <Col span={10}>
            <div className="sign-up">
              <Typography.Title level={2} className="mb-24">
                Log in 
                <span className="text-purple-600">!</span>
              </Typography.Title>
              <Typography.Text className="block text-base mb-12">
                Explore, learn, and grow with us. enjoy a seamless and <br />
                  enriching educational journey. lets begin!
              </Typography.Text>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
              >
                <Form.Item 
                  hasFeedback
                  name="email" 
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    },
                  ]}
                  label={<Typography.Title level={5}>Your email</Typography.Title>}
                >
                    <Input 
                      size="large" 
                      variant="filled" 
                      placeholder="Enter your email" 
                      prefix={<UserOutlined />}
                    />
                </Form.Item>
                <Form.Item 
                  hasFeedback
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                  label={<Typography.Title level={5}>Password</Typography.Title>}
                >
                    <Input.Password 
                      size="large" 
                      variant="filled" 
                      placeholder="Enter your valid password" 
                      prefix={<KeyOutlined />}
                    />
                </Form.Item>
                <a href="#" className="block text-right text-base mb-2">Forget Password?</a>
                <Form.Item
                  wrapperCol={{
                    span: 24,
                  }}
                >
                  <Button type="primary" size="large" htmlType="submit" className="w-full bg-purple-600">
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
    </section>
  )
}

export default Login