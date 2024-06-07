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
  Row,
  Col,
  Divider,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Spring from "../../components/Spring";
import { ViewContext } from "../../context/View";

const Instructors = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

        const newData = users
          .filter((user) => user.role === "teacher" && user.is_verified)
          .map((user, index) => ({
            id: index + 1,
            _id: user._id,
            photo: user.avatar || "https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png",
            name: user.name,
            email: user.email,
            phone: user.phoneNumber || "N/A",
            date: new Date(user.date_created).toLocaleDateString(),
            documentUrl: user.documentUrl,
          }));

        setData(newData);
        setFilteredData(newData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  return (
    <Spring>
      <Bread title="Instructor" items={breadcrumb} />
      <div className="shadow-md border bg-white p-8">
        <div className="text-right mb-4">
          <Input.Search
            placeholder="Search by name"
            style={{ width: 200 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table
          size="large"
          dataSource={filteredData}
          pagination={true}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: '20px' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Image
                      width={200}
                      src={record.documentUrl || "https://via.placeholder.com/200"}
                      alt="Document"
                    />
                  </Col>
                  <Col span={18}>
                    <Typography.Title level={5}>Name: {record.name}</Typography.Title>
                    <p>Email: {record.email}</p>
                    <p>Phone: {record.phone}</p>
                    <p>Enrollment Date: {record.date}</p>
                  </Col>
                </Row>
                <Divider />
              </div>
            ),
          }}
          columns={[
            { title: "#", dataIndex: "id", key: "id", width: 80, sorter: (a, b) => a.id - b.id },
            { title: "Photo", dataIndex: "photo", key: "photo", width: 100, render: (_, record) => <Avatar size={48} src={record.photo} /> },
            { title: "Name", dataIndex: "name", key: "name", render: (_, record) => <Typography.Title level={5} style={{ marginBottom: 0 }}>{record.name}</Typography.Title> },
            { title: "Email", dataIndex: "email", key: "email", render: (_, record) => <Typography.Title level={5} style={{ marginBottom: 0 }}>{record.email}</Typography.Title> },
            { title: "Phone", dataIndex: "phone", key: "phone", render: (_, record) => <p>{record.phone}</p> },
            { title: "Enrollment date", dataIndex: "date", key: "date", render: (_, record) => <p>{record.date}</p> }
          ]}
        />
      </div>
    </Spring>
  );
};

export default Instructors;
