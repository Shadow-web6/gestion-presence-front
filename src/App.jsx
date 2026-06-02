import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EnseignantDashboard from "./pages/enseignant/Dashboard";
import EleveDashboard from "./pages/eleve/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/enseignant/*" element={
            <PrivateRoute roles={["enseignant"]}>
              <EnseignantDashboard />
            </PrivateRoute>
          } />
          <Route path="/eleve/*" element={
            <PrivateRoute roles={["eleve"]}>
              <EleveDashboard />
            </PrivateRoute>
          } />
          <Route path="/parent/*" element={
            <PrivateRoute roles={["parent"]}>
              <ParentDashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;