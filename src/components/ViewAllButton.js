// ViewAllButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ViewAllButton({ category, categoryName }) {
  // Use the lowercase category name for styling
  const categoryClass = categoryName ? categoryName.toLowerCase() : '';
  
  return (
    <div className="section-footer">
      <Link to={`/documents?category=${category}`} className={`view-all-btn ${categoryClass}`}>
        <span>Bekijk alle {categoryName} Handleidingen</span>
        <span className="arrow">→</span>
      </Link>
    </div>
  );
}

export default ViewAllButton;
