import { createBrowserRouter } from "react-router-dom";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

import AdminLayout from "../layout/AdminLayout";
import AgentLayout from "../layout/AgentLayout";

import AdminDashboard from "../modules/admin/AdminDashboard";
import AgentDashboard from "../modules/agent/AgentDashboard";

import PackagesPage from "../modules/agent/PackagesPage";
import EmployeesPage from "../modules/agent/EmployeesPage";

import StatesPage from "../pages/states/StatesPage";
import AddCountryPage from "../pages/country/AddCountryPage";
import AddStatePage from "../pages/states/AddStatePage";

import NotFoundPage from "../components/NotFoundPage";
import CreateRolePage from "../pages/ManageRoles/CreateRolePage";
import CreatePermissionPage from "../pages/ManageRoles/CreatePermissionPage";

import ProtectedRoute from "./ProtectedRoute";
import RolePermissionMappingPage from "../pages/ManageRoles/RolePermissionMappingPage ";
import { ApproveRejectDestinations } from "../pages/destinations/ApproveRejectDestinations";
import { CreateDestinationPage } from "../pages/destinations/CreateDestinationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  // ================= ADMIN =================
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // 🔥 Dashboard → Only Admin
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // 🔥 Countries → Admin + Support
      {
        path: "create-country",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <AddCountryPage />
          </ProtectedRoute>
        ),
      },

      // 🔥 States → Admin + Support
      {
        path: "states",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <StatesPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "create-state",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <AddStatePage />
          </ProtectedRoute>
        ),
      },

      // Manage destinations

            {
        path: "approve-reject-destination",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <ApproveRejectDestinations />
          </ProtectedRoute>
        ),
      }, 

       {
        path: "create-destination",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <CreateDestinationPage />
          </ProtectedRoute>
        ),
      },

      // 🔥 Manage Roles → Only Admin
      {
        path: "create-role",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <CreateRolePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "create-permission",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <CreatePermissionPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "role-permission-map",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <RolePermissionMappingPage />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // ================= AGENT =================
  {
    path: "/agent",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_AGENT"]}>
        <AgentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AgentDashboard /> },
      { path: "packages", element: <PackagesPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
