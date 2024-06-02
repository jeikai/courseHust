import AddCategory from '../pages/instructor/AddCategory';
import AddCourse from '../pages/instructor/AddCourse';
import AddInstructor from '../pages/instructor/AddInstructor';
import AddQuiz from '../pages/instructor/AddQuiz';
import AddStudent from '../pages/instructor/AddStudent';
import AutoQuiz from '../pages/instructor/AutoQuiz';
import Category from '../pages/instructor/Category';
import Courses from '../pages/instructor/Courses';
import Dashboard from '../pages/instructor/Dashboard';
import EditCourse from '../pages/instructor/EditCourse';
import EditQuiz from '../pages/instructor/EditQuiz';
import EditStudent from '../pages/instructor/EditStudent';
import EnrolHistory from '../pages/instructor/EnrolHistory';
import Enrollments from '../pages/instructor/Enrollments';
import Instructors from '../pages/instructor/Instructors';
import Profile from '../pages/instructor/Profile';
import Quiz from '../pages/instructor/Quiz';
import Students from '../pages/instructor/Students';
import AddQuestion from '../pages/instructor/AddQuestion';
const Routes = [
	{
		path: '/admin',
		view: Dashboard,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Dash board | E-Learning',
	},
	{
		path: '/admin/manage_courses',
		view: Courses,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage courses | E-Learning',
	},
	{
		path: '/admin/add_course',
		view: AddCourse,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add a new courses | E-Learning',
	},
	{
		path: '/admin/edit_course/:id',
		view: EditCourse,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Edit a courses | E-Learning',
	},
	{
		path: '/admin/category',
		view: Category,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage categories | E-Learning',
	},
	{
		path: '/admin/add_category',
		view: AddCategory,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage categories | E-Learning',
	},
	{
		path: '/admin/enrollment',
		view: Enrollments,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage enrollment | E-Learning',
	},
	{
		path: '/admin/enrol_history',
		view: EnrolHistory,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage enrol history | E-Learning',
	},
	{
		path: '/admin/instructors',
		view: Instructors,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage instructors | E-Learning',
	},
	{
		path: '/admin/add_instructor',
		view: AddInstructor,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add instructor | E-Learning',
	},
	{
		path: '/admin/students',
		view: Students,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage students | E-Learning',
	},
	{
		path: '/admin/add_student',
		view: AddStudent,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add student | E-Learning',
	},
	{
		path: '/admin/edit_student/:id',
		view: EditStudent,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add student | E-Learning',
	},
	{
		path: '/admin/profile',
		view: Profile,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage Profile | E-Learning',
	},
	{
		path: '/admin/quiz',
		view: Quiz,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Manage Quiz | E-Learning',
	},
	{
		path: '/admin/add_quiz', 
		view: AddQuiz,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add a new quiz | E-Learning',
	},
	{
		path: '/admin/auto_quiz',
		view: AutoQuiz,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add a new quiz | E-Learning',
	},
	{
		path: '/admin/edit_quiz/:id',
		view: EditQuiz,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Edit a quiz | E-Learning',
	},
	{
		path: '/admin/add_question',
		view: AddQuestion,
		layout: 'admin',
		// permission: 'student',
		title: 'FunCourse - Add a question | E-Learning',
	},
];

export default Routes;