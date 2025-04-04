import React from 'react';
import DocumentCard from './DocumentCard';

function DocumentGrid({ documents }) {
  return (
    <div className="document-grid">
      {documents.map((document, index) => (
        <DocumentCard key={index} document={document} />
      ))}
    </div>
  );
}

export default DocumentGrid;
