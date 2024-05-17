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
        key: "2",
        label: "Become a Instructor",
        icon: <BookOutlined />,
      },
      {
        key: "3",
        label: "My courses",
        icon: <UngroupOutlined />,
      },
      {
        key: "4",
        label: "My messages",
        icon: <MessageOutlined />,
      },
      {
        key: "5",
        label: "User profile",
        icon: <UserOutlined />,
      },
      {
        key: "signout",
        label: "Log out",
        icon: <RollbackOutlined />,
      },
    ];
  }
  let enrollmentAPI
  if(user) {
    enrollmentAPI = useAPI(`/api/enrollment/${user?.account?._id}`, null);
  }
  const handleClickProfile = ({ key }) => {
    if (key === "signout") {
      navigate(authContext.signout());
    }
  };

  const handleClickCourses = (props) => {
    try {
      console.log(props);
      const path = props.keyPath.reverse().join("/");
      navigate(path, { replace: true });
    } catch (error) {
      console.log(error);
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
              {user.account.role == "teacher" ? (
                <div className="px-4 py-2 rounded cursor-pointer">
                  <Flex align="center" gap={0} className="text-black">
                    <Link to={"/admin"} className="text-base font-semibold">
                      Instructor
                    </Link>
                  </Flex>
                </div>
              ) : (
                <></>
              )}

              <div className="py-2 rounded cursor-pointer">
                <Flex
                  align="center"
                  gap={0}
                  onClick={() => {
                    navigate("/home/purchase_course");
                  }}
                >
                  <Badge count={0}>
                    <ShoppingCartOutlined className="text-2xl" /> ({" "}
                    {enrollmentAPI?.data?.length} )
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
