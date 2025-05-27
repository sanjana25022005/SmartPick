import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import ShippingForm from '../../components/Checkout/ShippingForm';
import PaymentMethod from '../../components/Checkout/PaymentMethod';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  const calculateOrderSummary = useCallback(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    setOrderSummary({ subtotal, shipping, tax, total });
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    calculateOrderSummary();
  }, [cartItems, navigate, calculateOrderSummary]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object with current cart items
      const orderData = {
        id: `ORD-${Date.now()}`,
        items: [...cartItems], // Create a copy of cart items
        shippingAddress: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          email: shippingData.email,
          phone: shippingData.phone,
          street: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode
        },
        paymentMethod: selectedPaymentMethod,
        orderSummary: { ...orderSummary }, // Create a copy of order summary
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Store order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('smartpick_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('smartpick_orders', JSON.stringify(existingOrders));

      // Only clear cart AFTER successful order creation
      clearCart();

      // Navigate to order confirmation with a slight delay to ensure cart is cleared
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            order: orderData,
            message: 'Your order has been placed successfully!'
          },
          replace: true // Use replace to prevent going back to checkout
        });
      }, 100);

    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container style={{ marginTop: '120px', minHeight: '60vh' }}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="info" className="text-center">
              <h4>Your cart is empty</h4>
              <p>Add some products to proceed with checkout.</p>
              <Button variant="primary" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <h2 className="mb-4">Checkout</h2>
            
            {/* Progress Steps */}
            <div className="checkout-steps mb-4">
              <div className="d-flex justify-content-between">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-title">Shipping Details</span>
                </div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-title">Payment Method</span>
                </div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-title">Order Review</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            {/* Step 1: Shipping Details */}
            {currentStep === 1 && (
              <Card className="mb-4">
                <Card.Header>
                  <h5>Shipping Information</h5>
                </Card.Header>
                <Card.Body>
                  <ShippingForm 
                    data={shippingData} 
                    setData={setShippingData}
                    onNext={nextStep}
                  />
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card className="mb-4">
                <Card.Header>
                  <h5>Payment Method</h5>
                </Card.Header>
                <Card.Body>
                  <PaymentMethod 
                    selectedMethod={selectedPaymentMethod}
                    setSelectedMethod={setSelectedPaymentMethod}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <Card className="mb-4">
                <Card.Header>
                  <h5>Order Review</h5>
                </Card.Header>
                <Card.Body>
                  {/* Shipping Address Review */}
                  <div className="mb-4">
                    <h6>Shipping Address</h6>
                    <div className="border p-3 rounded bg-light">
                      <strong>{shippingData.firstName} {shippingData.lastName}</strong><br />
                      {shippingData.address}<br />
                      {shippingData.city}, {shippingData.state} - {shippingData.pincode}<br />
                      {shippingData.phone}
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div className="mb-4">
                    <h6>Payment Method</h6>
                    <div className="border p-3 rounded bg-light">
                      {selectedPaymentMethod === 'card' && 'Credit/Debit Card, UPI, Net Banking'}
                      {selectedPaymentMethod === 'international' && 'International Cards'}
                      {selectedPaymentMethod === 'cod' && 'Cash on Delivery'}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h6>Order Items</h6>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  className="rounded me-3"
                                />
                                <div>
                                  <h6 className="mb-0">{item.name}</h6>
                                  <small className="text-muted">{item.brand}</small>
                                </div>
                              </div>
                            </td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={prevStep}>
                      Back to Payment
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>Proceed to Pay {formatCurrency(orderSummary.total)}</>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={4}>
            <Card className="order-summary-card">
              <Card.Header>
                <h5>Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        className="rounded me-2"
                      />
                      <div>
                        <small className="d-block">{item.name}</small>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span>{formatCurrency(orderSummary.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>{orderSummary.shipping === 0 ? 'FREE' : formatCurrency(orderSummary.shipping)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax (GST):</span>
                  <span>{formatCurrency(orderSummary.tax)}</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>

                <div className="mt-3">
                  <small className="text-muted d-flex align-items-center">
                    <i className="fas fa-shield-alt me-1"></i>
                    Secure Checkout
                  </small>
                  <small className="text-muted d-block">SSL Encrypted</small>
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
