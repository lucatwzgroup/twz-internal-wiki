import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import DocumentGrid from '../components/DocumentGrid';
import ViewAllButton from '../components/ViewAllButton';
import Footer from '../components/Footer';
import { documents } from '../data/documents';

function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All Documents');
  
  // Filter documents based on active category
  const filteredDocuments = activeCategory === 'All Documents' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory);
  
  // Get new documents (first 3)
  const newDocuments = documents.slice(0, 3);
  
  // Get documents by category
  const siriusDocuments = documents.filter(doc => doc.category === 'Sirius').slice(0, 3);
  const odooDocuments = documents.filter(doc => doc.category === 'Odoo').slice(0, 3);
  const generalDocuments = documents.filter(doc => doc.category === 'Algemene').slice(0, 3);
  
  return (
    <>
      <Header />
      <Hero />
      <main className="container">
        
        <SectionTitle title="Nieuwe Handleidingen" />
        <DocumentGrid documents={newDocuments} />
        
        <SectionTitle title="Sirius Handleidingen" />
        <DocumentGrid documents={siriusDocuments} />
        <ViewAllButton category="Sirius" />
        
        <SectionTitle title="Odoo Handleidingen" />
        <DocumentGrid documents={odooDocuments} />
        <ViewAllButton category="Odoo" />
        
        <SectionTitle title="Algemene Handleidingen" />
        <DocumentGrid documents={generalDocuments} />
        <ViewAllButton category="Algemene" />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
