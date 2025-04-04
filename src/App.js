import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllDocumentsPage from './pages/AllDocumentsPage';
import './styles.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        <Route path="/all-documents" element={<AllDocumentsPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
      </Routes>
    </Router>
  );
}

export default App;
