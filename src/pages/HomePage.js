// HomePage.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import DocumentGrid from '../components/DocumentGrid';
import ViewAllButton from '../components/ViewAllButton';
import Footer from '../components/Footer';
import { supabase } from '../data/supabaseClient';
import './Page.css';

function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Public category IDs that everyone can see (using your UUIDs)
  const publicCategoryIds = [
    'bbc0fda0-f4c4-4b4d-ad3c-edc682a9a2d4', // Algemene
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let availableCategoryIds = [...publicCategoryIds];
      let categoryData = [];
      
      // Fetch all categories to get their names
      const { data: allCategories, error: catError } = await supabase
        .from('categories')
        .select('id, name');
        
      if (catError) throw catError;
      
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
      
      // Create category objects with id and name
      categoryData = availableCategoryIds.map(id => {
        const category = allCategories.find(cat => cat.id === id);
        return {
          id: id,
          name: category ? category.name : 'Unknown'
        };
      });
      
      setCategories(categoryData);

      // Fetch documents based on available category IDs
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*, categories:category(name)')
        .in('category', availableCategoryIds);

      if (docsError) throw docsError;

      // Add category name to each document for easier display
      const docsWithCategoryNames = docs.map(doc => ({
        ...doc,
        categoryName: doc.categories?.name || 'Unknown'
      }));

      setDocuments(docsWithCategoryNames || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle document deletion
  const handleDocumentDelete = (deletedId) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== deletedId));
  };

  // Function to get documents by category (limited to 3)
  const getDocumentsByCategory = (categoryId) => {
    return documents
      .filter(doc => doc.category === categoryId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3); // Limit to 3 documents per category
  };

  // Get new documents (most recent 3 documents)
  const newDocuments = [...documents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

    if (loading) return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Documenten laden...</p>
      </div>
    );
  

  return (
    <>
      <Hero />
      <main className="container">
        <SectionTitle title="Nieuwe handleidingen" />
        <DocumentGrid 
          documents={newDocuments} 
          onDocumentDelete={handleDocumentDelete} 
        />
        
        {categories.map(category => {
          const categoryDocuments = getDocumentsByCategory(category.id);
          if (categoryDocuments.length === 0) return null;
          
          return (
            <div key={category.id}>
              <SectionTitle title={`${category.name} handleidingen`} />
              <DocumentGrid 
                documents={categoryDocuments} 
                onDocumentDelete={handleDocumentDelete} 
              />
              <ViewAllButton category={category.id} categoryName={category.name} />
            </div>
          );
        })}
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
