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
      className={`group rounded-lg bg-white overflow-hidden courses-card-body p-3 ${
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
          className={`${list === "Grid" ? "w-full" : "w-[300px]"} h-full hover:scale-105 duration-200 rounded-md`}        />
        {course.level ? (
          <div className={"courses-card-image-text " + course.level}>
            <h3>{course.level}</h3>
          </div>
        ) : null}
      </div>
      <div className="px-3 py-1">
        <h5 className="group-hover:text-[#754FFE] font-semibold text-base capitalize">
          {course.title}
        </h5>
        <div className="course-info-card flex">
              <span className="text-[10px] text-bold my-2">{course?.instructorId.name}</span>
        </div>
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
          className="pt-4"
        >
          <Flex justify="beetween" gap={8} className="text-base justify-around">
            <h4 className="font-bold text-primary-blue group-hover:text-[#754FFE]">
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
