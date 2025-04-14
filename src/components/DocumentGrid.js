// DocumentGrid.jsx
import React from 'react';
import DocumentCard from './DocumentCard';

function DocumentGrid({ documents, onDocumentDelete }) {
  return (
    <div className="document-grid">
      {documents.map((document) => (
        <DocumentCard 
          key={document.id} 
          document={document} 
          onDelete={onDocumentDelete} 
        />
      ))}
    </div>
  );
}

export default DocumentGrid;
