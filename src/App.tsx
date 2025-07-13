import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import LoginPage from "./pages/LoginPage";
import PostManagement from "./pages/PostManagement";
import ReportManagement from "./pages/ReportManagement";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
     <Route path="/" element={<LoginPage />} />
     <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
     <Route path="/users" element={<Layout><UserManagement /></Layout>} />
     <Route path="/posts" element={<Layout><PostManagement /></Layout>} />
     <Route path="/reports" element={<Layout><ReportManagement /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
