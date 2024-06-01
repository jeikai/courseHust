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
import Loader from "../components/Loader";
import { useAPI } from "../hooks/api.jsx";
import moment from "moment";

const Calendar = () => {
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const schedule = useAPI(`/api/calendar/user/${userId}`, null)

  if(schedule.loading) return <Loader/>

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
  const getDatesBetween = (startDate, endDate, dayOfWeek) => {
    const dates = [];
    let current = moment(startDate).startOf("day");
    if (current.day() != dayOfWeek) {
      current.day(dayOfWeek);
    }
    
    while (current.isSameOrBefore(endDate)) {
      if (current.isSameOrAfter(startDate)) {
        dates.push(current.clone().format("YYYY-MM-DD"));
      }
      current.add(1, "week");
    }

    return dates;
  };

  const transformData = (data) => {
    return data.flatMap((item) => {
      const dates = getDatesBetween(
        item.day_start,
        item.day_end,
        item.dayOfWeek
      );

      return dates.map((date) => ({
        ...item,
        text: item.title,
        startDate: moment(date + "T" + item.time_start).toISOString(),
        endDate: moment(date + "T" + item.time_end).toISOString(),
      }));
    });
  };

  const formattedSourceData = transformData(schedule?.data);
  
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
              height={600}
              showAllDayPanel={false}
              dataSource={formattedSourceData}
              currentView={"week"}
              appointmentRender={appointmentRender}
              appointmentTooltipRender={appointmentTooltipRender}
              startDayHour={7}
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
