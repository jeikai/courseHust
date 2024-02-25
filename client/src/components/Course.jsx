import { ClockCircleOutlined, HeartFilled, RetweetOutlined, StarFilled } from "@ant-design/icons"
import { Button, Flex, Space } from "antd"

const Course = ({list = "Grid"}) => {
    const layout = list === "Grid" ? 'vertical' : 'horizontal'
    return (
        <Space direction={layout} className={`group rounded-md overflow-hidden courses-card-body ${list === "Grid" ? 'w-[290px] ' : 'w-full '} cursor-pointer`}>
            <div className="w-full h-[164px] relative overflow-hidden">
                <img src="https://demo.creativeitem.com/academy/uploads/thumbnails/course_thumbnails/optimized/course_thumbnail_default-new_211689234810.jpg" alt="" className="w-full h-full hover:scale-105 duration-200" />
                <div className="bg-white absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full">
                    <HeartFilled className="text-[#6e798a81]" />
                </div>
                <div className="courses-card-image-text">
                    <h3>Intermediate</h3>
                </div>
            </div>
            <div className="px-3 py-4">
                <h5 className="group-hover:text-[#754FFE] mb-2 font-semibold text-base">WordPress Theme Development with Bootstrap</h5>
                <Flex justify="space-between">
                    <Flex align="center" gap={8} className="text-[#6e798a]">
                        <p>4</p>
                        <p>
                            <StarFilled className="text-[#ffc107]" />
                        </p>
                        <p>(2 Reviews)</p>
                    </Flex>
                    <Button size="small" type="primary" className="bg-[#754FFE]" icon={<RetweetOutlined />}>
                        Compare
                    </Button>
                </Flex>
                <p className="my-2 text-line-2 text-[#6e798a]">Learn how to confidently develop custom & profitable Responsive WordPress Themes and Websites with no prior experience.</p>
                <Flex align="center" justify="space-between" className="pt-4 border-t-[0.5px] border-[#6e798a]">
                    <Flex align="center" gap={8} className="text-base">
                        <h4 className="font-bold text-[#1E293B] group-hover:text-[#754FFE]">$10</h4>
                        <p className="text-sm text-[#6e798a]">
                            <del>$11.99</del>
                        </p>
                    </Flex>
                    <Flex align="center" gap={4}>
                        <ClockCircleOutlined className="text-[#754FFE]" />
                        <span> 24:11:44 Hours</span>
                    </Flex>
                </Flex>
            </div>
        </Space>
    )
}

export default Course