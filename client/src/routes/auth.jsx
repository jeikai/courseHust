import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Verify from "../pages/auth/Verify"

const Routes = [
    {
        path: '/signup',
        view: Register,
        layout: 'app',
        title: 'FunCourse - Sign up | E-Learning'
    },
    {
        path: '/login',
        view: Login,
        layout: 'app',
        title: 'FunCourse - Login | E-Learning'
    },
    {
        path: '/signup/verify',
        view: Verify,
        // layout: 'app',
        permission: 'student',
        title: 'FunCourse - Please verify you email address'
    },
    // {
    //     path: '/forgotpassword',
    //     view: '',
    //     layout: 'app',
    //     title: 'FunCourse - Forgot Password | E-Learning'
    // },
]

export default Routes