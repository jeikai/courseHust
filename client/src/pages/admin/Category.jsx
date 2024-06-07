import React from "react";
import Bread from "../../components/Bread";
import Spring from "../../components/Spring";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  Row,
  Table,
  Tabs,
} from "antd";
import { useAPI } from "../../hooks/api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

const Category = () => {
  const category = useAPI(`/api/category`, null);
  console.log(category);
  if (category.loading) return <Loader />;
  const breadcrumb = [
    {
      title: "Home",
      href: "/admin_main/manage_courses",
    },
    {
      title: "Category",
    },
  ];
  function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + "...";
    }
  }
  return (
    <Spring>
      <Bread
        title="Categries"
        items={breadcrumb}
        label={"Add new category"}
        link={"/admin_main/add_category"}
      />
      <>
        <div>
          <Table size="large" dataSource={category?.data} pagination={true}>
            <Table.Column
              sorter={{
                compare: (a, b) => a.id - b.id,
              }}
              title="#"
              dataIndex={"id"}
              key={"id"}
              render={(_, record) => {
                return <>{truncateString(record._id, 5)}</>;
              }}
            />
            <Table.Column
              width={250}
              title="Title"
              dataIndex={"title"}
              key={"title"}
              render={(_, record) => {
                return (
                  <Flex vertical>
                    <Link className="font-semibold text-[#775FFE] text-line-1 w-[99%] block">
                      {record.title}
                    </Link>
                  </Flex>
                );
              }}
            />
            <Table.Column
              // width={180}
              title="Description"
              key={"description"}
              render={(_, record) => {
                return (
                  <Flex vertical className="text-[#98a6ad] text-md">
                    <p>
                      <span className="font-semibold">
                        {record?.description}
                      </span>
                    </p>
                  </Flex>
                );
              }}
            />
          </Table>
        </div>
      </>
    </Spring>
  );
};

export default Category;
