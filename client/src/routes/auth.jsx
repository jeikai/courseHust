import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"

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
    // {
    //     path: '/signup/verify',
    //     view: ,
    //     layout: 'app',
    //     title: 'Funbug - Please verify you email address'
    // },
    // {
    //     path: '/forgotpassword',
    //     view: '',
    //     layout: 'app',
    //     title: 'Funbug - Forgot Password | E-Learning'
    // },
]

export default Routes