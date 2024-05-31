import websiteRoutes from "./website.jsx";
import authRoutes from "./auth.jsx";
import appRoutes from "./app.jsx";
import adminRoutes from "./instructor.jsx";

const routes = [
    ...websiteRoutes,
    ...authRoutes,
    ...appRoutes,
    ...adminRoutes,
]

export default routes;