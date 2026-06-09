import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import { CloseSquareOutlined } from "@ant-design/icons";
import BlankLayout from "../layout/BlankLayout";
import LessonLayout from "../layout/LessonLayout";
import AdminLayout from "../layout/AdminLayout";
import AdminMainLayout from "../layout/AdminMainLayout";

export const ViewContext = createContext();

export function View(props) {
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    visible: "hide",
    autoclose: true,
  });
  const [modal, setModal] = useState({});
  const [loading, setLoading] = useState(false);

  const layouts = {
    app: AppLayout,
    lesson: LessonLayout,
    admin: AdminLayout,
    admin_main: AdminMainLayout
  };

  document.title = props.title;

  let Layout = props.layout ? layouts[props.layout] : BlankLayout;

  function showNotification(text, type, autoclose, format, icon) {
    setNotification({
      text: text,
      type: type,
      show: true,
      format: format,
      icon: icon,
      autoclose: autoclose,
    });

    if (autoclose) setTimeout(hideNotification, 4000);
  }

  function hideNotification() {
    setNotification({
      text: "",
      type: "",
      show: false,
      format: null,
      icon: null,
      autoclose: true,
    });
  }
  function handleSuccess(message) {
    showNotification(message, "success", true, "", CloseSquareOutlined);
  }
  function handleError(err) {
    let message = "There was a glitch in the matrix – please try again";

    if (err) {
      message = err.toString();

      if (err.response) {
        if (err.response.data?.message) message = err.response.data.message;

        if (err.response.status) {
          switch (err.response.status) {
            case 401:
              navigate("/signin");
              break;

            case 403:
              navigate("/notfound");
              break;

            case 404:
              navigate("/notfound");
              break;

            case 429:
              showNotification(
                err.response.data,
                "error",
                true,
                "",
                CloseSquareOutlined
              );
              break;

            default:
              showNotification(message, "error", true, "", CloseSquareOutlined);
              break;
          }
        }
      } else {
        showNotification(message, "error", true, "", CloseSquareOutlined);
      }
    }
  }

  const context = {
    notification: {
      show: showNotification,
      hide: hideNotification,
      data: notification,
    },
    loading: loading,

    setLoading: (state) => setLoading(state),
    handleError: handleError,
    handleSuccess: handleSuccess, 
  };

  return (
    <ViewContext.Provider value={context}>
      {notification.show && <Notification {...notification} />}

      {loading && <Loader fullScreen />}

      <Layout title={props.title} data={props.data}>
        {<props.display />}
      </Layout>
    </ViewContext.Provider>
  );
}
