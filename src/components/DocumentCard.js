import React, { useState } from 'react';
import { supabase } from '../data/supabaseClient';
import { useAuth } from '../contexts/AuthContext'; // Import your auth context

function DocumentCard({ document, onDelete }) {
  const { category, title, description, link, id, created_by } = document;
  const { user } = useAuth(); // Get current user from auth context
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if the current user created this document
  const isOwner = user && created_by === user.id;
  
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent opening the link
    e.stopPropagation(); // Prevent event bubbling
    
      setIsDeleting(true);
      
      try {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Call the onDelete callback to update the UI
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      } finally {
        setIsDeleting(false);
      }
    
  };
  
  return (
    <div className="document-card">
      <div className={`card-header ${category.toLowerCase()}`}>
        {isOwner && (
          <button 
            className="delete-button" 
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete document"
          >
            {isDeleting ? (
              <span className="deleting-spinner"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="trash-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="card-body">
        <span className={`card-category ${category.toLowerCase()}`}>{category}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link} className="card-link" target="_blank" rel="noopener noreferrer">Open Handleiding <span>→</span></a>
      </div>
    </div>
  );
}

export default DocumentCard;
