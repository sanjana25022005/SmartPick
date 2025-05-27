import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const orderData = location.state?.orderData;

  console.log('Order confirmation data:', orderData); // Debug log

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
              
              {/* Order Summary */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Order Summary</h6>
                </Card.Header>
                <Card.Body>
                  {orderData.items.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-3 rounded"
                        />
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">
                            {item.brand} • Qty: {item.quantity}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                        <small className="text-muted">₹{item.price.toLocaleString()} each</small>
                      </div>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-1">
                    <span>Subtotal:</span>
                    <span>₹{orderData.orderSummary.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-1">
                    <span>Shipping:</span>
                    <span className={orderData.orderSummary.shipping === 0 ? 'text-success' : ''}>
                      {orderData.orderSummary.shipping === 0 ? 'FREE' : `₹${orderData.orderSummary.shipping}`}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (GST):</span>
                    <span>₹{orderData.orderSummary.tax.toLocaleString()}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between">
                    <strong>Total Paid:</strong>
                    <strong className="text-primary fs-5">₹{orderData.orderSummary.total.toLocaleString()}</strong>
                  </div>
                </Card.Body>
              </Card>
              
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
