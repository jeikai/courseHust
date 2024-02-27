import { useState } from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Instructor from './pages/Instructor'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { View } from './context/View'

import websiteRoutes from './routes/website'
import authRoutes from './routes/auth'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/Auth'

const routes = [

  ...websiteRoutes,
  ...authRoutes,

]
function App() {
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
