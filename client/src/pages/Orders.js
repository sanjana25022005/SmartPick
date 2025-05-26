import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock orders data
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD001',
          date: '2024-01-15',
          status: 'Delivered',
          total: 1299,
          items: [
            { name: 'Premium Gel Pen Set', quantity: 2, price: 299, image: 'https://via.placeholder.com/80x80' },
            { name: 'A4 Notebooks Pack', quantity: 1, price: 450, image: 'https://via.placeholder.com/80x80' }
          ],
          tracking: 'TRK123456789',
          deliveryDate: '2024-01-18'
        },
        {
          id: 'ORD002',
          date: '2024-01-10',
          status: 'Shipped',
          total: 899,
          items: [
            { name: 'Desk Organizer Pro', quantity: 1, price: 899, image: 'https://via.placeholder.com/80x80' }
          ],
          tracking: 'TRK987654321',
          estimatedDelivery: '2024-01-20'
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      'Delivered': 'success',
      'Shipped': 'primary',
      'Processing': 'warning',
      'Cancelled': 'danger',
      'Pending': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'} className="status-badge">{status}</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab;
  });

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading your orders...</h4>
        </div>
      </Container>
    );
  }

  return (
    <div className="orders-page">
      <Container className="py-4">
        <div className="page-header mb-4">
          <h1>Your Orders</h1>
          <p className="text-muted">Track and manage your orders</p>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="orders-tabs mb-4"
        >
          <Tab eventKey="all" title="All Orders">
            <div className="orders-content">
              {filteredOrders.length === 0 ? (
                <div className="empty-orders text-center py-5">
                  <i className="fas fa-box-open mb-3"></i>
                  <h4>No orders found</h4>
                  <p className="text-muted">Start shopping to see your orders here</p>
                  <Button as={Link} to="/" variant="primary">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map(order => (
                    <Card key={order.id} className="order-card mb-4">
                      <Card.Header className="order-header">
                        <Row className="align-items-center">
                          <Col md={3}>
                            <div className="order-info">
                              <h6>Order #{order.id}</h6>
                              <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="order-status">
                              {getStatusBadge(order.status)}
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="order-total">
                              <strong>{formatPrice(order.total)}</strong>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="order-actions">
                              <Button variant="outline-primary" size="sm" className="me-2">
                                View Details
                              </Button>
                              {order.status === 'Delivered' && (
                                <Button variant="outline-secondary" size="sm">
                                  Reorder
                                </Button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Card.Header>
                      
                      <Card.Body>
                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <img src={item.image} alt={item.name} className="item-image" />
                              <div className="item-details">
                                <h6>{item.name}</h6>
                                <p>Quantity: {item.quantity}</p>
                                <p className="item-price">{formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {order.tracking && (
                          <div className="tracking-info mt-3">
                            <h6>Tracking Information</h6>
                            <p><strong>Tracking ID:</strong> {order.tracking}</p>
                            {order.deliveryDate && (
                              <p><strong>Delivered on:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                            )}
                            {order.estimatedDelivery && (
                              <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>
          
          <Tab eventKey="delivered" title="Delivered">
            {/* Same content structure */}
          </Tab>
          
          <Tab eventKey="shipped" title="Shipped">
            {/* Same content structure */}
          </Tab>
          
          <Tab eventKey="processing" title="Processing">
            {/* Same content structure */}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default Orders;
