import StudentView from "./pages/StudentView";
import StudentDashboard from "./pages/StudentDashboard";
import { useState, useEffect } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import Settings from "./pages/Settings";
import StudentProfile from "./pages/StudentProfile";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import MarkAttendance from "./pages/MarkAttendance";
import Records from "./pages/Records";

function App() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

 return (
  <div className="min-h-screen bg-gray-100 dark:bg-slate-800 dark:text-gray-100">
    
    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes>

        <Route path="/" element={<Login />} />
        <Route
        path="/home"
        element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Login />}
        />

        <Route path="/students" element={<Students />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/records" element={<Records />} />
        <Route path="/student-profile/:id" element={<StudentProfile />} />
        <Route path="/student-dashboard/:id" element={<StudentProfile />} />
        <Route path="/student-dashboard/:id" element={<StudentProfile />} />
        <Route
        path="/student-view/:id"
        element={isLoggedIn ? <StudentView /> : <Navigate to="/" />}
        />

        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />

      </Routes>

    </BrowserRouter>

  </div>
);
}

export default App; 