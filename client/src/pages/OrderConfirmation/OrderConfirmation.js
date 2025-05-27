import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = () => {
    try {
      // First check if order was passed via navigation state
      if (location.state?.order) {
        console.log('Order found in navigation state:', location.state.order);
        setOrder(location.state.order);
      } else {
        // Fallback: get latest order from localStorage
        const orders = JSON.parse(localStorage.getItem('smartpick_orders') || '[]');
        console.log('Orders from localStorage:', orders);
        if (orders.length > 0) {
          const latestOrder = orders[orders.length - 1];
          console.log('Latest order:', latestOrder);
          setOrder(latestOrder);
        } else {
          console.log('No orders found, redirecting to home');
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI Payment',
      'netbanking': 'Net Banking',
      'cod': 'Cash on Delivery',
      'international': 'International Card'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', marginTop: '120px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <Container style={{ marginTop: '120px', minHeight: '60vh' }}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center">
              <Card.Body>
                <h3>Order Not Found</h3>
                <p>We couldn't find your order details.</p>
                <Button as={Link} to="/" variant="primary">
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-5">
          <Col>
            {/* Success Header */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="text-center py-4">
                <div className="text-success mb-3">
                  <i className="fas fa-check-circle" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="text-success mb-3">Order Confirmed!</h2>
                <p className="text-muted mb-3">
                  {location.state?.message || 'Thank you for your order. We\'ll send you updates via email.'}
                </p>
                <h4 className="text-primary">Order ID: {order.id}</h4>
              </Card.Body>
            </Card>

            <Row>
              {/* Order Details */}
              <Col lg={8} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-box me-2"></i>
                      Order Details
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive className="mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item) => (
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
                                  <h6 className="mb-1">{item.name}</h6>
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
                  </Card.Body>
                </Card>

                {/* Shipping Address */}
                <Card className="border-0 shadow-sm mt-4">
                  <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-shipping-fast me-2"></i>
                      Shipping Address
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <address className="mb-0">
                      <strong>{order.shippingAddress?.name}</strong><br />
                      {order.shippingAddress?.street}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                      <abbr title="Phone">P:</abbr> {order.shippingAddress?.phone}
                    </address>
                  </Card.Body>
                </Card>
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-receipt me-2"></i>
                      Order Summary
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.orderSummary?.subtotal || 0)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>{order.orderSummary?.shipping === 0 ? 'FREE' : formatCurrency(order.orderSummary?.shipping || 0)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (GST 18%):</span>
                      <span>{formatCurrency(order.orderSummary?.tax || 0)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong>{formatCurrency(order.orderSummary?.total || 0)}</strong>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted">Payment Method:</small><br />
                      <Badge bg="primary">{getPaymentMethodDisplay(order.paymentMethod)}</Badge>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Order Status:</small><br />
                      <Badge bg="success">{order.status?.toUpperCase()}</Badge>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Estimated Delivery:</small><br />
                      <strong>{new Date(order.estimatedDelivery).toLocaleDateString()}</strong>
                    </div>

                    <div className="d-grid gap-2">
                      <Button variant="primary" as={Link} to="/orders">
                        <i className="fas fa-list me-2"></i>
                        View All Orders
                      </Button>
                      <Button variant="outline-primary" as={Link} to="/products">
                        <i className="fas fa-shopping-bag me-2"></i>
                        Continue Shopping
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderConfirmation;
