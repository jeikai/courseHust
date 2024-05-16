import React, { useEffect } from "react";
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
} from "antd";
import Sidenav from "../components/sidenav/Sidenav";
import { Editor } from "@tinymce/tinymce-react";
import {
  FacebookOutlined,
  KeyOutlined,
  LinkedinOutlined,
  LockOutlined,
  MailOutlined,
  TwitterOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Spring from "../components/Spring";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader.jsx";
import image from "../assets/image/image.png";
import { useState } from "react";
import { to } from "@react-spring/web";
import { Toast } from "devextreme-react";
import Axios from "axios";
function Purchase() {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const [enrollmentData, setEnrollment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  async function fetchData() {
    try {
      const enrollment = await Axios({
        url: `/api/enrollment/${userId}`,
        method: "GET",
      });
      await setEnrollment(enrollment.data);
      console.log(enrollmentData, enrollment);
      setIsLoading(true)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  if (!isLoading) return <Loader />;

  const totalPrice = () => {
    let total = 0;
    enrollmentData.forEach((course) => {
      total += course.courseId.price;
    });
    return total;
  };
  const total = totalPrice();
  const columns = [
    {
      title: "Purchased courses",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <Flex align="center" gap={8} className="w-[250px]">
            <Image
              src={image}
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
          {record.courseId.price}VND
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
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
              <Typography.Title level={3}>Purchase history</Typography.Title>
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
