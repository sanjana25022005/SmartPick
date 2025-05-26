import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import AdminLayout from '../../components/Admin/AdminLayout';
import './Orders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock orders data
      setTimeout(() => {
        const mockOrders = [
          {
            id: 'ORD001',
            customer: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+91 9876543210'
            },
            date: '2024-01-15',
            status: 'Pending',
            total: 1299,
            items: [
              { name: 'Premium Gel Pen Set', quantity: 2, price: 299 },
              { name: 'A4 Notebooks Pack', quantity: 1, price: 450 }
            ],
            shippingAddress: {
              street: '123 Main Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001'
            },
            paymentMethod: 'Credit Card',
            paymentStatus: 'Paid'
          },
          {
            id: 'ORD002',
            customer: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+91 9876543211'
            },
            date: '2024-01-14',
            status: 'Shipped',
            total: 899,
            items: [
              { name: 'Desk Organizer Pro', quantity: 1, price: 899 }
            ],
            shippingAddress: {
              street: '456 Oak Avenue',
              city: 'Delhi',
              state: 'Delhi',
              pincode: '110001'
            },
            paymentMethod: 'UPI',
            paymentStatus: 'Paid',
            trackingId: 'TRK123456789'
          },
          {
            id: 'ORD003',
            customer: {
              name: 'Mike Johnson',
              email: 'mike@example.com',
              phone: '+91 9876543212'
            },
            date: '2024-01-13',
            status: 'Delivered',
            total: 650,
            items: [
              { name: 'Art Supplies Kit', quantity: 1, price: 650 }
            ],
            shippingAddress: {
              street: '789 Pine Road',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001'
            },
            paymentMethod: 'Cash on Delivery',
            paymentStatus: 'Paid',
            deliveredDate: '2024-01-15'
          }
        ];
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage({ type: 'error', text: 'Failed to load orders' });
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setMessage({ type: 'success', text: 'Order status updated successfully!' });
      setShowModal(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update order status' });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Delivered': 'success',
      'Shipped': 'primary',
      'Processing': 'warning',
      'Pending': 'secondary',
      'Cancelled': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'} className="status-badge">{status}</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status.toLowerCase() === filterStatus
  );

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length
  };

  return (
    <AdminLayout>
      <div className="admin-orders">
        {/* Header */}
        <div className="orders-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-shopping-cart me-2"></i>
                Orders Management
              </h1>
              <p className="page-subtitle">
                Track and manage customer orders
              </p>
            </Col>
          </Row>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-primary">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{orderStats.total}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-warning">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{orderStats.pending}</h3>
                    <p>Pending</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-info">
                    <i className="fas fa-truck"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{orderStats.shipped}</h3>
                    <p>Shipped</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-success">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{orderStats.delivered}</h3>
                    <p>Delivered</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alert Messages */}
        {message && (
          <Alert 
            variant={message.type === 'success' ? 'success' : 'danger'} 
            className="mb-4"
            dismissible
            onClose={() => setMessage('')}
          >
            {message.text}
          </Alert>
        )}

        {/* Orders Table */}
        <Card className="orders-table-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              All Orders ({filteredOrders.length})
            </h5>
            <div className="table-filters">
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading orders...</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>
                        <div className="customer-info">
                          <strong>{order.customer.name}</strong>
                          <br />
                          <small className="text-muted">{order.customer.email}</small>
                        </div>
                      </td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>
                        <Badge bg="info">{order.items.length} items</Badge>
                      </td>
                      <td>
                        <strong>{formatPrice(order.total)}</strong>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <Badge bg={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setStatusUpdate(order.status);
                              setShowModal(true);
                            }}
                            className="me-1"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                            disabled={order.status === 'Delivered'}
                          >
                            <i className="fas fa-truck"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Order Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-shopping-cart me-2"></i>
              Order Details - #{selectedOrder?.id}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            {selectedOrder && (
              <Row>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                  
                  <h6 className="mt-3">Shipping Address</h6>
                  <p>
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                    PIN: {selectedOrder.shippingAddress.pincode}
                  </p>
                </Col>
                
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                  {selectedOrder.trackingId && (
                    <p><strong>Tracking ID:</strong> {selectedOrder.trackingId}</p>
                  )}
                  
                  <h6 className="mt-3">Update Status</h6>
                  <Form.Select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Col>
                
                <Col xs={12}>
                  <h6 className="mt-3">Order Items</h6>
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
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="text-end">
                    <strong>Total: {formatPrice(selectedOrder.total)}</strong>
                  </div>
                </Col>
              </Row>
            )}
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleStatusUpdate(selectedOrder.id, statusUpdate)}
            >
              Update Status
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
