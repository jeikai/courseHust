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

  const finishSuccessfulPurchase = () => {
    fetchData();
    setIsLoading(false);
    viewContext.handleSuccess("Buy successfully");
    setIsModalOpen(false);
  };

  const handleFreeCheckout = async () => {
    try {
      await Axios({ url: "/api/bill/free-checkout", method: "POST" });
      finishSuccessfulPurchase();
    } catch (error) {
      viewContext.handleError(error);
      setIsLoading(false);
    }
  };

  // Polls the backend for the payment's verified status instead of trusting
  // a localStorage "storage" event - any script (or a second tab) could
  // previously fire that event itself and unlock the cart for free without
  // ever paying, since it never checked VNPAY's actual response.
  const pollPaymentStatus = (txnRef, popup) => {
    const POLL_INTERVAL_MS = 3000;
    const MAX_ATTEMPTS = 100; // ~5 minutes

    let attempts = 0;
    const intervalId = setInterval(async () => {
      attempts += 1;
      if (popup && popup.closed) {
        // User closed the VNPAY tab without finishing - stop polling, but
        // don't assume failure; they may complete it and we'd never know,
        // which is fine - nothing was granted without a confirmed payment.
        clearInterval(intervalId);
        setIsLoading(false);
        return;
      }
      if (attempts > MAX_ATTEMPTS) {
        clearInterval(intervalId);
        setIsLoading(false);
        viewContext.handleError("Payment timed out. Please check your purchase history.");
        return;
      }
      try {
        const res = await Axios({ url: `/api/vnpay/status/${txnRef}`, method: "GET" });
        const status = res.data?.status;
        if (status === "SUCCESS") {
          clearInterval(intervalId);
          if (popup && !popup.closed) popup.close();
          finishSuccessfulPurchase();
        } else if (status === "FAILED" || status === "CANCELLED") {
          clearInterval(intervalId);
          if (popup && !popup.closed) popup.close();
          setIsLoading(false);
          viewContext.handleError("Payment was not completed.");
        }
        // else still PENDING - keep polling
      } catch (error) {
        // transient network error while polling - keep trying until MAX_ATTEMPTS
      }
    }, POLL_INTERVAL_MS);
  };

  const handleOk = async () => {
    try {
      setIsLoading(true);

      if (total === 0) {
        await handleFreeCheckout();
        return;
      }

      const responseAPI_VNPAY = await Axios({
        url: "/api/vnpay",
        method: "POST",
        data: {
          bankCode: paymentMethod,
        },
      });

      const paymentUrl = responseAPI_VNPAY.data?.data;
      const txnRef = new URL(paymentUrl).searchParams.get("vnp_TxnRef");

      const newTab = window.open(paymentUrl, "_blank");
      pollPaymentStatus(txnRef, newTab);
    } catch (error) {
      viewContext.handleError(error);
      setIsLoading(false);
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
                {total > 0 && (
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
                )}
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
