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
  
  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
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
            setUserCategories(assignedCategories);
            
            // Set default category if categoryParam exists and is in user categories
            if (categoryParam && assignedCategories.includes(categoryParam)) {
              setFormData(prev => ({ ...prev, category: categoryParam }));
            } else if (assignedCategories.length > 0) {
              setFormData(prev => ({ ...prev, category: assignedCategories[0] }));
            }
          }
        }
                
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [categoryParam]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.link || !formData.category) {
      setSubmitStatus({ success: false, message: 'Please fill in all fields' });
      return;
    }
    
    // Check if description is under 30 words
    const wordCount = formData.description.trim().split(/\s+/).length;
    if (wordCount > 30) {
      setSubmitStatus({ success: false, message: 'Description must be 30 words or less' });
      return;
    }
    
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        throw new Error('You must be logged in to add a document');
      }
      
      // Store data with user ID
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            category: formData.category,
            title: formData.title,
            description: formData.description,
            link: formData.link,
            created_by: userData.user.id // Add the user ID
          }
        ]);
      
      if (error) throw error;
      
      setSubmitStatus({ success: true, message: 'Document added successfully!' });
      setFormData({ title: '', description: '', link: '', category: formData.category });
    } catch (error) {
      console.error('Error adding document:', error);
      setSubmitStatus({ success: false, message: `Failed to add document: ${error.message}` });
    }
  };
  
  return (
    <>
      <main className="form-container" style={{ marginTop: '40px' }}>
        <h1 className="form-title">Add New Document</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="document-form">
            <div className="form-group">
              <label htmlFor="title">Document Title:</label>
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
              <label htmlFor="description">Description (max 30 words):</label>
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
                Word count: {formData.description.trim() ? formData.description.trim().split(/\s+/).length : 0}/30
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
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select a category</option>
                {userCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
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
              Add Document
            </button>
            
            <Link to="/" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
              Cancel
            </Link>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}

export default AddDocumentPage;
