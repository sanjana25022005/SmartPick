import React from 'react';
import { Container } from 'react-bootstrap';

const BestSellers = () => {
  return (
    <div className="best-sellers-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <h1 className="text-center mb-5">Best Sellers</h1>
        {/* Product grid similar to other pages */}
      </Container>
    </div>
  );
};

export default BestSellers;
