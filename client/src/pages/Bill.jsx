import React from "react";
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
import Spring from "../components/Spring";
import image from "../assets/image/image.png";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader.jsx";

const Bill = () => {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const [isLoading, setIsLoading] = useState(false);
  const [billData, setBill] = useState([]);

  async function fetchData() {
    try {
      const bill = await Axios({
        url: `/api/bill/${userId}`,
        method: "GET",
      });
      await setBill(bill.data);
      console.log(bill);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  if (!isLoading) return <Loader />;
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
              {record.title}
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
        <h5 className="font-bold text-base capitalize">{record.price}VND</h5>
      ),
    },
    {
      title: "Level",
      key: "date",
      dataIndex: "date",
      render: (_, record) => (
        <h5 className="font-semibold text-base capitalize">{record.level}</h5>
      ),
    },
  ];
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
              <Typography.Title level={3}>My Bill</Typography.Title>
              <div>
                {billData.map((bill) => (
                  <div key={bill._id}>
                    <Table columns={columns} dataSource={bill.listOfCourse} />
                    <h3>Total: {bill.price} VND</h3>
                  </div>
                ))}
              </div>
            </Spring>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Bill;
