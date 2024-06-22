import {
  ClockCircleOutlined,
  FileTextFilled,
  FileTextOutlined,
  HeartFilled,
  RetweetOutlined,
  StarFilled,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Flex, Rate, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../hooks/api";

const Course = ({ list = "Grid", course = {} }) => {
  const reviews = useAPI(`/api/feedback/${course?._id}`, null);
  const layout = list === "Grid" ? "vertical" : "horizontal";
  const navigate = useNavigate();

  return (
    // On click, redirect to course detail page
    <Space
      direction={layout}
      className={`group rounded-md overflow-hidden courses-card-body ${
        list === "Grid" ? "w-[290px] " : "w-full "
      } cursor-pointer`}
      onClick={() => navigate("/courses/" + course._id)}
    >
      <div className="w-full h-[164px] relative overflow-hidden">
        <img
          src={
            course.thumbnail ||
            "https://demo.creativeitem.com/academy/uploads/thumbnails/course_thumbnails/optimized/course_thumbnail_default-new_211689234810.jpg"
          }
          alt=""
          className="w-full h-full hover:scale-105 duration-200"
        />
        {course.level ? (
          <div className={"courses-card-image-text " + course.level}>
            <h3>{course.level}</h3>
          </div>
        ) : null}
      </div>
      <div className="px-3 py-4">
        <h5 className="group-hover:text-[#754FFE] mb-2 font-semibold text-base">
          {course.title}
        </h5>
        <Flex justify="space-between">
          <Flex align="center" gap={8} className="text-[#6e798a]">
            <Rate disabled defaultValue={course?.rating} />
            <p>({reviews?.data?.length} Reviews)</p>
          </Flex>
        </Flex>
        <p className="my-2 text-line-2 text-[#6e798a]">{course.shortDes}</p>
        <Flex
          align="center"
          justify="space-between"
          className="pt-4 border-t-[0.5px] border-[#6e798a]"
        >
          <Flex align="center" gap={8} className="text-base">
            <h4 className="font-bold text-[#1E293B] group-hover:text-[#754FFE]">
              {!course.price ? "Free" : course.price.toLocaleString() + " VND"}
            </h4>
          </Flex>
          <Flex align="center" gap={8} className="text-base">
            {course?.isStream ? (
              <>
                <VideoCameraOutlined />
                <span>Stream</span>
              </>
            ) : (
              <>
                <FileTextOutlined />
                <span>Online</span>
              </>
            )}
          </Flex>
        </Flex>
      </div>
    </Space>
  );
};

export default Course;
