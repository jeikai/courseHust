import { Button, Col, Form, Input, Row, Typography } from "antd"
// import Layout from "../../layout/AppLayout"
import login from '../../assets/login-security.gif'
import { KeyOutlined, UserOutlined } from "@ant-design/icons"
import { useFormik } from "formik";
import * as Yup from 'yup';
import { AuthContext } from "../../context/Auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate()
  const initialValues = {
    email: '',
    password: '',
  }; 
  const validationSchema = Yup.object({
    email: Yup.string()
            .email('Invalid format email')
            .required('Required!'),
    password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Required!"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleSubmit(values)
  })
  const handleSubmit = (data) => {
    console.log(data);
    const res = {
      data: data
    }
    debugger
    navigate(authContext.signin(res))
  }
  return (
    <section className="max-w-screen-xl m-auto py-24">
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
              onFinish={formik.handleSubmit}
            >
              <Form.Item 
                hasFeedback
                validateStatus={formik.touched.email && formik.errors.email && "error"}
                help={formik.touched.email && formik.errors.email && `${formik.errors.email}`}
                label={<Typography.Title level={5}>Your email</Typography.Title>}
              >
                  <Input 
                    name="email" 
                    size="large" 
                    variant="filled" 
                    placeholder="Enter your email" 
                    prefix={<UserOutlined />}
                    value={formik.values.email}
                    onChange={formik.handleChange} 
                  />
              </Form.Item>
              <Form.Item 
                hasFeedback
                validateStatus={formik.touched.password && formik.errors.password && "error"}
                help={formik.touched.password && formik.errors.password && `${formik.errors.password}`}
                label={<Typography.Title level={5}>Password</Typography.Title>}
              >
                  <Input.Password 
                    size="large" 
                    variant="filled" 
                    placeholder="Enter your valid password" 
                    prefix={<KeyOutlined />}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange} 
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