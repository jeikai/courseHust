import AddCategory from '../pages/admin/AddCategory';
import AddCourse from '../pages/admin/AddCourse';
import AddInstructor from '../pages/admin/AddInstructor';
import Category from '../pages/admin/Category';
import Courses from '../pages/admin/Courses';
import Dashboard from '../pages/admin/Dashboard';
import EditCourse from '../pages/admin/EditCourse';
import Instructors from '../pages/admin/Instructors';
import AutoQuiz from '../pages/admin/AutoQuiz';
import AddQuiz from '../pages/admin/AddQuiz';
import EditQuiz from '../pages/admin/EditQuiz';
import Quiz from '../pages/admin/Quiz';
import AddQuestion from '../pages/admin/AddQuestion';
import Question from '../pages/admin/Question';
import EditQuestion from '../pages/admin/EditQuestion';

const Routes = [
	{
		path: '/admin_main',
		view: Dashboard,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Dash board | E-Learning', 
	},
	{
		path: '/admin_main/manage_courses',
		view: Courses,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Manage courses | E-Learning',
	},
	{
		path: '/admin_main/add_course',
		view: AddCourse,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Add a new courses | E-Learning',
	},
	{
		path: '/admin_main/edit_course/:id',
		view: EditCourse,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Edit a courses | E-Learning',
	},
	{
		path: '/admin_main/category',
		view: Category,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Manage categories | E-Learning',
	},
	{
		path: '/admin_main/add_category',
		view: AddCategory,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Manage categories | E-Learning',
	},
	{
		path: '/admin_main/instructors',
		view: Instructors,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Manage instructors | E-Learning',
	},
	{
		path: '/admin_main/add_instructor',
		view: AddInstructor,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Add instructor | E-Learning',
	},
	{
		path: '/admin_main/quiz',
		view: Quiz,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Manage Quiz | E-Learning',
	},
	{
		path: '/admin_main/question',
		view: Question,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Manage Question | E-Learning',
	},
	{
		path: '/admin_main/edit_question/:id',
		view: EditQuestion,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Edit Question | E-Learning',
	},
	{
		path: '/admin_main/add_quiz',
		view: AddQuiz,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Add a new quiz | E-Learning',
	},
	{
		path: '/admin_main/auto_quiz',
		view: AutoQuiz,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Add a new quiz | E-Learning',
	},
	{
		path: '/admin_main/edit_quiz/:id',
		view: EditQuiz,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Edit a quiz | E-Learning',
	},
	{
		path: '/admin_main/add_question',
		view: AddQuestion,
		layout: 'admin_main',
		// permission: 'student',
		title: 'FunCourse - Add a question | E-Learning',
	},
];

export default Routes;
