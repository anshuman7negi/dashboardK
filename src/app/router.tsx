import { createBrowserRouter } from "react-router-dom";
import Login from "../auth/Login";
import AdminLayout from "../layout/AdminLayout";
import AgentLayout from "../layout/AgentLayout";
import AdminDashboard from "../modules/admin/AdminDashboard";
import AgentDashboard from "../modules/agent/AgentDashboard";
import UsersPage from "../modules/admin/UsersPage";
import RevenuePage from "../modules/admin/RevenuePage";
import PackagesPage from "../modules/agent/PackagesPage";
import EmployeesPage from "../modules/agent/EmployeesPage";
import Signup from "../auth/SignUp";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },

    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "users", element: <UsersPage /> },
            { path: "revenue", element: <RevenuePage /> },
        ],
    },
    {
        path: "/agent",
        element: <AgentLayout />,
        children: [
            { index: true, element: <AgentDashboard /> },
            { path: "packages", element: <PackagesPage /> },
            { path: "employees", element: <EmployeesPage /> },
        ],
    }
    ,
]);
