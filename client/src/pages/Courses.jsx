// import Layout from "../layout/AppLayout";
import breadcramb from "../assets/course-breadcramb.png";
import book from "../assets/brd-book.png";
import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Radio,
  Rate,
  Row,
  Segmented,
  Space,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  BarsOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Course from "../components/Course";
import { useEffect, useState } from "react";
import { getCategories } from "../api/category";
import { useLocation } from "react-router-dom";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader";
const Courses = () => {
  const [list, setList] = useState("List");
  const location = useLocation();
  const [categories, setCategories] = useState();
  const [courses, setCourses] = useState();
  const [search, setSearch] = useState();
  const coursesAPI = useAPI("/api/course", null);
  const categoryAPI = useAPI("/api/category", null);
  const [isLoading, setIsLoading] = useState(false);

  const [param, setParam] = useState({
    q: "",
    categoryname: "all",
    price: "all",
    level: "all",
    rating: "all",
  });
  useEffect(() => {
    if (coursesAPI.data && categoryAPI.data) {
      setIsLoading(true);
      setCourses(coursesAPI);
      setCategories(categoryAPI);
      if (param.q) {
        let filteredCourses = coursesAPI?.data;
        filteredCourses = filteredCourses.filter((course) =>
          course.title.toLowerCase().includes(param.q.toLowerCase())
        );
        setSearch(filteredCourses);
      } else if (param.categoryname) {
        let filteredCourses = coursesAPI?.data;
        filteredCourses = filteredCourses.filter(
          (course) => course.categoryId.title === param.categoryname
        );
        setSearch(filteredCourses);
      }
      setIsLoading(false);
    }
  }, [coursesAPI, categoryAPI]);

  const handleGetCourses = async (param) => {
    try {
      console.log(param);
      let filteredCourses = courses?.data;
      if (filteredCourses) {
        console.log(filteredCourses);
        if (param?.q) {
          console.log("search");
          filteredCourses = filteredCourses.filter((course) =>
            course.title.toLowerCase().includes(param.q.toLowerCase())
          );
        }

        if (param.categoryname && param.categoryname != "all") {
          console.log("category");
          filteredCourses = filteredCourses.filter(
            (course) => course.categoryId.title === param.categoryname
          );
        }

        if (param.price && param.price != "all") {
          console.log("price");
          filteredCourses = filteredCourses.filter(
            (course) => param.price === (course.price > 0 ? "paid" : "free")
          );
        }

        if (param.level && param.level !== "all") {
          console.log("level");
          filteredCourses = filteredCourses.filter(
            (course) => course.level === param.level.toLowerCase()
          );
        }
      }
      console.log(filteredCourses);
      await setSearch(filteredCourses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let newParam = param;

    if (urlParams.get("q")) {
      newParam.q = urlParams.get("q");
    }

    if (urlParams.get("categoryname")) {
      newParam.categoryname = urlParams.get("categoryname");
    }

    if (urlParams.get("price")) {
      newParam.price = urlParams.get("price");
    }

    if (urlParams.get("level")) {
      newParam.level = urlParams.get("level");
    }

    if (urlParams.get("rating")) {
      newParam.rating = parseInt(urlParams.get("rating"));
    }

    setParam(newParam);

    handleGetCourses(newParam);
  }, []);

  const handleChangeParams = async (type, value) => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has(type)) {
      // Param đã tồn tại, thay đổi giá trị
      urlParams.set(type, value);

      if (value === "all") {
        urlParams.delete(type);
      }
    } else {
      // Param không tồn tại, thêm mới
      urlParams.append(type, value);
    }

    // Cập nhật URL mới
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, null, newUrl);

    let newParam = param;

    if (urlParams.get("q")) {
      newParam.q = urlParams.get("q");
    }

    if (urlParams.get("categoryname")) {
      newParam.categoryname = urlParams.get("categoryname");
    }

    if (urlParams.get("price")) {
      newParam.price = urlParams.get("price");
    }

    if (urlParams.get("level")) {
      newParam.level = urlParams.get("level");
    }

    if (urlParams.get("rating")) {
      newParam.rating = parseInt(urlParams.get("rating"));
    }

    setParam(newParam);

    handleGetCourses(newParam);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <section
        style={{ backgroundImage: `url(${breadcramb})` }}
        className="my-6"
      >
        <Row className="max-w-screen-xl m-auto">
          <Col span={18} className="flex items-center">
            <Space direction="vertical">
              <Breadcrumb
                className="z-10 text-2xl"
                items={[
                  {
                    href: "/",
                    title: (
                      <>
                        <HomeOutlined
                          style={{ fontSize: "24px", color: "white" }}
                        />
                        <span className="text-white">Home</span>
                      </>
                    ),
                  },
                  {
                    title: <span className="text-white">Course</span>,
                  },
                ]}
              />
              <Typography.Title
                level={1}
                style={{ color: "white", marginTop: "12px" }}
              >
                Courses
              </Typography.Title>
            </Space>
          </Col>
          <Col span={6}>
            <img src={book} alt="book" className="w-[212px] h-[212px]" />
          </Col>
        </Row>
      </section>
      <section className="max-w-screen-xl m-auto">
        <Row gutter={64}>
          <Col span={5} className="shadow-lg">
            <Space direction="vertical">
              <Space direction="vertical" className="p-4">
                <Typography.Title
                  level={4}
                  className="border-b-2 border-purple-400"
                >
                  Categories
                </Typography.Title>
                <Radio.Group
                  onChange={(e) =>
                    handleChangeParams("categoryname", e.target.value)
                  }
                  value={param.categoryname}
                >
                  {/* <Typography.Paragraph ellipsis={ellipsis}> */}
                  <Space direction="vertical">
                    <Radio className="text-base" value={"all"}>
                      {"All"}
                    </Radio>
                    {categories?.data.map((category) => {
                      return (
                        <Radio className="text-base" value={category.title}>
                          {category.title}
                        </Radio>
                      );
                    })}
                  </Space>
                  {/* </Typography.Paragraph> */}
                </Radio.Group>
              </Space>
              <Space direction="vertical" className="p-4">
                <Typography.Title
                  level={4}
                  className="border-b-2 border-purple-400"
                >
                  Price
                </Typography.Title>
                <Radio.Group
                  onChange={(e) => handleChangeParams("price", e.target.value)}
                  value={param.price}
                >
                  <Space direction="vertical">
                    <Radio className="text-base" value={"all"}>
                      All
                    </Radio>
                    <Radio className="text-base" value={"free"}>
                      Free
                    </Radio>
                    <Radio className="text-base" value={"paid"}>
                      Paid
                    </Radio>
                  </Space>
                </Radio.Group>
              </Space>
              <Space direction="vertical" className="p-4">
                <Typography.Title
                  level={4}
                  className="border-b-2 border-purple-400"
                >
                  Level
                </Typography.Title>
                <Radio.Group
                  onChange={(e) => handleChangeParams("level", e.target.value)}
                  value={param.level}
                >
                  <Space direction="vertical">
                    <Radio className="text-base" value={"all"}>
                      All
                    </Radio>
                    <Radio className="text-base" value={"begginer"}>
                      Beginner
                    </Radio>
                    <Radio className="text-base" value={"intermediate"}>
                      Intermediate
                    </Radio>
                    <Radio className="text-base" value={"advanced"}>
                      Advanced
                    </Radio>
                  </Space>
                </Radio.Group>
              </Space>
              <Space direction="vertical" className="p-4">
                <Typography.Title
                  level={4}
                  className="border-b-2 border-purple-400"
                >
                  Rating
                </Typography.Title>
                <Radio.Group
                  onChange={(e) => handleChangeParams("rating", e.target.value)}
                  value={param.rating}
                >
                  <Space direction="vertical">
                    <Radio className="text-base" value={"all"}>
                      All
                    </Radio>
                    <Radio className="text-base" value={1}>
                      <Rate disabled defaultValue={1} />
                    </Radio>
                    <Radio className="text-base" value={2}>
                      <Rate disabled defaultValue={2} />
                    </Radio>
                    <Radio className="text-base" value={3}>
                      <Rate disabled defaultValue={3} />
                    </Radio>
                    <Radio className="text-base" value={4}>
                      <Rate disabled defaultValue={4} />
                    </Radio>
                    <Radio className="text-base" value={5}>
                      <Rate disabled defaultValue={5} />
                    </Radio>
                  </Space>
                </Radio.Group>
              </Space>
            </Space>
          </Col>
          <Col span={19}>
            <Row>
              <Col>
                <ConfigProvider
                  theme={{
                    components: {
                      Segmented: {
                        itemSelectedBg: "#754FFE",
                        itemSelectedColor: "#FFFFFF",
                        itemHoverBg: "#754FFE",
                        itemHoverColor: "#FFFF",
                      },
                    },
                  }}
                >
                  <Segmented
                    onChange={(e) => setList(e)}
                    size="large"
                    options={[
                      {
                        value: "List",
                        icon: <BarsOutlined className="p-2 text-2xl" />,
                      },
                      {
                        value: "Grid",
                        icon: <AppstoreOutlined className="p-2 text-2xl" />,
                      },
                    ]}
                  />
                </ConfigProvider>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="mt-4">
              {search?.map((search) => {
                return (
                  <Col span={list === "List" ? 20 : 8}>
                    <Course list={list} course={search}></Course>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Courses;
