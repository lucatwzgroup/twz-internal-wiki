import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import DocumentGrid from '../components/DocumentGrid';
import Footer from '../components/Footer';
import { documents } from '../data/documents';

function AllDocumentsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const searchParam = queryParams.get('search');
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All Documents');
  const [searchResults, setSearchResults] = useState(documents);
  
  // Update active category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else if (!searchParam) {
      setActiveCategory('All Documents');
    }
  }, [categoryParam, searchParam]);
  
  // Filter documents based on search query and/or category
  useEffect(() => {
    let filtered = documents;
    
    // Apply category filter if not searching or if both search and category are specified
    if ((!searchParam && activeCategory !== 'All Documents') || 
        (searchParam && categoryParam && activeCategory !== 'All Documents')) {
      filtered = filtered.filter(doc => doc.category === activeCategory);
    }
    
    // Apply search filter
    if (searchParam && searchParam.trim() !== '') {
      const query = searchParam.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.description.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query)
      );
    }
    
    setSearchResults(filtered);
  }, [activeCategory, searchParam, categoryParam]);
  
  // Determine page title
  const pageTitle = searchParam && searchParam.trim() !== ''
    ? `Search Results for "${searchParam}"` 
    : `${activeCategory === 'All Documents' ? 'All' : activeCategory} Documents`;
  
  return (
    <>
      <Header />
      <main className="container" style={{ marginTop: '40px' }}>
        <Link to="/" className="card-link" style={{ marginBottom: '20px', display: 'inline-block' }}>
          <span>← Back to Home</span>
        </Link>
        
        <SectionTitle title={pageTitle} />
        
        {searchResults.length > 0 ? (
          <DocumentGrid documents={searchResults} />
        ) : (
          <p>No documents found. Try a different search term or category.</p>
        )}
      </main>
      <Footer />
    </>
  );
}

export default AllDocumentsPage;
