import CourseDetail from "../pages/CourseDetail";
import Courses from "../pages/Courses";
import Home from "../pages/Home";
import Instructor from "../pages/Instructor";

const Routes = [
    {
        path: '/',
        view: Home,
        layout: 'app',
        title: 'Funbug - Home | E-Learning'
    },
    {
        path: '/courses',
        view: Courses,
        layout: 'app',
        title: 'Funbug - Courses | E-Learning'
    },
    {
        path: '/courses/:courseId',
        view: CourseDetail,
        layout: 'app',
        title: 'Funbug - Courses | E-Learning'
    },
    {
        path: '/instructor/:instructorId',
        view: Instructor,
        layout: 'app',
        title: 'Funbug - Educator profile | E-Learning'
    },
]

export default Routes