import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('smartpick_orders') || '[]');
        setOrders(savedOrders.reverse()); // Show latest orders first
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    // Add all items from the order to cart
    order.items.forEach(item => {
      addToCart(item, item.quantity);
    });
    
    alert(`${order.items.length} items added to cart!`);
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'success',
      'processing': 'warning',
      'shipped': 'info',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ marginTop: '120px', minHeight: '60vh' }}>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your orders...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <h2 className="mb-4">My Orders</h2>
            
            {orders.length === 0 ? (
              <Alert variant="info" className="text-center">
                <h4>No orders found</h4>
                <p>You haven't placed any orders yet.</p>
                <Button variant="primary" onClick={() => navigate('/products')}>
                  Start Shopping
                </Button>
              </Alert>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="mb-4 shadow-sm">
                  <Card.Header className="bg-white">
                    <Row className="align-items-center">
                      <Col md={3}>
                        <strong>Order #{order.id}</strong>
                      </Col>
                      <Col md={3}>
                        <small className="text-muted">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </small>
                      </Col>
                      <Col md={3}>
                        <Badge bg={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </Col>
                      <Col md={3} className="text-end">
                        <strong>{formatCurrency(order.orderSummary.total)}</strong>
                      </Col>
                    </Row>
                  </Card.Header>
                  
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h6>Items Ordered:</h6>
                        <Table responsive size="sm">
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td style={{ width: '60px' }}>
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    className="rounded"
                                  />
                                </td>
                                <td>
                                  <div>
                                    <strong>{item.name}</strong>
                                    <br />
                                    <small className="text-muted">{item.brand}</small>
                                  </div>
                                </td>
                                <td>Qty: {item.quantity}</td>
                                <td>{formatCurrency(item.price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                      
                      <Col md={4}>
                        <div className="border-start ps-3">
                          <h6>Delivery Address:</h6>
                          <address className="small">
                            {order.shippingAddress.name}<br />
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                            {order.shippingAddress.pincode}
                          </address>
                          
                          <div className="mt-3">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleReorder(order)}
                              className="me-2"
                            >
                              <i className="fas fa-redo me-1"></i>
                              Reorder
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => navigate(`/order-details/${order.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Orders;
