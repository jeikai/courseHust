import Account from "../pages/Account"
// import Affiliate from "../pages/Affiliate"
import Bootcamp from "../pages/Bootcamp"
import BootcampDetail from "../pages/BootcampDetail"
import Cart from "../pages/Cart"
import Lesson from "../pages/Lesson"
import Mycourses from "../pages/Mycourses"
import Mywishlist from "../pages/Mywishlist"
import Profile from "../pages/Profile"
import Purchase from "../pages/Purchase"

const Routes = [
    {
        path: '/cart',
        view: Cart,
        layout: 'app',
        title: 'Funbug - Cart | E-Learning'
    },
    {
        path: '/home/my_courses',
        view: Mycourses,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - My courses | E-Learning'
    },
    {
        path: '/home/my_bootcamp',
        view: Bootcamp,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - My bootcamp | E-Learning'
    },
    {
        path: '/home/my_bootcamp/:id',
        view: BootcampDetail,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - My bootcamp | E-Learning'
    },
    {
        path: '/home/my_whishlist',
        view: Mywishlist,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - My whishlist | E-Learning'
    },
    // {
    //     path: '/home/affiliate_course',
    //     view: Affiliate,
    //     layout: 'app',
    //     // permission: 'student',
    //     title: 'Funbug - Affiliate course | E-Learning'
    // },
    {
        path: '/home/purchase_course',
        view: Purchase,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - Purchase course | E-Learning'
    },
    {
        path: '/home/user_profile',
        view: Profile,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - Profile | E-Learning'
    },
    {
        path: '/home/user_credentials',
        view: Account,
        layout: 'app',
        // permission: 'student',
        title: 'Funbug - Account | E-Learning'
    },
    {
        path: '/home/lesson/:id',
        view: Lesson,
        layout: 'lesson',
        // permission: 'student',
        title: 'Funbug - Lesson | E-Learning'
    },
]

export default Routes