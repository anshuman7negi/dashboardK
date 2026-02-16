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
import Signup from "../auth/Signup";
import CountriesPage from "../modules/admin/CountriesPage";
import StatesPage from "../modules/admin/StatesPage";
import AddCountryPage from "../modules/admin/AddCountryPage";
import AddStatePage from "../modules/admin/AddStatePage";

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
            { path: "countries", element: <CountriesPage /> },
            { path: "countries/create", element: <AddCountryPage /> },
            { path: "states", element: <StatesPage /> },
            { path: "states/create", element: <AddStatePage /> },
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
