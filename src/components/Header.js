import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract search query from URL when component mounts or URL changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce the navigation to avoid too many history entries
    // and improve performance
    if (location.pathname !== '/all-documents') {
      navigate(`/all-documents?search=${encodeURIComponent(query)}`);
    } else {
      // If already on the documents page, just update the search parameter
      const queryParams = new URLSearchParams(location.search);
      if (query.trim()) {
        queryParams.set('search', query);
      } else {
        queryParams.delete('search');
      }
      
      // Preserve other query parameters like category
      navigate({
        pathname: '/all-documents',
        search: queryParams.toString()
      }, { replace: true }); // Use replace to avoid filling browser history
    }
  };

  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <div className="logo-icon">K</div>
          <h1>Company Knowledge Base</h1>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search documentation..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
