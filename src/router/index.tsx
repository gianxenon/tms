import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayouts";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/features/auth/Login";
import Dashboard from "@/features/dashboard/Dashboard";
import type { JSX } from "react";
import Trips from "@/features/trip/trip";

const isAuthenticated = () => !!localStorage.getItem("token"); // or Zustand token

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
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
      { path: "", element: <Navigate to="dashboard" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}