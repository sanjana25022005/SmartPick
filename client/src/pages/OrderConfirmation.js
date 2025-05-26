import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="order-confirmation-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="text-center p-5">
              <div className="confirmation-icon mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h1 className="mb-3">Order Confirmed!</h1>
              <p className="lead mb-4">
                Thank you for your order. Your order #{orderId} has been confirmed.
              </p>
              <div className="order-details mb-4">
                <p>We'll send you shipping confirmation when your items are on the way!</p>
                <p>You can track your order in your account.</p>
              </div>
              <div className="action-buttons">
                <Button as={Link} to="/orders" variant="primary" className="me-3">
                  View Orders
                </Button>
                <Button as={Link} to="/" variant="outline-primary">
                  Continue Shopping
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderConfirmation;
