import AddCategory from "../pages/admin/AddCategory"
import AddCourse from "../pages/admin/AddCourse"
import AddInstructor from "../pages/admin/AddInstructor"
import AddQuiz from "../pages/admin/AddQuiz"
import AddStudent from "../pages/admin/AddStudent"
import Category from "../pages/admin/Category"
import Courses from "../pages/admin/Courses"
import Dashboard from "../pages/admin/Dashboard"
import EditCourse from "../pages/admin/EditCourse"
import EditQuiz from "../pages/admin/EditQuiz"
import EditStudent from "../pages/admin/EditStudent"
import EnrolHistory from "../pages/admin/EnrolHistory"
import Enrollments from "../pages/admin/Enrollments"
import Instructors from "../pages/admin/Instructors"
import Profile from "../pages/admin/Profile"
import Quiz from "../pages/admin/Quiz"
import Students from "../pages/admin/Students"

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
        title: 'Funbug - Add a new courses | E-Learning'
    },
    {
        path: '/admin/edit_course/:id',
        view: EditCourse,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Edit a courses | E-Learning'
    },
    {
        path: '/admin/category',
        view: Category,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage categories | E-Learning'
    },
    {
        path: '/admin/add_category',
        view: AddCategory,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage categories | E-Learning'
    },
    {
        path: '/admin/enrollment',
        view: Enrollments,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage enrollment | E-Learning'
    },
    {
        path: '/admin/enrol_history',
        view: EnrolHistory,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage enrol history | E-Learning'
    },
    {
        path: '/admin/instructors',
        view: Instructors,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage instructors | E-Learning'
    },
    {
        path: '/admin/add_instructor',
        view: AddInstructor,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Add instructor | E-Learning'
    },
    {
        path: '/admin/students',
        view: Students,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage students | E-Learning'
    },
    {
        path: '/admin/add_student',
        view: AddStudent,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Add student | E-Learning'
    },
    {
        path: '/admin/edit_student/:id',
        view: EditStudent,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Add student | E-Learning'
    },
    {
        path: '/admin/profile',
        view: Profile,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage Profile | E-Learning'
    },
    {
        path: '/admin/quiz',
        view: Quiz,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Manage Quiz | E-Learning'
    },
    {
        path: '/admin/add_quiz',
        view: AddQuiz,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Add a new quiz | E-Learning'
    },
    {
        path: '/admin/edit_quiz/:id',
        view: EditQuiz,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Edit a quiz | E-Learning'
    },
]

export default Routes