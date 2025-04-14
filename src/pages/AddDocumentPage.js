import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { supabase } from '../data/supabaseClient';
import './Page.css';
import './AddDocumentPage.css';

function AddDocumentPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [loading, setLoading] = useState(true);
  const [userCategories, setUserCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Try to get current user
        const { data: userData } = await supabase.auth.getUser();
        
        // If user is logged in, fetch their assigned categories
        if (userData && userData.user) {
          const userId = userData.user.id;
          
          // Fetch user preferences/categories with category names
          const { data: preferences, error: prefError } = await supabase
            .from('user_preferences')
            .select('category, categories(id, name)')
            .eq('user_id', userId);

          if (!prefError && preferences) {
            // Extract category objects with id and name
            const assignedCategories = preferences.map(pref => ({
              id: pref.category,
              name: pref.categories?.name || 'Unknown'
            }));
            
            setUserCategories(assignedCategories);
            
            // Set default category if categoryParam exists and is in user categories
            if (categoryParam) {
              const foundCategory = assignedCategories.find(cat => cat.id === categoryParam);
              if (foundCategory) {
                setFormData(prev => ({ ...prev, category: foundCategory.id }));
              } else if (assignedCategories.length > 0) {
                setFormData(prev => ({ ...prev, category: assignedCategories[0].id }));
              }
            } else if (assignedCategories.length > 0) {
              setFormData(prev => ({ ...prev, category: assignedCategories[0].id }));
            }
          }
        }
                
      } catch (error) {
        console.error('Fout bij het ophalen van categorieën:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [categoryParam]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.link || !formData.category) {
      setSubmitStatus({ success: false, message: 'Vul alle velden in' });
      return;
    }
    
    // Check if description is under 30 words
    const wordCount = formData.description.trim().split(/\s+/).length;
    if (wordCount > 30) {
      setSubmitStatus({ success: false, message: 'De beschrijving moet 30 woorden of minder zijn' });
      return;
    }
    
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        throw new Error('U moet ingelogd zijn om een document toe te voegen');
      }
      
      // Store data with user ID
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            category: formData.category, // This is now a UUID
            title: formData.title,
            description: formData.description,
            link: formData.link,
            created_by: userData.user.id // Add the user ID
          }
        ]);
      
      if (error) throw error;
      
      setSubmitStatus({ success: true, message: 'Document succesvol toegevoegd!' });
      setFormData({ title: '', description: '', link: '', category: formData.category });
    } catch (error) {
      console.error('Fout bij toevoegen document:', error);
      setSubmitStatus({ success: false, message: `Document niet toegevoegd: ${error.message}` });
    }
  };
  
  return (
    <>
      <main className="form-container" style={{ marginTop: '40px' }}>
        <h1 className="form-title">Nieuw document toevoegen</h1>
        
        {loading ? (
          <div className="loading">Laden...</div>
        ) : (
          <form onSubmit={handleSubmit} className="document-form">
            <div className="form-group">
              <label htmlFor="title">Document Titel:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Beschrijving (max 30 woorden):</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              ></textarea>
              <small>
              Aantal woorden: {formData.description.trim() ? formData.description.trim().split(/\s+/).length : 0}/30
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="link">Document Link:</label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Categorie:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Selecteer een categorie</option>
                {userCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {submitStatus.message && (
              <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
            Document toevoegen
            </button>
            
            <Link to="/" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Annuleren
            </Link>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}

export default AddDocumentPage;
