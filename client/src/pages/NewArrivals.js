import React from 'react';
import { Container } from 'react-bootstrap';

const NewArrivals = () => {
  return (
    <div className="new-arrivals-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <h1 className="text-center mb-5">New Arrivals</h1>
        {/* Product grid similar to other pages */}
      </Container>
    </div>
  );
};

export default NewArrivals;
