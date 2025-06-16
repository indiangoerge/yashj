import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import EstimateForm from './components/Estimates/EstimateForm';
import QuickEstimateForm from './components/Estimates/QuickEstimateForm';
import EstimatesList from './pages/EstimatesList';
import EstimateDetail from './pages/EstimateDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="create-estimate" element={<EstimateForm />} />
        <Route path="quick-estimate" element={<QuickEstimateForm />} />
        <Route path="edit-estimate/:id" element={<EstimateForm />} />
        <Route path="estimates" element={<EstimatesList />} />
        <Route path="estimate/:id" element={<EstimateDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;