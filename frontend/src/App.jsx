import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VehicleLookup from './pages/VehicleLookup';
import DLLookup from './pages/DLLookup';
import OnlineApplications from './pages/OnlineApplications';
import ApplicationTracking from './pages/ApplicationTracking';
import EChallan from './pages/EChallan';
import SmartSahayak from './pages/SmartSahayak';
import Profile from './pages/Profile';
import Register from './pages/Register';


// Simple PrivateRoute wrapper
const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Wrapper
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans text-slate-900 dark:text-slate-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/citizen-dashboard" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <CitizenDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/citizen/vehicle" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <VehicleLookup />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/citizen/applications" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <OnlineApplications />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/citizen/tracking" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <ApplicationTracking />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/citizen/echallan" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <EChallan />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/citizen/dl" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <DLLookup />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/citizen/sahayak" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <SmartSahayak />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/citizen/settings" 
            element={
              <PrivateRoute allowedRole="citizen">
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute allowedRole="officer">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />

          <Route 
            path="/admin/applications" 
            element={
              <PrivateRoute allowedRole="officer">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <PrivateRoute allowedRole="officer">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/admin/reports" 
            element={
              <PrivateRoute allowedRole="officer">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
