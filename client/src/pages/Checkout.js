import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    // Mock order placement
    const orderId = 'ORD' + Date.now();
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  const steps = [
    { number: 1, title: 'Shipping Address', icon: 'fas fa-map-marker-alt' },
    { number: 2, title: 'Payment Method', icon: 'fas fa-credit-card' },
    { number: 3, title: 'Review Order', icon: 'fas fa-check-circle' }
  ];

  return (
    <div className="checkout-page">
      <Container className="py-4">
        {/* Progress Steps */}
        <div className="checkout-steps mb-5">
          <div className="steps-container">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`step-item ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  <i className={step.icon}></i>
                </div>
                <div className="step-content">
                  <span className="step-number">Step {step.number}</span>
                  <span className="step-title">{step.title}</span>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>

        <Row>
          {/* Main Checkout Form */}
          <Col lg={8}>
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card className="checkout-card">
                <Card.Header>
                  <h4><i className="fas fa-map-marker-alt me-2"></i>Shipping Address</h4>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingAddress.fullName}
                            onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number *</Form.Label>
                          <Form.Control
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Address *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        placeholder="House number, street name, area"
                        required
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City *</Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State *</Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>PIN Code *</Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingAddress.pincode}
                            onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="step-actions">
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => setCurrentStep(2)}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card className="checkout-card">
                <Card.Header>
                  <h4><i className="fas fa-credit-card me-2"></i>Payment Method</h4>
                </Card.Header>
                <Card.Body>
                  <div className="payment-methods">
                    {/* Payment method selection and forms */}
                    <div className="step-actions">
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setCurrentStep(1)}
                        className="me-3"
                      >
                        Back
                      </Button>
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => setCurrentStep(3)}
                      >
                        Review Order
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <Card className="checkout-card">
                <Card.Header>
                  <h4><i className="fas fa-check-circle me-2"></i>Review Your Order</h4>
                </Card.Header>
                <Card.Body>
                  {/* Order review content */}
                  <div className="step-actions">
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setCurrentStep(2)}
                      className="me-3"
                    >
                      Back
                    </Button>
                    <Button 
                      variant="success" 
                      size="lg"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={4}>
            <Card className="order-summary-card sticky-top">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {/* Order items */}
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h6>{item.name}</h6>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                
                <div className="order-totals">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="total-line">
                    <span>Tax (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="total-line">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <hr />
                  <div className="total-line total">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
