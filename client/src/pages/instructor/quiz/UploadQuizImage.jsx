import React, { useCallback, useContext } from "react";
import { Box } from "@mui/material";
import { FilePicker } from "../../../components/file-picker/FilePicker.jsx";
import { useNavigate } from "react-router-dom";

const UploadQuizImage = () => {
  const navigator = useNavigate();

  const onFinish = useCallback((data) => {
    console.log(data);
  }, []);

  return (
    <Box>
      <FilePicker
        accept={["image/png", "image/jpeg"]}
        uploadURL="/api/instructor/upload-questions"
        onFinish={onFinish}
      />
    </Box>
  );
};

export default UploadQuizImage;
