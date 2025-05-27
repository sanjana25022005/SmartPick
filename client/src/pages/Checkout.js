import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useCart();
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Calculate totals properly
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    // Mock order placement
    const orderId = 'ORD' + Date.now();
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order object with correct totals
      const orderData = {
        id: `ORD${Date.now()}`,
        userId: user?.id,
        customerInfo: shippingAddress,
        items: cartItems.map(item => ({
          ...item,
          totalPrice: item.price * item.quantity
        })),
        orderSummary: {
          subtotal: Math.round(subtotal * 100) / 100,
          shipping: Math.round(shipping * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100
        },
        paymentMethod: paymentMethod,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      console.log('Order data:', orderData); // Debug log

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('smartpick_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('smartpick_orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Navigate to confirmation with order data
      navigate('/order-confirmation', { 
        state: { 
          orderData,
          message: 'Your order has been placed successfully!' 
        } 
      });

    } catch (error) {
      console.error('Order submission error:', error);
      setMessage({ type: 'danger', text: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping Address', icon: 'fas fa-map-marker-alt' },
    { number: 2, title: 'Payment Method', icon: 'fas fa-credit-card' },
    { number: 3, title: 'Review Order', icon: 'fas fa-check-circle' }
  ];

  return (
    <div className="checkout-page">
      <Container className="py-4">
        <Row className="py-4">
          <Col>
            <h2>
              <i className="fas fa-credit-card me-2 text-primary"></i>
              Checkout
            </h2>
            <nav aria-label="Checkout steps">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="fas fa-shopping-cart me-1"></i>Cart
                </li>
                <li className="breadcrumb-item active">
                  <i className="fas fa-credit-card me-1"></i>Checkout
                </li>
                <li className="breadcrumb-item text-muted">
                  <i className="fas fa-check-circle me-1"></i>Confirmation
                </li>
              </ol>
            </nav>
          </Col>
        </Row>

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
                  <h5 className="mb-0">
                    <i className="fas fa-user me-2"></i>
                    Personal Information
                  </h5>
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
                  <h5 className="mb-0">
                    <i className="fas fa-credit-card me-2"></i>
                    Payment Method
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="payment-methods">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Payment Method *</Form.Label>
                        <div>
                          <Form.Check
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            label={
                              <span>
                                <i className="fas fa-money-bill-wave me-2 text-success"></i>
                                Cash on Delivery
                              </span>
                            }
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <Form.Check
                            type="radio"
                            id="card"
                            name="payment"
                            value="card"
                            label={
                              <span>
                                <i className="fas fa-credit-card me-2 text-primary"></i>
                                Credit/Debit Card
                              </span>
                            }
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <Form.Check
                            type="radio"
                            id="upi"
                            name="payment"
                            value="upi"
                            label={
                              <span>
                                <i className="fas fa-mobile-alt me-2 text-info"></i>
                                UPI Payment
                              </span>
                            }
                            checked={paymentMethod === 'upi'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                        </div>
                      </Form.Group>
                    </Form>

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
                  <h5 className="mb-0">
                    <i className="fas fa-receipt me-2"></i>
                    Order Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Order review content */}
                  <div className="order-review">
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            className="me-2 rounded"
                          />
                          <div>
                            <small className="fw-bold">{item.name}</small>
                            <br />
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                        </div>
                        <span className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        <i className="fas fa-calculator me-2"></i>
                        Subtotal:
                      </span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        <i className="fas fa-truck me-2"></i>
                        Shipping:
                      </span>
                      <span className={shipping === 0 ? 'text-success' : ''}>
                        {shipping === 0 ? (
                          <>
                            <i className="fas fa-gift me-1"></i>
                            FREE
                          </>
                        ) : `₹${shipping}`}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        <i className="fas fa-percentage me-2"></i>
                        Tax (GST 18%):
                      </span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong className="text-primary">₹{total.toLocaleString()}</strong>
                    </div>

                    {subtotal < 500 && (
                      <Alert variant="info" className="small mb-3">
                        Add ₹{(500 - subtotal).toLocaleString()} more for free shipping!
                      </Alert>
                    )}
                  </div>

                  <div className="step-actions">
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setCurrentStep(2)}
                      className="me-3"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg" 
                      className="w-100 mt-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle me-2"></i>
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={4}>
            {/* Order Summary */}
            <Card className="checkout-summary">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        className="me-2 rounded"
                      />
                      <div>
                        <small className="fw-bold">{item.name}</small>
                        <br />
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <i className="fas fa-calculator me-2"></i>
                    Subtotal:
                  </span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <i className="fas fa-truck me-2"></i>
                    Shipping:
                  </span>
                  <span className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? (
                      <>
                        <i className="fas fa-gift me-1"></i>
                        FREE
                      </>
                    ) : `₹${shipping}`}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <i className="fas fa-percentage me-2"></i>
                    Tax (GST 18%):
                  </span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">₹{total.toLocaleString()}</strong>
                </div>

                {subtotal < 500 && (
                  <Alert variant="info" className="small mb-3">
                    Add ₹{(500 - subtotal).toLocaleString()} more for free shipping!
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
