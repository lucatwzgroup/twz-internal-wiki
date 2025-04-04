import React from 'react';

function DocumentCard({ document }) {
  const { category, title, description, link } = document;
  
  return (
    <div className="document-card">
      <div className={`card-header ${category.toLowerCase()}`}></div>
      <div className="card-body">
        <span className={`card-category ${category.toLowerCase()}`}>{category}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link} className="card-link">Open Document <span>→</span></a>
      </div>
    </div>
  );
}

export default DocumentCard;
