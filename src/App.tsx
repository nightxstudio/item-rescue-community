
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileCompletion from "./pages/ProfileCompletion";
import Profile from "./pages/Profile";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import DevelopersDesk from "./pages/DevelopersDesk";
import FAQ from "./pages/FAQ";
import DeleteAccount from "./pages/DeleteAccount";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route element={<Layout />}>
                <Route 
                  path="/profile-completion" 
                  element={
                    <ProtectedRoute>
                      <ProfileCompletion />
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
                  path="/delete-account" 
                  element={
                    <ProtectedRoute>
                      <DeleteAccount />
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
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
