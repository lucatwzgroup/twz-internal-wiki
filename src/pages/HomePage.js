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
  

  // Public categories that everyone can see
  const publicCategories = ['Sirius', 'Algemene', 'Odoo'];

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
        
        setCategories(availableCategories);

        // Fetch documents based on available categories
        const { data: docs, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .in('category', availableCategories);

        if (docsError) throw docsError;

        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Function to get documents by category (limited to 3)
  const getDocumentsByCategory = (category) => {
    return documents
      .filter(doc => doc.category === category)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3); // Limit to 3 documents per category
  };

  // Get new documents (most recent 4 documents)
  const newDocuments = [...documents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Hero />
      <main className="container">
        <SectionTitle title="Nieuwe Handleidingen" />
        <DocumentGrid documents={newDocuments} />
        
        {categories.map(category => {
          const categoryDocuments = getDocumentsByCategory(category);
          if (categoryDocuments.length === 0) return null;
          
          return (
            <div key={category}>
              <SectionTitle title={`${category} Handleidingen`} />
              <DocumentGrid documents={categoryDocuments} />
              <ViewAllButton category={category} />
            </div>
          );
        })}
      </main>
    </>
  );
}

export default HomePage;
