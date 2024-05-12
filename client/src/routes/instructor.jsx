import UploadQuiz from "../pages/instructor/UploadQuiz.jsx";
import CreateCourse from "../pages/instructor/CreateCourse.jsx";
import CreateLesson from "../pages/instructor/CreateLesson.jsx";

const Routes = [ 
    {
        path: 'instructor_m/create_quiz',
        view: UploadQuiz,
        layout: 'instructor',
        title: 'FunCourse - Upload Quiz | E-Learning'
    },
    {
        path: 'instructor_m/create_course',
        view: CreateCourse,
        layout: 'instructor',
        title: 'FunCourse - Create Course | E-Learning'
    },
    {
        path: 'instructor_m/create_lesson',
        view: CreateLesson,
        layout: 'instructor',
        title: 'FunCourse - Create Lesson | E-Learning'
    }
]
 
export default Routes;