import Dashboard from "../pages/admin/Dashboard"

const Routes = [
    {
        path: '/admin',
        view: Dashboard,
        layout: 'admin',
        // permission: 'student',
        title: 'Funbug - Dash board | E-Learning'
    },
]

export default Routes