import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const Deals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // Mock deals data
    const mockDeals = [
      {
        id: 1,
        name: 'Premium Pen Bundle',
        originalPrice: 999,
        salePrice: 699,
        discount: 30,
        image: 'https://via.placeholder.com/300x300?text=Deal+1',
        timeLeft: '2 days left'
      }
    ];
    setDeals(mockDeals);
  }, []);

  return (
    <div className="deals-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <h1 className="text-center mb-5">Today's Deals</h1>
        <Row>
          {deals.map(deal => (
            <Col lg={3} md={4} sm={6} key={deal.id} className="mb-4">
              <Card className="deal-card h-100">
                <div className="position-relative">
                  <Card.Img variant="top" src={deal.image} />
                  <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                    {deal.discount}% OFF
                  </Badge>
                </div>
                <Card.Body>
                  <Card.Title>{deal.name}</Card.Title>
                  <div className="price-info mb-2">
                    <span className="sale-price h5">₹{deal.salePrice}</span>
                    <span className="original-price text-muted ms-2">₹{deal.originalPrice}</span>
                  </div>
                  <small className="text-danger">{deal.timeLeft}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Deals;
