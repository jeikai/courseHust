import AddCourse from '../pages/instructor/AddCourse';
import AddQuiz from '../pages/instructor/AddQuiz';
import AutoQuiz from '../pages/instructor/AutoQuiz';
import Courses from '../pages/instructor/Courses';
import EditCourse from '../pages/instructor/EditCourse';
import EditQuiz from '../pages/instructor/EditQuiz';
import Quiz from '../pages/instructor/Quiz';
import AddQuestion from '../pages/instructor/AddQuestion';
import Question from '../pages/instructor/Question';
import EditQuestion from '../pages/instructor/EditQuestion';
const Routes = [
	{
		path: '/admin/manage_courses',
		view: Courses,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Manage courses | E-Learning',
	},
	{
		path: '/admin/add_course',
		view: AddCourse,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Add a new courses | E-Learning',
	},
	{
		path: '/admin/edit_course/:id',
		view: EditCourse,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Edit a courses | E-Learning',
	},
	{
		path: '/admin/quiz',
		view: Quiz,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Manage Quiz | E-Learning',
	},
	{
		path: '/admin/add_quiz', 
		view: AddQuiz,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Add a new quiz | E-Learning',
	},
	{
		path: '/admin/auto_quiz',
		view: AutoQuiz,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Add a new quiz | E-Learning',
	},
	{
		path: '/admin/edit_quiz/:id',
		view: EditQuiz,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Edit a quiz | E-Learning',
	},
	{
		path: '/admin/add_question',
		view: AddQuestion,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Add a question | E-Learning',
	},
	{
		path: '/admin/question',
		view: Question,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Question | E-Learning',
	},
	{
		path: '/admin/edit_question/:id',
		view: EditQuestion,
		layout: 'admin',
		permission: 'instructor',
		title: 'FunCourse - Edit Question | E-Learning',
	},
];

export default Routes;