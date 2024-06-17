import React, { useEffect, useState, useContext } from "react";
import Banner from "../components/Banner";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Space,
  Table,
  Typography,
  Upload,
  Modal,
  Radio,
} from "antd";
import Sidenav from "../components/sidenav/Sidenav";
import {
  FacebookOutlined,
  KeyOutlined,
  LinkedinOutlined,
  LockOutlined,
  MailOutlined,
  TwitterOutlined,
  UploadOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Spring from "../components/Spring";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader.jsx";
import image from "../assets/image/image.png";
import { to } from "@react-spring/web";
import { Toast } from "devextreme-react";
import Axios from "axios";
import { ViewContext } from "../context/View.jsx";
import { useNavigate } from "react-router-dom";

function Purchase() {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const [enrollmentData, setEnrollment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("VNPAYQR"); // Set default value to "VNPAYQR"
  const viewContext = useContext(ViewContext);
  const navigate = useNavigate();
  async function fetchData() {
    try {
      const enrollment = await Axios({
        url: `/api/enrollment/${userId}`,
        method: "GET",
      });
      await setEnrollment(enrollment.data);
      console.log(enrollmentData, enrollment);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loader />;

  const totalPrice = () => {
    let total = 0;
    enrollmentData.forEach((course) => {
      total += course.courseId.price;
    });
    return total;
  };

  const total = totalPrice();

  const handleDelete = async (courseId) => {
    try {
      setIsLoading(true);
      await Axios({
        url: `/api/enrollment/${userId}/${courseId}`,
        method: "DELETE",
      });
      setEnrollment((prevData) =>
        prevData.filter((course) => course.courseId._id !== courseId)
      );
      setIsLoading(false);
      viewContext.handleSuccess("Course deleted successfully");
    } catch (error) {
      setIsLoading(false);
      viewContext.handleError("Failed to delete the course");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Purchased courses",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <Flex align="center" gap={8} className="w-[250px]">
            <Image
              src={record.courseId.thumbnail}
              width={90}
              height={90}
              className="object-cover rounded-lg"
            />
            <p className="break-words text-base font-semibold w-[150px]">
              {record.courseId.title}
            </p>
          </Flex>
        );
      },
    },
    {
      title: "Payment method",
      dataIndex: "payment",
      key: "payment",
      render: (_, record) => (
        <h5 className="font-semibold text-base capitalize">VNpay</h5>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <h5 className="font-bold text-base capitalize">
          {record.courseId.price} VND
        </h5>
      ),
    },
    {
      title: "Purchased date",
      key: "date",
      dataIndex: "date",
      render: (_, record) => (
        <h5 className="font-semibold text-base capitalize">
          {record.courseId.date_created}
        </h5>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (_, record) => {
        console.log(record);
        return (
          <DeleteOutlined
            onClick={() => handleDelete(record.courseId._id)}
            className="text-2xl cursor-pointer hover:text-purple-500"
          />
        );
      },
    },
  ];

  const columnsBill = [
    {
      title: "Purchased courses",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <Flex align="center" gap={5} className="w-[100px]">
            <p className="break-words text-base font-semibold w-[150px]">
              {record.courseId.title}
            </p>
          </Flex>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <h5 className="font-bold text-base capitalize">
          {record.courseId.price} VND
        </h5>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      setIsLoading(true);
      const responseAPI_VNPAY = await Axios({
        url: "/api/vnpay",
        method: "POST",
        data: {
          userId: userId,
          bankCode: paymentMethod,
        },
      });
      const responseAPI_CreateBill = await Axios({
        url: "/api/bill",
        method: "POST",
        data: {
          userId: userId,
        },
      });
      window.location.href = responseAPI_VNPAY?.data?.data;
      fetchData();
      setIsLoading(false);

      viewContext.handleSuccess("Buy successfully");
      setIsModalOpen(false);
    } catch (error) {
      viewContext.handleError("Buy fail!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <>
      <Banner name="Purchase history" />
      <section className="max-w-screen-xl m-auto my-12">
        <Row gutter={12}>
          <Col span={6}>
            <Sidenav />
          </Col>
          <Col span={18}>
            <Spring className="bg-white shadow-lg border rounded-lg px-6 py-8">
              <Typography.Title level={3}>My cart</Typography.Title>
              <Button
                className="bg-[#754FFE]"
                type="primary"
                size="normal"
                onClick={showModal}
              >
                Buy now
              </Button>
              <Modal
                title="Your bill"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Table columns={columnsBill} dataSource={enrollmentData} />
                <p>Total: {total} VNĐ</p>
                <div>
                  <label>Chọn Phương thức thanh toán:</label>
                  <Radio.Group
                    onChange={handlePaymentMethodChange}
                    value={paymentMethod}
                  >
                    <Radio value="VNPAYQR">Cổng thanh toán VNPAYQR</Radio>
                    <Radio value="VNPAYQR_APP">
                      Thanh toán qua ứng dụng hỗ trợ VNPAYQR
                    </Radio>
                    <Radio value="VNBANK">
                      Thanh toán qua ATM-Tài khoản ngân hàng nội địa
                    </Radio>
                    <Radio value="INTCARD">Thanh toán qua thẻ quốc tế</Radio>
                  </Radio.Group>
                </div>
              </Modal>
              <div>
                <Table columns={columns} dataSource={enrollmentData} />
              </div>
            </Spring>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default Purchase;
