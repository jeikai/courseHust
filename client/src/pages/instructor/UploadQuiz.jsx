import React from 'react';
import {Layout} from "antd";
import {Box, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import {TabList, TabPanel} from "@mui/lab";
import UploadQuizImage from "./quiz/UploadQuizImage.jsx";

const {Header} = Layout;

const UploadQuiz = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //Use Tabs in MUI to create a layout with tabs
    return (
        <Box
            sx={{ 
                width: '100%',
                minHeight: '100vh',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper', 
            }}
        >
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Image" value="1" />
                        <Tab label="Word" value="2" />
                        <Tab label="Pdf" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <UploadQuizImage/>
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
        </Box>
    )
}

export default UploadQuiz;