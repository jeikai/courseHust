import { Button, Col, Form, Input, Row, Typography } from "antd"
import Layout from "../../layout/Layout"
import login from '../../assets/login-security.gif'
import { KeyOutlined, UserOutlined } from "@ant-design/icons"
const Login = () => {
  return (
    <Layout>
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
              >
                <Form.Item label={<Typography.Title level={5}>Your email</Typography.Title>}>
                    <Input size="large" variant="filled" placeholder="Enter your email" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item label={<Typography.Title level={5}>Password</Typography.Title>}>
                    <Input.Password size="large" variant="filled" placeholder="Enter your valid password" prefix={<KeyOutlined />} />
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
    </Layout>
  )
}

export default Login