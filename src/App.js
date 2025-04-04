import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllDocumentsPage from './pages/AllDocumentsPage';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-documents" element={<AllDocumentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
