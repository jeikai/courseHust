import { Button, Checkbox, Col, Form, Input, Row, Typography, Upload } from "antd"
// import Layout from "../../layout/AppLayout"
import login from '../../assets/login-security.gif'
import { KeyOutlined, PhoneFilled, UploadOutlined, UserOutlined } from "@ant-design/icons"
import { useState } from "react"
const Register = () => {
  const [checked, setChecked] = useState(false)
  const handleInstructor = () => {
    setChecked(!checked)
  }
  const props = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };
  return (
    // <Layout>
      <section className="max-w-screen-xl m-auto py-24">
        <Row>
          <Col span={14}>
            <div className="flex items-center justify-center">
              <img src={login} alt="" />
            </div>
          </Col>
          <Col span={10}>
            <div className="sign-up">
              <Typography.Title level={2} className="mb-24">
                Sign up
                <span className="text-purple-600">!</span>
              </Typography.Title>
              <Typography.Text className="block text-base mb-12">
                Explore, learn, and grow with us. enjoy a seamless and <br />
                 enriching educational journey. lets begin!
              </Typography.Text>
              <Form
                layout="vertical"
              >
                <Form.Item label={<Typography.Title level={5}>First name</Typography.Title>}>
                    <Input size="large" variant="filled" placeholder="Enter your first name" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item label={<Typography.Title level={5}>Last name</Typography.Title>}>
                    <Input size="large" variant="filled" placeholder="Enter your last name" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item label={<Typography.Title level={5}>Your email</Typography.Title>}>
                    <Input size="large" variant="filled" placeholder="Enter your email" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item label={<Typography.Title level={5}>Password</Typography.Title>}>
                    <Input.Password size="large" variant="filled" placeholder="Enter your valid password" prefix={<KeyOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Checkbox onChange={handleInstructor} className="text-base">Apply to become an instructor</Checkbox>
                </Form.Item>

                {checked && 
                  <>
                    <Form.Item label={<Typography.Title level={5}>Phone</Typography.Title>}>
                        <Input size="large" variant="filled" placeholder="Enter your phone number" prefix={<PhoneFilled />} />
                    </Form.Item>

                    <Form.Item label={<Typography.Title level={5}>Document (doc, docs, pdf, txt, png, jpg, jpeg)</Typography.Title>}>
                        <Upload {...props}>
                          <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label={<Typography.Title level={5}>Messages</Typography.Title>}>
                      <Input.TextArea
                        placeholder="Input your message..."
                        autoSize={{ minRows: 4, maxRows: 6 }}
                        className="p-4"
                      />
                    </Form.Item>
                  </>
                }

                <Form.Item
                  wrapperCol={{
                    span: 24,
                  }}
                >
                  <Button type="primary" size="large" htmlType="submit" className="w-full bg-purple-600">
                    Sign up
                  </Button>
                </Form.Item>
                <Form.Item>
                  <div className="text-center">
                    <Typography.Text className="text-base tracking-widest">Already you have account? </Typography.Text>
                    <Typography.Link href="#" className="text-base tracking-widest">Log in</Typography.Link>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </section>
    //</Layout>
  )
}

export default Register