import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const PaymentMethod = ({ selectedMethod, setSelectedMethod, onNext, onPrev }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    
    onNext();
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card, UPI, Net Banking',
      description: 'Secure payment via Razorpay',
      recommended: true,
      icon: 'fas fa-credit-card'
    },
    {
      id: 'international',
      title: 'International Cards',
      description: 'Secure payment via Stripe',
      recommended: false,
      icon: 'fas fa-globe'
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      recommended: false,
      icon: 'fas fa-money-bill-wave'
    }
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {paymentMethods.map((method) => (
          <Col md={12} key={method.id} className="mb-3">
            <Card 
              className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
              style={{ 
                cursor: 'pointer',
                border: selectedMethod === method.id ? '2px solid #6366f1' : '2px solid #e9ecef',
                backgroundColor: selectedMethod === method.id ? '#f8f9ff' : 'white',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedMethod(method.id)}
            >
              <Card.Body>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    id={method.id}
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="me-3"
                  />
                  <div 
                    className="payment-method-icon me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}
                  >
                    <i className={method.icon}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center">
                      <h6 className="mb-1">{method.title}</h6>
                      {method.recommended && (
                        <span className="badge bg-success ms-2">Recommended</span>
                      )}
                    </div>
                    <small className="text-muted">{method.description}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Show card details form only if card payment is selected */}
      {(selectedMethod === 'card' || selectedMethod === 'international') && (
        <Card className="mt-4">
          <Card.Header>
            <h6 className="mb-0">Card Details</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleCardDetailsChange}
                    placeholder="Enter name as on card"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="123"
                    maxLength="4"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3">
              <small className="text-muted">
                <i className="fas fa-lock me-1"></i>
                Your payment information is secure and encrypted. We don't store your card details.
              </small>
            </div>
          </Card.Body>
        </Card>
      )}

      {selectedMethod === 'cod' && (
        <Card className="mt-4">
          <Card.Body>
            <div className="text-center">
              <i className="fas fa-money-bill-wave text-success" style={{ fontSize: '2rem' }}></i>
              <h6 className="mt-2">Cash on Delivery</h6>
              <p className="text-muted mb-0">
                Pay securely when your order is delivered to your doorstep. 
                Additional COD charges may apply.
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={onPrev}>
          <i className="fas fa-arrow-left me-2"></i>
          Back to Shipping
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Continue to Review
          <i className="fas fa-arrow-right ms-2"></i>
        </Button>
      </div>
    </Form>
  );
};

export default PaymentMethod;
