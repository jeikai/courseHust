import AddCourse from "../pages/admin/AddCourse"
import Courses from "../pages/admin/Courses"
import Dashboard from "../pages/admin/Dashboard"

const Routes = [
    {
        path: '/admin',
        view: Dashboard,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Dash board | E-Learning'
    },
    {
        path: '/admin/manage_courses',
        view: Courses,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage courses | E-Learning'
    },
    {
        path: '/admin/add_course',
        view: AddCourse,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage courses | E-Learning'
    },
]

export default Routes