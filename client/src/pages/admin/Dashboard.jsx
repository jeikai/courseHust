import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bread from '../../components/Bread';
import { Card, message } from 'antd';
import { Bar } from '@ant-design/charts';
import Spring from '../../components/Spring';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const breadcrumb = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'Application Center',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5500/api/bill');
                const bills = response.data;

                const courseCount = bills.reduce((acc, bill) => {
                    bill.listOfCourse.forEach(course => {
                        if (acc[course.title]) {
                            acc[course.title]++;
                        } else {
                            acc[course.title] = 1;
                        }
                    });
                    return acc;
                }, {});

                const chartData = Object.keys(courseCount).map(key => ({
                    category: key,
                    count: courseCount[key],
                }));

                setData(chartData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const config = {
        data,
        xField: 'category',
        yField: 'count',
        seriesField: 'category',
        color: ({ category }) => {
            return category === 'Python Programming' ? '#775FFE' : '#8c8c8c';
        },
        legend: false,
        barStyle: { radius: [5, 5, 0, 0] },
    };

    return (
        <Spring>
            <Bread title="Dashboard" items={breadcrumb} />
            <div className='shadow-md border bg-white p-4'>
                <Card title="Courses Statistics">
                    {loading ? <p>Loading...</p> : <Bar {...config} />}
                </Card>
            </div>
        </Spring>
    );
};

export default Dashboard;
