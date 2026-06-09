import React, { useContext, useState } from "react";
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  QuestionOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Flex,
  Avatar,
  Badge,
  Space,
  Typography,
  Dropdown,
} from "antd";
import logo from "../assets/logo-white.png";
import logosm from "../assets/logo-light-sm.png";
import { Link, useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import { AuthContext } from "../context/Auth";

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = ({ children }) => {
  const authContext = useContext(AuthContext)
  let user;
  const temp = localStorage.getItem("user");
  let itemProfile = [];
  if (temp != null) {
    user = JSON.parse(temp);
    itemProfile = [
      {
        key: "1",
        label: (
          <Space
            direction="vertical"
            align="center"
            justify="center"
            className="p-4"
          >
            <Avatar
              size={64}
              src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
            />
            <Typography.Title level={5}>{user?.account?.name}</Typography.Title>
            <Typography.Text>{user?.account?.email}</Typography.Text>
          </Space>
        ),
      },
      {
        key: "signout",
        label: "Log out",
        icon: <RollbackOutlined />,
      },
    ];
  }
  const handleClickProfile = ({ key }) => {
    if (key === "signout") {
      navigate(authContext.signout());
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem("Courses", "courses", <ShopOutlined />, [
      getItem("Manage courses", "/admin_main/manage_courses"),
      getItem("Add new course", "/admin_main/add_course"),
      getItem("Course category", "/admin_main/category"),
    ]),
    getItem("Instructors", "users", <UserOutlined />, [
        getItem("List of instructors", "/admin_main/instructors"),
        getItem("Request", "/admin_main/add_instructor"),
    ]),
    getItem("Quizs", "quiz", <QuestionOutlined />, [
      getItem("Manage Quiz", "/admin_main/quiz"),
      getItem("Manage Questions", '/admin_main/question'),
      getItem("Add new question", "/admin_main/add_question"),
    ])
  ];

  const navigate = useNavigate();
  return (
    <Layout hasSider>
      <Sider
        width={250}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          padding: 12,
        }}
      >
        <div className="demo-logo-vertical mb-8">
          <Link to={"/"} className="block m-auto">
            {collapsed ? (
              <img
                src={logosm}
                alt="logo"
                className="block m-auto w-[36px] h-[36px] object-contain"
              />
            ) : (
              <img
                src={logo}
                alt="logo"
                className="block m-auto w-[135px] h-[36px] object-contain"
              />
            )}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Flex align="center" justify="space-between" className="pr-4">
            <Flex align="center" gap={12}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "24px",
                  width: 64,
                  height: 64,
                }}
              />
            </Flex>
            <Flex>
              <Dropdown
                menu={{
                  items: itemProfile,
                  onClick: handleClickProfile,
                }}
                placement="bottomRight"
              >
                <Avatar
                  shape="circle"
                  size={36}
                  src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
                />
              </Dropdown>
            </Flex>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              // textAlign: 'center',
              // background: colorBgContainer,
              // borderRadius: borderRadiusLG,
            }}
            className="min-h-screen"
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Fun Course ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
