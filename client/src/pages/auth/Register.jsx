import { Button, Checkbox, Col, Form, Input, Row, Typography, Upload } from "antd"
// import Layout from "../../layout/AppLayout"
import login from '../../assets/login-security.gif'
import { KeyOutlined, PhoneFilled, UploadOutlined, UserOutlined } from "@ant-design/icons"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/Auth"
import Loader from "../../components/Loader"
import Axios from "axios"
import { ViewContext } from "../../context/View"
import axios from "axios"
const Register = () => {
  const [checked, setChecked] = useState(false)

  const authContext = useContext(AuthContext);
  const viewContext = useContext(ViewContext);

  const navigate = useNavigate()

  const [form] = Form.useForm();

  const handleInstructor = () => {
    setChecked(!checked)
  }
  const [imageFilesList, setImageFilesList] = useState([]);
  const serverUpload = async (options) => {
    debugger
    const { onSuccess, file, onError, onProgress } = options;
    console.log("imageFilesList: ", imageFilesList);
    setImageFilesList([...imageFilesList, file]);
    onSuccess("ok");

    try {
      const result = await Promise.all([]);
      for (let i = 0; i < imageFilesList.length; i++) {
        let file = imageFilesList[i];
        console.log("FILE: ", file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          cloudinaryInfo.CLOUDINARY_UPLOAD_PRESET
        );
        result.push(
          axios.post(cloudinaryInfo.CLOUDINARY_IMAGE_UPLOAD_URL, formData)
        );
      }
      onSuccess("ok");
    } catch (err) {
      console.log(err);
      onError(err);
    }
  };

  const props = {
    name: 'file',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        console.log(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
      }

      // setImageFilesList(info.fileList);

    },
    onRemove(file) {
      debugger

      console.log(file);
      const updateFileList = imageFilesList.filter(item => item.uid !== file.uid);
      setImageFilesList(updateFileList);
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
  // const normFile = (e) => {
  //   console.log('Upload event:', e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  const handleSubmit = async (data) => {
    console.log(data);
    try {
      const res = await Axios({
        url: "/api/user/register",
        method: "POST", 
        data: data,
      })
      navigate(authContext.signin(res))
    } catch (error) {
      console.log(error);
      viewContext.handleError(error)
    }
  }


  useEffect(() => {
    if (authContext?.user) {
      navigate('/', { replace: true })
    }
  }, [])
  return (
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
              form={form}
              onFinish={handleSubmit}
            >
              {/* <Form.Item
                hasFeedback
                name="fname"
                rules={[
                  {
                    required: true,
                    message: 'Please input your first name!',
                  },
                ]}
                label={<Typography.Title level={5}>First name</Typography.Title>}
              >
                <Input size="large" variant="filled" placeholder="Enter your first name" prefix={<UserOutlined />} />
              </Form.Item> */}
              <Form.Item
                hasFeedback
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your full name!',
                  },
                ]}
                label={<Typography.Title level={5}>Full name</Typography.Title>}
              >
                <Input size="large" variant="filled" placeholder="Enter your last name" prefix={<UserOutlined />} />
              </Form.Item>
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
                <Input size="large" variant="filled" placeholder="Enter your email" prefix={<UserOutlined />} />
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
                <Input.Password size="large" variant="filled" placeholder="Enter your valid password" prefix={<KeyOutlined />} />
              </Form.Item>
              <Form.Item>
                <Checkbox onChange={handleInstructor} className="text-base">Apply to become an instructor</Checkbox>
              </Form.Item>

              {checked &&
                <>
                  <Form.Item
                    hasFeedback
                    name="phone"
                    rules={[
                      {
                        type: 'regexp',
                        pattern: new RegExp(/^(?:\+?84|0)(?:3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/),
                        message: 'Phone number is invalid'
                      },
                      {
                        required: true,
                        message: 'Please input your phone number!',
                      },
                    ]}
                    label={<Typography.Title level={5}>Phone</Typography.Title>}
                  >
                    <Input size="large" variant="filled" placeholder="Enter your phone number" prefix={<PhoneFilled />} />
                  </Form.Item>

                  <Form.Item
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please input your document!',
                      },
                    ]}
                    name="upload"

                    label={<Typography.Title level={5}>Document (doc, docs, pdf, txt, png, jpg, jpeg)</Typography.Title>}
                  >
                    <Upload {...props}
                      customRequest={serverUpload}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={<Typography.Title level={5}>Messages</Typography.Title>}
                  >
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
  )
}

export default Register