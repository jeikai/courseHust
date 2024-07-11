import AddCourse from '../pages/instructor/AddCourse';
import AddQuiz from '../pages/instructor/AddQuiz';
import AutoQuiz from '../pages/instructor/AutoQuiz';
import Courses from '../pages/instructor/Courses';
import EditCourse from '../pages/instructor/EditCourse';
import EditQuiz from '../pages/instructor/EditQuiz';
import Quiz from '../pages/instructor/Quiz';
import AddQuestion from '../pages/instructor/AddQuestion';
const Routes = [
	{
		path: '/admin/manage_courses',
		view: Courses,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Manage courses | E-Learning',
	},
	{
		path: '/admin/add_course',
		view: AddCourse,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Add a new courses | E-Learning',
	},
	{
		path: '/admin/edit_course/:id',
		view: EditCourse,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Edit a courses | E-Learning',
	},
	{
		path: '/admin/quiz',
		view: Quiz,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Manage Quiz | E-Learning',
	},
	{
		path: '/admin/add_quiz', 
		view: AddQuiz,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Add a new quiz | E-Learning',
	},
	{
		path: '/admin/auto_quiz',
		view: AutoQuiz,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Add a new quiz | E-Learning',
	},
	{
		path: '/admin/edit_quiz/:id',
		view: EditQuiz,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Edit a quiz | E-Learning',
	},
	{
		path: '/admin/add_question',
		view: AddQuestion,
		layout: 'admin',
		// permission: 'student',
		title: 'Academy - Add a question | E-Learning',
	},
];

export default Routes;