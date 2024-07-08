import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, message } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Spring from "../../components/Spring";
import Bread from "../../components/Bread";
import { Bar } from "@ant-design/charts";
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [dataLine, setDataLine] = useState({
    monthly: [],
    quarterly: [],
    yearly: [],
  });
  const [loading, setLoading] = useState(true);

  const breadcrumb = [
    { title: "Home", href: "/" },
    { title: "Application Center" },
  ];

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#413ea0",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ff00ff",
    "#00ffff",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly, quarterly, and yearly statistics
        const response = await axios.get("/api/bill/get/statistic");
        let statistics = response.data;

        // Initialize data structures
        let monthlyData = [];
        let quarterlyData = [];
        let yearlyData = [];

        // Process statistics data
        statistics.forEach((stat) => {
          const yearMonth = `${stat._id.year}-${stat._id.month}`;
          const yearQuarter = `${stat._id.year}-Q${stat._id.quarter}`;

          stat.courses
            .filter((course) => course.details) // Lọc bỏ các phần tử không có trường `details`
            .forEach((course) => {
              const title = course.details.title;

              // Monthly data
              const existingMonthlyEntry = monthlyData.find(
                (entry) => entry.month === yearMonth && entry.title === title
              );
              if (existingMonthlyEntry) {
                existingMonthlyEntry.value += course.count;
              } else {
                monthlyData.push({
                  month: yearMonth,
                  title,
                  value: course.count,
                });
              }

              // Quarterly data
              const existingQuarterlyEntry = quarterlyData.find(
                (entry) =>
                  entry.quarter === yearQuarter && entry.title === title
              );
              if (existingQuarterlyEntry) {
                existingQuarterlyEntry.value += course.count;
              } else {
                quarterlyData.push({
                  quarter: yearQuarter,
                  title,
                  value: course.count,
                });
              }

              // Yearly data
              const existingYearlyEntry = yearlyData.find(
                (entry) => entry.year === stat._id.year && entry.title === title
              );
              if (existingYearlyEntry) {
                existingYearlyEntry.value += course.count;
              } else {
                yearlyData.push({
                  year: stat._id.year,
                  title,
                  value: course.count,
                });
              }
            });
        });
        // lấy dữ liệu bar chart
        const responseBarChart = await axios.get("/api/bill");
        const bills = responseBarChart.data;
        const courseCount = bills.reduce((acc, bill) => {
          bill.listOfCourse.forEach((course) => {
            if (acc[course.title]) {
              acc[course.title]++;
            } else {
              acc[course.title] = 1;
            }
          });
          return acc;
        }, {});
        const barchartData = Object.keys(courseCount).map((key) => ({
          category: key,
          count: courseCount[key],
        }));

        setData(barchartData);
        setDataLine({
          monthly: monthlyData,
          quarterly: quarterlyData,
          yearly: yearlyData,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate unique ticks for the x-axis
  const generateUniqueTicks = (data, xField) => {
    return [...new Set(data.map((item) => item[xField]))];
  };

  const barConfig = {
    data,
    xField: "category",
    yField: "count",
    seriesField: "category",
    color: ({ category }) => {
      return category === "Python Programming" ? "#775FFE" : "#8c8c8c";
    },
    legend: false,
    barStyle: { radius: [5, 5, 0, 0] },
  };
  return (
    <Spring>
      <Bread title="Dashboard" items={breadcrumb} />
      <div className="shadow-md border bg-white p-4">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <Card
            title="Statistics by month"
            style={{ flex: "1 1 30%", margin: "10px" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              <LineChart
                width={400}
                height={300}
                data={dataLine.monthly}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  ticks={generateUniqueTicks(dataLine.monthly, "month")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(
                  dataLine.monthly.reduce((acc, item) => {
                    acc[item.title] = true;
                    return acc;
                  }, {})
                ).map((title, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey="value"
                    data={dataLine.monthly.filter(
                      (item) => item.title === title
                    )}
                    name={title}
                    stroke={colors[index % colors.length]}
                  />
                ))}
              </LineChart>
            )}
          </Card>

          <Card
            title="Quarterly statistics"
            style={{ flex: "1 1 30%", margin: "10px" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              <LineChart
                width={400}
                height={300}
                data={dataLine.quarterly}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="quarter"
                  ticks={generateUniqueTicks(dataLine.quarterly, "quarter")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(
                  dataLine.quarterly.reduce((acc, item) => {
                    acc[item.title] = true;
                    return acc;
                  }, {})
                ).map((title, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey="value"
                    data={dataLine.quarterly.filter(
                      (item) => item.title === title
                    )}
                    name={title}
                    stroke={colors[index % colors.length]}
                  />
                ))}
              </LineChart>
            )}
          </Card>

          <Card
            title="Statistics by year"
            style={{ flex: "1 1 30%", margin: "10px" }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              <LineChart
                width={400}
                height={300}
                data={dataLine.yearly}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  ticks={generateUniqueTicks(dataLine.yearly, "year")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(
                  dataLine.yearly.reduce((acc, item) => {
                    acc[item.title] = true;
                    return acc;
                  }, {})
                ).map((title, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey="value"
                    data={dataLine.yearly.filter(
                      (item) => item.title === title
                    )}
                    name={title}
                    stroke={colors[index % colors.length]}
                  />
                ))}
              </LineChart>
            )}
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <Card
            title="Courses Statistics"
            style={{ flex: "1 1 30%", margin: "10px" }}
          >
            {loading ? <p>Loading...</p> : <Bar {...barConfig} />}
          </Card>
        </div>
      </div>
    </Spring>
  );
};

export default Dashboard;
