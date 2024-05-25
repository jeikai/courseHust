import React from "react";
import Banner from "../components/Banner";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import Sidenav from "../components/sidenav/Sidenav";
import { Scheduler } from "devextreme-react";
import { Editing, Scrolling } from "devextreme-react/scheduler";

const Calendar = () => {
  let sourceData = [
    {
      userId: 0,
      courseId: 1,
      title: "Introduction to the course",
      description: "A short meeting introduce the course",
      urlMeet: "https://meet.google.com/abc-xyz",
      date_start: new Date(Date.now()),
      date_created: new Date("2023-5-12T08:00:00"),
      date_updated: new Date("2023-5-12T08:00:00"),
    },
  ];
  const appointmentRender = (e) => {
    return (
      <div>
        <div>{e.appointmentData.title}</div>
      </div>
    );
  };

  const appointmentTooltipRender = (e) => {
    return (
      <div>
        <div>{e.appointmentData.title}</div>
        <div>{e.appointmentData.description}</div>
        <Button href={e.appointmentData.urlMeet}> Join Metting </Button>
      </div>
    );
  };

  // remap data
  sourceData = sourceData.map((item) => {
    return {
      ...item,
      text: item.title,
      startDate: item.date_start,
      // endDate is after 1 hour
      endDate: new Date(item.date_start.getTime() + 60 * 60 * 1000),
    };
  });
  console.log(sourceData);
  return (
    <>
      <Banner name="My Schedule" />
      <section className="max-w-screen-xl m-auto my-12">
        <Row gutter={12}>
          <Col span={6}>
            <Sidenav />
          </Col>
          <Col span={18}>
            <Scheduler
              height={730}
              showAllDayPanel={false}
              dataSource={sourceData}
              currentView={"week"}
              appointmentRender={appointmentRender}
              appointmentTooltipRender={appointmentTooltipRender}
              startDayHour={0}
              crossScrollingEnabled={true}
            >
              <Editing
                allowAdding={false}
                allowDeleting={false}
                allowResizing={false}
                allowDragging={false}
                allowUpdating={false}
              />
              <Scrolling mode="virtual" />
            </Scheduler>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Calendar;
