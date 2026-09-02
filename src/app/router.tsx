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
import CreateDestinationCategoryPage from "../pages/destinations/CreateDestinationCategoryPage";
import { DestinationDetail } from "../pages/destinations/DestinationDetail";
import { ApproveRejectEvents } from "../pages/destinations/ApproveRejectEvents";
import { EventDetail } from "../pages/destinations/EventDetail";
import { KycCenterPage } from "../pages/Kyc/KycCenterPage";
import { KycDetailPage } from "../pages/Kyc/KycDetailPage";
import { TravelPackagesCenterPage } from "../pages/travelPackages/TravelPackagesCenterPage";
import { TravelPackageDetailPage } from "../pages/travelPackages/TravelPackageDetailPage";
import ManageRewardsPage from "../pages/rewards/ManageRewardsPage";
import StayKycCenterPage from "../pages/stayKyc/StayKycCenterPage";
import StayKycDetailPage from "../pages/stayKyc/StayKycDetailPage";
import ManageUsersPage from "../pages/ManageUsers/ManageUsersPage";
import UserDetailPage from "../pages/ManageUsers/UserDetailPage";

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
        path: "approve-reject-events",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <ApproveRejectEvents />
          </ProtectedRoute>
        ),
      },

      {
        path: "destination/:id",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <DestinationDetail />
          </ProtectedRoute>
        ),
      },

      {
        path: "event/:id",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <EventDetail />
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

      {
        path: "add-destination-category",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <CreateDestinationCategoryPage />
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
        path: "manage-users",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <ManageUsersPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "manage-users/:userId",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <UserDetailPage />
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

      {
        path: "manage-rewards",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <ManageRewardsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "verify-kyc",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <KycCenterPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "verify-stay-kyc",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <StayKycCenterPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/admin/stay-kyc/:id",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <StayKycDetailPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "kyc/:id",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <KycDetailPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/admin/travel-packages/:id",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <TravelPackageDetailPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "verify-travel-package",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPPORT_ADMIN"]}>
            <TravelPackagesCenterPage />
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
