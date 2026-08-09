import { Typography, Row, Col, Divider, Button, message, Modal } from "antd";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { ViewContext } from "../context/View.jsx";
import { useAPI } from "../hooks/api";
import Loader from "../components/Loader.jsx";
import ReactPlayer from "react-player";
import DocumentViewer from "../components/DocumentViewer.jsx";

const DocumentLesson = () => {
  const { lessonId, courseId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).account._id;
  const viewContext = useContext(ViewContext);
  const responseAPI = useAPI(`/api/lesson/${lessonId}`, null);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleDone = async () => {
    try {
      setIsLoading(true);
      const data = {
        userId: userId,
        courseId: courseId,
        lessonId: lessonId,
      };
      await Axios({
        url: "/api/process/lesson",
        method: "PUT",
        data: data,
      });
      setIsLoading(false);
      message.success("Congratulations, you have completed this lesson.");
    } catch (error) {
      console.error(error);
      viewContext.handleError(error);
    }
  };

  const handleViewDocument = async () => {
    setIsViewerOpen(true);
    await handleDone();
  };

  if (responseAPI.loading) return <Loader />;

  const {
    title,
    content,
    date_created,
    docURL,
    docFileName,
    docMimeType,
    videoURL,
  } = responseAPI.data;
  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Row gutter={24} className="w-full max-w-3xl">
        <Col span={24}>
          <Typography.Title level={2} className="text-center">
            {title}
          </Typography.Title>
          <Divider />
          <Typography.Paragraph>{content}</Typography.Paragraph>
          <Typography.Paragraph>
            <strong>Date Created: </strong>
            {new Date(date_created).toLocaleDateString()}
          </Typography.Paragraph>
          {(docURL || videoURL) && (
            <div className="text-center">
              {videoURL && (
                <div className="mb-4">
                  <ReactPlayer url={videoURL} controls width="100%" />
                </div>
              )}
              {docURL && (
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: "#754FFE",
                    borderColor: "#754FFE",
                    color: "#fff",
                    borderRadius: "5px",
                    marginTop: videoURL ? '16px' : '0'
                  }}
                  onClick={handleViewDocument}
                >
                  View Document Here
                </Button>
              )}
            </div>
          )}
          <Divider />
        </Col>
      </Row>
      <Modal
        title={docFileName || title}
        open={isViewerOpen}
        onCancel={() => setIsViewerOpen(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
      >
        <DocumentViewer
          url={docURL}
          mimeType={docMimeType}
          originalName={docFileName}
          height="calc(100vh - 220px)"
        />
      </Modal>
    </div>
  );
};

export default DocumentLesson;
