import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { View, ViewContext } from "./context/View";

import websiteRoutes from "./routes/website";
import authRoutes from "./routes/auth";
import appRoutes from "./routes/app";
import adminRoutes from "./routes/instructor";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/Auth";
import Axios from "axios";
import { message } from "antd";
import "devextreme/dist/css/dx.light.css";

import routes from "./routes";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { useContext, useEffect } from "react";

const { VITE_APP_VAPID_KEY } = import.meta.env;

function App() {
  const viewContext = useContext(ViewContext);
  const user = JSON.parse(localStorage.getItem("user"));
  Axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  if (user?.authenticated) {
    // add auth token to api header calls
    Axios.defaults.headers.common["Authorization"] =
      "Bearer " + user.authenticated;
  }
  async function requestPermission() {
    try {
      //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY,
      });

      //We can send token to server
      console.log("Token generated : ", token);
    } else if (permission === "denied") {
      //notifications are blocked
      console.log("You denied for the notification");
    }
    } catch (error) {
      console.log(error)
    }
  }
  onMessage(messaging, (payload) => {
    console.log(payload.notification.body)
    message.info(payload.notification.body)
  });
  useEffect(() => {
    requestPermission();
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.permission ? (
                    <PrivateRoute permission={route.permission}>
                      <View
                        display={route.view}
                        layout={route.layout}
                        title={route.title}
                      />
                    </PrivateRoute>
                  ) : (
                    <View
                      display={route.view}
                      layout={route.layout}
                      title={route.title}
                    />
                  )
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    // <Login />
    // <Logout />
    // <Home />
    // <Courses />
    // <CourseDetail />
    // <Instructor />
  );
}

export default App;
