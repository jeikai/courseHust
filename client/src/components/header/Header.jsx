import React, { useContext } from "react";
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
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import { useAPI } from "../../hooks/api";

const Header = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  let user;
  const itemCart = [
    {
      key: "1",
      label: <Empty />,
    },
    {
      key: "2",
      label: (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBg: "#754FFE",
                defaultHoverBorderColor: "#754FFE",
                defaultActiveBorderColor: "#754FFE",
                defaultActiveColor: "#754FFE",
                defaultHoverColor: "white",
              },
            },
          }}
        >
          <Button
            icon={<ShopOutlined />}
            size="large"
            className="w-full bg-[#F8F7FF] text-purple-500 font-semibold border-purple-500"
            onClick={() => {
              navigate("/home/purchase_course");
            }}
          >
            Check out
          </Button>
        </ConfigProvider>
      ),
    },
  ];

  //check if localStorage has item user
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

  let enrollmentAPI;
  if (user) {
    enrollmentAPI = useAPI(`/api/enrollment/${user?.account?._id}`, null);
  }

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

  return (
    <header className="py-1">
      <div className="container mx-auto max-w-screen-xl flex gap-4 items-center p-1">
        <Link to={"/"} className="logo w-[136px] h-[36px]">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </Link>
        <Flex justify="space-between" className="flex-1">
          <div className="bg-[#754ffe58] px-4 py-2 rounded cursor-pointer">
            <a href="/">
              <Flex align="center" gap={8} className="text-base text-[#754FFE]">
                <Space>
                  <MenuOutlined />
                  <span>Home</span>
                </Space>
              </Flex>
            </a>
          </div>
          <div className="px-4 py-2 rounded cursor-pointer">
            <a href="#">
              <Flex align="center" gap={2} className="text-base font-semibold">
                <span></span>
              </Flex>
            </a>
          </div>
          <div className="px-4 py-2 rounded cursor-pointer">
            <a href="#">
              <Flex align="center" gap={2} className="text-base font-semibold">
                <span></span>
              </Flex>
            </a>
          </div>
          <div className="px-4 py-2 rounded cursor-pointer">
            <a href="#">
              <Flex align="center" gap={2} className="text-base font-semibold">
                <span></span>
              </Flex>
            </a>
          </div>
          <div className="px-4 py-2 rounded cursor-pointer">
            <a href="#">
              <Flex align="center" gap={2} className="text-base font-semibold">
                <span></span>
              </Flex>
            </a>
          </div>
          <div className="px-4 py-2 rounded cursor-pointer">
            <a href="#">
              <Flex align="center" gap={2} className="text-base font-semibold">
                <span></span>
              </Flex>
            </a>
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
              {user.account.role === "teacher" && user.account.is_verified == true ? (
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
                      items: [],
                    }}
                    placement="bottomRight"
                  >
                    <Badge count={0}>
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
