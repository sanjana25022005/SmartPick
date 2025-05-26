import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const BrandStore = () => {
  const { brand } = useParams();

  return (
    <div className="brand-store-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <h1 className="text-center mb-5">{brand} Store</h1>
        {/* Brand-specific products */}
      </Container>
    </div>
  );
};

export default BrandStore;
