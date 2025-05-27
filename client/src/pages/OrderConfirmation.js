import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
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
        <Row className="py-4">
          <Col>
            <div className="text-center mb-4">
              <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
              <h2 className="text-success">Order Confirmed!</h2>
              <p className="lead">Thank you for your purchase</p>
            </div>

            <nav aria-label="Order progress">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <i className="fas fa-shopping-cart me-1 text-success"></i>Cart
                </li>
                <li className="breadcrumb-item">
                  <i className="fas fa-credit-card me-1 text-success"></i>Checkout
                </li>
                <li className="breadcrumb-item active">
                  <i className="fas fa-check-circle me-1 text-success"></i>Confirmation
                </li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Alert variant="success" className="text-center p-4 mb-4">
              <i className="fas fa-truck fa-2x mb-3"></i>
              <h5>Your order has been placed successfully!</h5>
              <p className="mb-2">
                Order ID: <strong>{orderData?.id}</strong>
              </p>
              <p className="mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Estimated delivery: {orderData?.estimatedDelivery ? new Date(orderData.estimatedDelivery).toLocaleDateString() : 'Within 7 days'}
              </p>
            </Alert>

            {/* Order Details */}
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">
                      <i className="fas fa-user me-2"></i>
                      Customer Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-1">
                      <i className="fas fa-user me-2 text-muted"></i>
                      <strong>{orderData?.customerInfo?.firstName} {orderData?.customerInfo?.lastName}</strong>
                    </p>
                    <p className="mb-1">
                      <i className="fas fa-envelope me-2 text-muted"></i>
                      {orderData?.customerInfo?.email}
                    </p>
                    <p className="mb-0">
                      <i className="fas fa-phone me-2 text-muted"></i>
                      {orderData?.customerInfo?.phone}
                    </p>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Shipping Address
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">
                      <i className="fas fa-home me-2 text-muted"></i>
                      {orderData?.customerInfo?.address}<br />
                      {orderData?.customerInfo?.city}, {orderData?.customerInfo?.state}<br />
                      {orderData?.customerInfo?.pincode}
                    </p>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">
                      <i className="fas fa-credit-card me-2"></i>
                      Payment Method
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">
                      {orderData?.paymentMethod === 'cod' && <><i className="fas fa-money-bill-wave me-2 text-success"></i>Cash on Delivery</>}
                      {orderData?.paymentMethod === 'card' && <><i className="fas fa-credit-card me-2 text-primary"></i>Credit/Debit Card</>}
                      {orderData?.paymentMethod === 'upi' && <><i className="fas fa-mobile-alt me-2 text-info"></i>UPI Payment</>}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                {/* Order Summary */}
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">
                      <i className="fas fa-receipt me-2"></i>
                      Order Summary
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {orderData?.items?.map((item) => (
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
                              <i className="fas fa-tag me-1"></i>
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
                      <span>
                        <i className="fas fa-calculator me-2"></i>
                        Subtotal:
                      </span>
                      <span>₹{orderData?.orderSummary?.subtotal?.toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <i className="fas fa-truck me-2"></i>
                        Shipping:
                      </span>
                      <span className={orderData?.orderSummary?.shipping === 0 ? 'text-success' : ''}>
                        {orderData?.orderSummary?.shipping === 0 ? (
                          <>
                            <i className="fas fa-gift me-1"></i>
                            FREE
                          </>
                        ) : `₹${orderData?.orderSummary?.shipping}`}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        <i className="fas fa-percentage me-2"></i>
                        Tax (GST):
                      </span>
                      <span>₹{orderData?.orderSummary?.tax?.toLocaleString()}</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between">
                      <strong>
                        <i className="fas fa-rupee-sign me-2"></i>
                        Total Paid:
                      </strong>
                      <strong className="text-primary fs-5">₹{orderData?.orderSummary?.total?.toLocaleString()}</strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button variant="primary" className="me-3" onClick={() => navigate('/orders')}>
                <i className="fas fa-list me-2"></i>
                View All Orders
              </Button>
              <Button variant="outline-primary" onClick={() => navigate('/products')}>
                <i className="fas fa-shopping-bag me-2"></i>
                Continue Shopping
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderConfirmation;
