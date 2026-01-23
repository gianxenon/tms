import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayouts";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/features/auth/Login";
import Dashboard from "@/features/dashboard/Dashboard";
import type { JSX } from "react";
import Trips from "@/features/trip/trip";
import Atw from "@/features/atw/atw";
import { useAuthStore } from "@/features/auth/authStore";
 

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "/", element: <Navigate to="/login" replace /> },
    ],
  },
  {
    path: "/apps",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "trip", element: <Trips /> },
      { path: "atw", element: <Atw/>  },
      { path: "", element: <Navigate to="dashboard" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}