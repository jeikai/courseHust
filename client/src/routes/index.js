import websiteRoutes from "./website.jsx";
import authRoutes from "./auth.jsx";
import appRoutes from "./app.jsx";
import adminRoutes from "./admin.jsx";
import instructorRoutes from "./instructor.jsx";

const routes = [
    ...websiteRoutes,
    ...authRoutes,
    ...appRoutes,
    ...adminRoutes,
    ...instructorRoutes
]

export default routes;