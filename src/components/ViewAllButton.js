import React from 'react';
import { Link } from 'react-router-dom';

function ViewAllButton({ category }) {
  return (
    <div className="section-footer">
      <Link to={`/all-documents?category=${category}`} className={`view-all-btn ${category.toLowerCase()}`}>
        <span>View All {category} Documents</span>
        <span className="arrow">→</span>
      </Link>
    </div>
  );
}

export default ViewAllButton;
