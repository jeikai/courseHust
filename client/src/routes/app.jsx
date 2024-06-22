import Account from "../pages/Account";
// import Affiliate from "../pages/Affiliate"
import Bootcamp from "../pages/Bootcamp";
import BootcampDetail from "../pages/BootcampDetail";
import Cart from "../pages/Cart";
import Lesson from "../pages/Lesson";
import Mycourses from "../pages/Mycourses";
import Mywishlist from "../pages/Mywishlist";
import NotFound from "../pages/NotFound";
import Calendar from "../pages/Calendar";
import Purchase from "../pages/Purchase";
import Bill from "../pages/Bill"
import QuizLesson from "../pages/QuizLesson";
import QuizResult from "../pages/QuizResult";
import DocumentLesson from "../pages/DocumentLesson";
import ReviewQuiz from "../pages/ReviewQuiz";
const Routes = [
  {
    path: "/cart",
    view: Cart,
    layout: "app",
    title: "FunCourse - Cart | E-Learning",
  },
  {
    path: "/home/my_courses",
    view: Mycourses,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - My courses | E-Learning",
  },
  {
    path: "/home/my_bootcamp",
    view: Bootcamp,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - My bootcamp | E-Learning",
  },
  {
    path: "/home/my_bootcamp/:id",
    view: BootcampDetail,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - My bootcamp | E-Learning",
  },
  {
    path: "/home/my_whishlist",
    view: Mywishlist,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - My whishlist | E-Learning",
  },
  {
      path: '/home/bill',
      view: Bill,
      layout: 'app',
      // permission: 'student',
      title: 'FunCourse - Affiliate course | E-Learning'
  },
  {
    path: "/home/purchase_course",
    view: Purchase,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - Purchase course | E-Learning",
  },
  {
    path: "/home/calendar",
    view: Calendar,
    layout: "app", 
    // permission: 'student',
    title: "FunCourse - Calendar | E-Learning",
  },
  {
    path: "/home/user_credentials",
    view: Account,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - Account | E-Learning",
  },
  {
    path: "/home/lesson/:lessonId/:courseId",
    view: Lesson,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/home/document/:lessonId/:courseId",
    view: DocumentLesson,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/home/quiz/:id/:courseId",
    view: QuizLesson,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/home/quiz_result",
    view: QuizResult,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/home/reviewquiz/:id",
    view: ReviewQuiz,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/notfound",
    view: NotFound,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - 404 Not Found | E-Learning",
  },
];

export default Routes;