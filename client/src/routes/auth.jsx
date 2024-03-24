import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Verify from "../pages/auth/Verify"

const Routes = [
    {
        path: '/signup',
        view: Register,
        layout: 'app',
        title: 'Funbug - Sign up | E-Learning'
    },
    {
        path: '/login',
        view: Login,
        layout: 'app',
        title: 'Funbug - Login | E-Learning'
    },
    {
        path: '/signup/verify',
        view: Verify,
        // layout: 'app',
        permission: 'student',
        title: 'Funbug - Please verify you email address'
    },
    // {
    //     path: '/forgotpassword',
    //     view: '',
    //     layout: 'app',
    //     title: 'Funbug - Forgot Password | E-Learning'
    // },
]

export default Routes