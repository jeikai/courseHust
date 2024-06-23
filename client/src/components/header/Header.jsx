import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  Dropdown,
  Empty,
  Flex,
  Space,
  Typography,
  Drawer,
  Input,
  Menu,
  message,
  Form,
} from "antd";
import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  DownOutlined,
  EditOutlined,
  HeartOutlined,
  LaptopOutlined,
  MenuOutlined,
  MessageOutlined,
  RollbackOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UngroupOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import { useAPI } from "../../hooks/api";

const Header = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [category, setCategory] = useState();
  const [schedule, setSchedule] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const categoryAPI = useAPI("/api/category", null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Course Available",
      body: "Check out our new course on React!",
    },
    { id: 2, title: "Reminder", body: "Your subscription is expiring soon." },
    {
      id: 3,
      title: "Message from Instructor",
      body: "You have a new message from your instructor.",
    },
  ]);

  let itemProfile = [];
  if (user != null) {
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
            <Typography.Title level={5}>{user.account.name}</Typography.Title>
            <Typography.Text>{user.account.email}</Typography.Text>
          </Space>
        ),
      },
      {
        key: "my_course",
        label: "My courses",
        icon: <UngroupOutlined />,
      },
      {
        key: "calendar",
        label: "My calendar",
        icon: <CalendarOutlined />,
      },
      {
        key: "user_profile",
        label: "User profile",
        icon: <UserOutlined />,
      },
      {
        key: "signout",
        label: "Log out",
        icon: <RollbackOutlined />,
      },
    ];

    // Conditionally hide "Become an Instructor" for teachers
    if (user.account.role === "teacher" || user.account.role === "admin") {
      itemProfile = itemProfile.filter(
        (item) => item.key !== "become_instructor"
      );
    } else {
      itemProfile.push({
        key: "become_instructor",
        label: "Become an Instructor",
        icon: <BookOutlined />,
      });
    }
  }

  useEffect(() => {
    if (categoryAPI.data) {
      setIsLoading(true);
      setCategory(categoryAPI);
      setIsLoading(false);
    }
    if (user) {

      // const scheduleAPI = useAPI(`/api/calendar/user/${user?.account?._id}`, null)
      // setSchedule(scheduleAPI?.data)

    }
  }, [categoryAPI, user]);

  const handleClickProfile = ({ key }) => {
    if (key === "signout") {
      navigate(authContext.signout());
    } else if (key === "calendar") {
      navigate("/home/calendar");
    } else if (key === "my_course") {
      navigate("/home/my_courses");
    } else if (key === "user_profile") {
      navigate("/home/user_credentials");
    }
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click (e.g., navigate to a specific page)
    console.log("Notification clicked:", notification);
  };

  const notificationItems = notifications.map((notification) => ({
    key: notification.id,
    label: (
      <div onClick={() => handleNotificationClick(notification)}>
        <Typography.Text strong>{notification.title}</Typography.Text>
        <Typography.Paragraph ellipsis={{ rows: 2 }}>
          {notification.body}
        </Typography.Paragraph>
      </div>
    ),
  }));

  const handleSearch = (e) => {
    const { search } = e;
    if (!search) {
      message.error("You need to insert something");
    } else {
      window.location.href = `/courses?q=${search}`;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const exploreMenu = (
    <Menu>
      {category?.data.map((cat) => (
        <Menu.Item key={cat.id}>
          <a href={`/courses?categoryname=${cat.title}`}>{cat.title}</a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <header className="py-1">
      <div className="container mx-auto max-w-screen-xl flex gap-4 items-center p-1">
        <Link to={"/"} className="logo w-[136px] h-[36px]">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </Link>
        <Flex justify="space-between" className="flex-1">
          <div className="px-4 py-2 rounded cursor-pointer">
            <Dropdown overlay={exploreMenu} trigger={["hover"]}>
              <a href="#">
                <Flex
                  align="center"
                  gap={2}
                  className="text-base font-semibold"
                >
                  <span>Explore</span>
                  <DownOutlined />
                </Flex>
              </a>
            </Dropdown>
          </div>
          <div className="px-4 py-2 rounded cursor-pointer search-container">
            <Form layout="horizontal" onFinish={handleSearch}>
              <Form.Item name={"search"}>
                <Input.Search
                  placeholder="What do you want to learn?"
                  enterButton
                  className="custom-search"
                />
              </Form.Item>
            </Form>
          </div>

          {authContext.user ? (
            <>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2} className="text-black">
                  <Link
                    to={"/home/my_courses"}
                    className="text-base font-semibold"
                  >
                    My course
                  </Link>
                </Flex>
              </div>
              {user.account.role === "teacher" &&
              user.account.is_verified === true ? (
                <div className="px-4 py-2 rounded cursor-pointer">
                  <Flex align="center" gap={0} className="text-black">
                    <Link
                      to={"/admin/manage_courses"}
                      className="text-base font-semibold"
                    >
                      Instructor
                    </Link>
                  </Flex>
                </div>
              ) : user.account.role === "admin" ? (
                <div className="px-4 py-2 rounded cursor-pointer">
                  <Flex align="center" gap={0} className="text-black">
                    <Link
                      to={"/admin_main"}
                      className="text-base font-semibold"
                    >
                      Admin Dashboard
                    </Link>
                  </Flex>
                </div>
              ) : null}

              <div className="py-2 rounded cursor-pointer">
                <Flex
                  align="center"
                  gap={0}
                  onClick={() => {
                    navigate("/home/purchase_course");
                  }}
                >
                  <Badge count={0}>
                    <ShoppingCartOutlined className="text-2xl" />
                  </Badge>
                </Flex>
              </div>
              <div className="px-2 py-2 rounded cursor-pointer">
                <Flex
                  align="center"
                  gap={2}
                  onClick={() => {
                    navigate("/home/my_whishlist");
                  }}
                >
                  <Badge count={0}>
                    <HeartOutlined className="text-2xl" />
                  </Badge>
                </Flex>
              </div>
              <div className="py-2 rounded cursor-pointer">
                <Flex align="center" gap={2}>
                  <Dropdown
                    menu={{
                      items: notificationItems,
                    }}
                    placement="bottomRight"
                  >
                    <Badge count={notifications.length}>
                      <BellOutlined className="text-2xl" />
                    </Badge>
                  </Dropdown>
                </Flex>
              </div>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2} className="text-black">
                  <Dropdown
                    menu={{
                      items: itemProfile,
                      onClick: handleClickProfile,
                    }}
                    placement="bottomRight"
                  >
                    <Avatar src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png" />
                  </Dropdown>
                </Flex>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2} className="text-black">
                  <Link to={"/login"} className="text-base font-semibold">
                    Login
                  </Link>
                </Flex>
              </div>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2}>
                  <Link
                    to={"/signup"}
                    className="text-base text-black font-semibold"
                  >
                    Join now
                  </Link>
                </Flex>
              </div>
            </>
          )}
        </Flex>
      </div>
    </header>
  );
};

export default Header;
