import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

import { View } from './context/View'

import websiteRoutes from './routes/website'
import authRoutes from './routes/auth'
import appRoutes from './routes/app'
import adminRoutes from './routes/admin'
import PrivateRoute from './components/PrivateRoute'
import { AuthContext, AuthProvider } from './context/Auth'
import Axios from 'axios';

import routes from "./routes";

function App() {

  const user = JSON.parse(localStorage.getItem('user'));
  Axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  if (user?.authenticated){

    // add auth token to api header calls
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.authenticated;

  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map(route => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.permission ?
                    <PrivateRoute permission={route.permission}>
                      <View display={route.view} layout={route.layout} title={route.title} />
                    </PrivateRoute> 
                    :
                    <View display={route.view} layout={route.layout} title={route.title} />
                }
              />
            )
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
  )
}

export default App
