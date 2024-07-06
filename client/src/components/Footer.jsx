import React, { useState, useEffect } from "react";
import logo from "../assets/logo-white.png";
import { Col, Flex, Input, List, Row, Typography, Form } from "antd";
import { useAPI } from "../hooks/api";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const [category, setCategory] = useState();
  const categoryAPI = useAPI("/api/category", null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryAPI?.data) {
      setIsLoading(true);
      setCategory(categoryAPI);
      setIsLoading(false);
    }
  }, [categoryAPI]);

  const handleSearch = (e) => {
    const { search } = e;
    if (!search) {
      viewContext.handleError("You need to insert something");
    } else {
      navigate(`/courses?q=${search}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <footer className="bg-black">
      <div className="container max-w-screen-xl w-full mx-auto py-12 text-[#ffffffa4]">
        <Row>
          <Col span={10}>
            <div className="logo w-[177px] h-[44px] mb-24">
              <img src={logo} alt="logo" className="w-full h-full" />
            </div>
            <p>
              Study any topic, anytime. explore thousands of <br /> courses for
              the lowest price ever!
            </p>
          </Col>
          <Col span={4}>
            <List size="small">
              <List.Item>
                <Typography.Text className="text-white font-semibold text-xl">
                  Top categories
                </Typography.Text>
              </List.Item>
              {category?.data && category?.data.length > 0 ? (
                category?.data.map((category, index) => {
                  return (
                    <List.Item key={index}>
                      <a href={`/courses?categoryname=${category?.title}`} className="text-[#ffffffa4]">
                        {category?.title}
                      </a>
                    </List.Item>
                  );
                })
              ) : (
                <p className="text-white">No categories available</p>
              )}
            </List>
          </Col>
          <Col span={6}></Col>
          <Col span={4}></Col>
        </Row>
        <Row>
          <Flex vertical gap={12}>
            <Typography.Text className="font-semibold text-2xl text-white">
              Subscribe to our newsletter
            </Typography.Text>
            <Form layout="horizontal" onFinish={handleSearch}>
              <Form.Item name={"search"}>
                <Input.Search
                  className="bg-white"
                  size="large"
                  placeholder="What do you wanna find out?"
                  style={{ width: 400 }}
                />
              </Form.Item>
            </Form>
          </Flex>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
