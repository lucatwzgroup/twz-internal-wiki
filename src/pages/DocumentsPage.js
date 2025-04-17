// DocumentsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import DocumentGrid from '../components/DocumentGrid';
import Footer from '../components/Footer';
import { supabase } from '../data/supabaseClient';
import './Page.css';

function DocumentsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const searchParam = queryParams.get('search');
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'Alle handleidingen');
  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCategories, setUserCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  
  // Public categories UUIDs that everyone can see
  const publicCategoryIds = [
    'bbc0fda0-f4c4-4b4d-ad3c-edc682a9a2d4', // Algemene
  ];
  
  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let availableCategoryIds = [...publicCategoryIds];
      
      // Fetch all categories to get their names
      const { data: allCategories, error: catError } = await supabase
        .from('categories')
        .select('id, name');
      
      if (catError) throw catError;
      
      // Create a mapping of category IDs to names
      const categoryMapping = {};
      allCategories.forEach(cat => {
        categoryMapping[cat.id] = cat.name;
      });
      setCategoryNames(categoryMapping);
      
      // Try to get current user
      const { data: userData } = await supabase.auth.getUser();
      
      // If user is logged in, fetch their assigned categories
      if (userData && userData.user) {
        const userId = userData.user.id;
        
        // Fetch user preferences/categories
        const { data: preferences, error: prefError } = await supabase
          .from('user_preferences')
          .select('category')
          .eq('user_id', userId);

        if (!prefError && preferences) {
          const assignedCategoryIds = preferences.map(pref => pref.category);
          // Add user's assigned categories to available categories (avoiding duplicates)
          assignedCategoryIds.forEach(categoryId => {
            if (!availableCategoryIds.includes(categoryId)) {
              availableCategoryIds.push(categoryId);
            }
          });
        }
      }
      
      setUserCategories(availableCategoryIds);
      
      // Build query for documents with category names included
      let query = supabase.from('documents').select('*, categories:category(name)');
      
      // Filter by available categories
      query = query.in('category', availableCategoryIds);
      
      // Apply additional category filter if specified
      if (categoryParam && categoryParam !== 'Alle handleidingen') {
        query = query.eq('category', categoryParam);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Enhance documents with category names
      const enhancedDocs = data.map(doc => ({
        ...doc,
        categoryName: doc.categories?.name || categoryMapping[doc.category] || 'Unknown'
      }));
      
      setDocuments(enhancedDocs || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, [categoryParam]);
  
  // Update active category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      // If categoryParam is a UUID, try to get its name
      if (categoryNames[categoryParam]) {
        setActiveCategory(categoryNames[categoryParam]);
      } else {
        setActiveCategory(categoryParam);
      }
    } else if (!searchParam) {
      setActiveCategory('Alle handleidingen');
    }
  }, [categoryParam, searchParam, categoryNames]);
  
  // Filter documents based on search query
  useEffect(() => {
    if (searchParam && searchParam.trim() !== '') {
      const query = searchParam.toLowerCase();
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.description.toLowerCase().includes(query) ||
        (doc.categoryName && doc.categoryName.toLowerCase().includes(query))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(documents);
    }
  }, [documents, searchParam]);
  
  // Handle document deletion
  const handleDocumentDelete = (deletedId) => {
    // Update both documents and searchResults arrays
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== deletedId));
    setSearchResults(prevResults => prevResults.filter(doc => doc.id !== deletedId));
  };
  
  // Determine page title
  const pageTitle = searchParam && searchParam.trim() !== ''
    ? `Zoekresultaten voor "${searchParam}"` 
    : `${activeCategory === 'Alle handleidingen' ? 'Alle' : activeCategory} handleidingen`;
  
    if (loading) return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Documenten laden...</p>
      </div>
    );
  
  return (
    <>
      <main className="container" style={{ marginTop: '40px' }}>
        <Link to="/" className="card-link" style={{ marginBottom: '20px', display: 'inline-block' }}>
          <span>← Terug naar Home</span>
        </Link>
        
        <SectionTitle title={pageTitle} />
        
        {searchResults.length > 0 ? (
          <DocumentGrid 
            documents={searchResults} 
            onDocumentDelete={handleDocumentDelete} 
          />
        ) : (
          <p>Geen handleidingen gevonden. Probeer een andere zoekterm of categorie.</p>
        )}
      </main>
      <Footer />
    </>
  );
}

export default DocumentsPage;
