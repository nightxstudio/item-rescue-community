
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileCompletion from "./pages/ProfileCompletion";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import DevelopersDesk from "./pages/DevelopersDesk";
import FAQ from "./pages/FAQ";
import Settings from "./pages/Settings";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import Donation from "./pages/Donation";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route
        path="/"
        element={
          <Layout />
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-completion"
          element={
            <ProtectedRoute>
              <ProfileCompletion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lost-items"
          element={
            <ProtectedRoute>
              <LostItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/found-items"
          element={
            <ProtectedRoute>
              <FoundItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developers-desk"
          element={
            <ProtectedRoute>
              <DevelopersDesk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donation"
          element={
            <ProtectedRoute>
              <Donation />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </>
  )
);

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
