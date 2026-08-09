import { useEffect, useState } from "react";
import { Alert, Button, Flex, Spin, Typography } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";

const OFFICE_EXTENSIONS = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

const MIME_TO_EXTENSION = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

// The Cloudinary URL alone doesn't reliably carry the file extension (raw
// resources don't require one), so prefer explicit metadata when the caller
// has it and only fall back to sniffing the URL.
export function getDocumentType(url, mimeType) {
  if (mimeType && MIME_TO_EXTENSION[mimeType]) {
    const ext = MIME_TO_EXTENSION[mimeType];
    return classifyExtension(ext);
  }
  const match = (url || "").split("?")[0].match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : null;
  if (ext) return classifyExtension(ext);

  // No extension and no mimeType to go on. Every docURL in this project is
  // either a PDF (which Cloudinary always keeps a real .pdf extension for)
  // or an Office document (which historically didn't) - so an unrecognized,
  // extension-less URL is most likely an older Office upload.
  return "office";
}

function classifyExtension(ext) {
  if (ext === "pdf") return "pdf";
  if (OFFICE_EXTENSIONS.includes(ext)) return "office";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  return "unsupported";
}

function officeViewerUrl(url) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
}

function downloadFileName(url, originalName) {
  if (originalName) return originalName;
  const match = (url || "").split("?")[0].match(/([^/]+)$/);
  return match ? match[1] : "document";
}

// Renders an appropriate preview for a lesson document: native iframe for
// PDF, Microsoft Office Online Viewer for Office formats, plain image
// rendering for images, and a download-only fallback for anything else.
// The student is never sent straight to the raw storage URL except via the
// explicit Download button.
const DocumentViewer = ({ url, mimeType, originalName, height = "70vh" }) => {
  const [loadState, setLoadState] = useState("loading"); // loading | loaded | error
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoadState("loading");
  }, [url, attempt]);

  if (!url) {
    return (
      <Alert
        type="warning"
        showIcon
        message="No document is attached to this lesson."
      />
    );
  }

  const type = getDocumentType(url, mimeType);
  const fileName = downloadFileName(url, originalName);

  const downloadButton = (
    <Button icon={<DownloadOutlined />} href={url} target="_blank" rel="noopener noreferrer">
      Download {fileName}
    </Button>
  );

  if (type === "image") {
    return (
      <Flex vertical align="center" gap={12}>
        <img
          src={url}
          alt={fileName}
          style={{ maxWidth: "100%", height: "auto" }}
          onError={() => setLoadState("error")}
        />
        {downloadButton}
      </Flex>
    );
  }

  if (type === "unsupported") {
    return (
      <Flex vertical align="center" gap={12}>
        <Alert
          type="info"
          showIcon
          message="Preview is not available for this file type."
        />
        {downloadButton}
      </Flex>
    );
  }

  const iframeSrc = type === "pdf" ? url : officeViewerUrl(url);

  return (
    <Flex vertical gap={12} style={{ width: "100%" }}>
      {loadState === "loading" && (
        <Flex align="center" justify="center" style={{ height }}>
          <Spin tip="Loading document..." size="large" />
        </Flex>
      )}
      {loadState === "error" && (
        <Flex vertical align="center" gap={12} style={{ padding: 24 }}>
          <Alert
            type="error"
            showIcon
            message="Unable to preview this document."
            description="The viewer failed to load. You can retry or download the file instead."
            style={{ width: "100%" }}
          />
          <Flex gap={12}>
            <Button icon={<ReloadOutlined />} onClick={() => setAttempt((a) => a + 1)}>
              Retry
            </Button>
            {downloadButton}
          </Flex>
        </Flex>
      )}
      <iframe
        key={attempt}
        src={iframeSrc}
        title={fileName}
        onLoad={() => setLoadState("loaded")}
        onError={() => setLoadState("error")}
        style={{
          width: "100%",
          height,
          border: "none",
          display: loadState === "loading" || loadState === "error" ? "none" : "block",
        }}
      />
      {loadState === "loaded" && (
        <Flex justify="center">
          <Typography.Text type="secondary" style={{ marginRight: 12 }}>
            Having trouble viewing this document?
          </Typography.Text>
          {downloadButton}
        </Flex>
      )}
    </Flex>
  );
};

export default DocumentViewer;
