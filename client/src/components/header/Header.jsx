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
  notification,
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
import Loader from "../Loader";
import axios from "axios"; // Make sure axios is installed

const Header = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const categoryAPI = useAPI("/api/category", null);
  const [schedule, setSchedule] = useState(null);
  const [notifiedCourses, setNotifiedCourses] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

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
      // itemProfile.push({
      //   key: "become_instructor",
      //   label: "Become an Instructor",
      //   icon: <BookOutlined />,
      // });
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/notification/${user.account._id}`);
          setNotifications(response.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
    fetchNotifications();
  }, [user]);

  if (user != null) {
    useEffect(() => {
      const fetchSchedule = async () => {
        const response = await axios.get(
          `/api/calendar/user/${user.account._id}`
        );
        setSchedule(response.data);
      };
      fetchSchedule();
    }, [user.account._id]);
  }

  useEffect(() => {
    const checkSchedule = () => {
      if (!schedule) return;

      const now = new Date();
      const dayOfWeek = now.getDay();

      schedule.forEach((item) => {
        console.log(item, now);
        const startDate = new Date(item.day_start);
        const endDate = new Date(item.day_end);

        if (now >= startDate && now <= endDate) {
          console.log("Vẫn trong ngày thông báo");
          if (dayOfWeek === item.dayOfWeek) {
            console.log("Đến ngày rồi");

            const exceptions = item.exceptions.map((date) => new Date(date));
            const isException = exceptions.some(
              (exceptionDate) =>
                exceptionDate.toDateString() === now.toDateString()
            );

            if (isException) {
              console.log("Hôm nay là ngày ngoại lệ");
              return;
            }

            const [startHour, startMinute] = item.time_start.split(":");
            const [endHour, endMinute] = item.time_end.split(":");
            const startTime = new Date(now);
            startTime.setHours(startHour, startMinute, 0);
            const endTime = new Date(now);
            endTime.setHours(endHour, endMinute, 0);

            if (now >= startTime && now <= endTime) {
              console.log("Đến giờ rồi");
              if (!notifiedCourses.has(item.courseId?._id)) {
                sendNotification(item);
                setNotifiedCourses((prev) =>
                  new Set(prev).add(item.courseId?._id)
                );
              }
            }
          }
        }
      });
    };

    const sendNotification = async (item) => {
      const now = new Date();
      const responseAPI = await axios.post("/api/notification", {
        userId: user.account._id,
        courseId: item?.courseId?._id,
        title: `${item?.title}`,
        body: `It's time for your class: ${item?.courseId?.title}`,
        dayOfWeek: item?.dayOfWeek,
        time_start: item?.time_start,
        time_end: item?.time_end,
        now: now,
      });
      console.log(responseAPI);
      notification.info({
        message: `${item?.title}`,
        description: `It's time for your class: ${item?.courseId?.title}`,
        placement: "bottomRight",
      });
    };

    const intervalId = setInterval(checkSchedule, 20000);

    return () => clearInterval(intervalId);
  }, [schedule, notifiedCourses]);

  useEffect(() => {
    if (categoryAPI.data) {
      setIsLoading(true);
      setCategory(categoryAPI);
      setIsLoading(false);
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
    if (notification.courseId) {
      navigate(`/courses/${notification.courseId}`);
    }
  };

  const notificationItems = notifications.map((notification) => ({
    key: notification._id,
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

  if (isLoading || schedule?.loading) {
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
