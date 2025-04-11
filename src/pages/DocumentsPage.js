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
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'Alle Handleidingen');
  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCategories, setUserCategories] = useState([]);
  
  // Public categories that everyone can see
  const publicCategories = ['Sirius', 'Algemene', 'Odoo'];
  
  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let availableCategories = [...publicCategories];
        
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
            const assignedCategories = preferences.map(pref => pref.category);
            // Add user's assigned categories to available categories (avoiding duplicates)
            assignedCategories.forEach(category => {
              if (!availableCategories.includes(category)) {
                availableCategories.push(category);
              }
            });
          }
        }
        
        setUserCategories(availableCategories);
        
        // Build query for documents
        let query = supabase.from('documents').select('*');
        
        // Filter by available categories
        query = query.in('category', availableCategories);
        
        // Apply additional category filter if specified
        if (categoryParam && categoryParam !== 'Alle Handleidingen') {
          query = query.eq('category', categoryParam);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // No need to decrypt, just use the data directly
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [categoryParam]);
  
  // Update active category when URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else if (!searchParam) {
      setActiveCategory('Alle Handleidingen');
    }
  }, [categoryParam, searchParam]);
  
  // Filter documents based on search query
  useEffect(() => {
    if (searchParam && searchParam.trim() !== '') {
      const query = searchParam.toLowerCase();
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.description.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(documents);
    }
  }, [documents, searchParam]);
  
  // Determine page title
  const pageTitle = searchParam && searchParam.trim() !== ''
    ? `Zoekresultaten voor "${searchParam}"` 
    : `${activeCategory === 'Alle Handleidingen' ? 'Alle' : activeCategory} Handleidingen`;
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <>
      <main className="container" style={{ marginTop: '40px' }}>
        <Link to="/" className="card-link" style={{ marginBottom: '20px', display: 'inline-block' }}>
          <span>← Terug naar Home</span>
        </Link>
        
        <SectionTitle title={pageTitle} />
        
        {searchResults.length > 0 ? (
          <DocumentGrid documents={searchResults} />
        ) : (
          <p>Geen handleidingen gevonden. Probeer een andere zoekterm of categorie.</p>
        )}
      </main>
      <Footer></Footer>
    </>
  );
}

export default DocumentsPage;
