import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Bread from "../../components/Bread";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  List,
  Table,
  Typography,
  message,
  Image,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Spring from "../../components/Spring";
import { ViewContext } from "../../context/View";

const Instructors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const viewContext = useContext(ViewContext);
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin_main",
    },
    {
      title: "Instructor",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5500/api/user/get");
        const users = response.data;

        const filteredData = users
          .filter((user) => user.role === "teacher" && !user.is_verified)
          .map((user, index) => ({
            id: index + 1,
            _id: user._id,
            photo:
              user.avatar ||
              "https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png",
            name: user.name,
            email: user.email,
            phone: user.phoneNumber || "N/A",
            date: new Date(user.date_created).toLocaleDateString(),
            documentUrl: user.documentUrl,
            courses: ["course 1", "course 2", "course 3"], // This should be updated with actual course data if available
          }));

        setData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await axios.put(`http://localhost:5500/api/user/${userId}/verify`);
      message.success("User verified successfully");
      setData(data.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error verifying user:", error);
      message.error("Failed to verify user");
    }
  };

  return (
    <Spring>
      <Bread
        title="Instructor"
        items={breadcrumb}
      />
      <div className="shadow-md border bg-white p-8">
        <Table
          size="large"
          dataSource={data}
          pagination={true}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Image
                  width={200}
                  src={record.documentUrl || "https://via.placeholder.com/200"}
                  alt="Document"
                />
                <Button
                  type="primary"
                  onClick={() => handleAccept(record._id)}
                  style={{ marginTop: 16 }}
                >
                  Accept
                </Button>
              </div>
            ),
          }}
        >
          <Table.Column
            width={80}
            sorter={{ compare: (a, b) => a.id - b.id }}
            title="#"
            dataIndex="id"
            key="id"
          />
          <Table.Column
            width={100}
            title="Photo"
            dataIndex="photo"
            key="photo"
            render={(_, record) => (
              <Avatar size={48} shape="circle" src={record.photo} />
            )}
          />
          <Table.Column
            title="Name"
            dataIndex="name"
            key="name"
            render={(_, record) => (
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {record.name}
              </Typography.Title>
            )}
          />
          <Table.Column
            title="Email"
            dataIndex="email"
            key="email"
            render={(_, record) => (
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {record.email}
              </Typography.Title>
            )}
          />
          <Table.Column
            title="Phone"
            dataIndex="phone"
            key="phone"
            render={(_, record) => (
              <div className="text-base">
                <p>{record.phone}</p>
              </div>
            )}
          />
          <Table.Column
            title="Enrollment date"
            dataIndex="date"
            key="date"
            render={(_, record) => (
              <div className="text-md">
                <p>{record.date}</p>
              </div>
            )}
          />
        </Table>
      </div>
    </Spring>
  );
};

export default Instructors;
