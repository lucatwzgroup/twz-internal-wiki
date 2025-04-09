import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './contexts/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AllDocumentsPage from './pages/AllDocumentsPage';
import LoginPage from './pages/LoginPage';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/all-documents" 
            element={
              //<ProtectedRoute>
                <AllDocumentsPage />
              //</ProtectedRoute>
            } 
          />
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
