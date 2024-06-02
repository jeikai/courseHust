import AddCategory from '../pages/admin/AddCategory';
import AddCourse from '../pages/admin/AddCourse';
import AddInstructor from '../pages/admin/AddInstructor';
import Category from '../pages/admin/Category';
import Courses from '../pages/admin/Courses';
import Dashboard from '../pages/admin/Dashboard';
import EditCourse from '../pages/admin/EditCourse';
import Instructors from '../pages/admin/Instructors';
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
	}
];

export default Routes;