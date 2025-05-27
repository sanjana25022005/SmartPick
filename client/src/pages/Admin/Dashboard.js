import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 145,
    totalRevenue: 125000,
    totalProducts: 89,
    totalUsers: 234,
    pendingOrders: 12,
    lowStockProducts: 5
  });

  const [recentOrders] = useState([
    { id: 'ORD-001', customer: 'John Doe', amount: 299, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 450, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 899, status: 'processing', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Sarah Wilson', amount: 1200, status: 'completed', date: '2024-01-14' },
    { id: 'ORD-005', customer: 'David Brown', amount: 675, status: 'pending', date: '2024-01-13' }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <Container fluid>
          {/* Page Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="dashboard-title">Admin Dashboard</h1>
                  <p className="dashboard-subtitle">Welcome back! Here's what's happening in your store.</p>
                </div>
                <div>
                  <Button variant="primary" as={Link} to="/admin/products">
                    <i className="fas fa-plus me-2"></i>
                    Add Product
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card stats-card-primary">
                <Card.Body>
                  <div className="stats-content">
                    <div className="stats-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="stats-info">
                      <h3 className="stats-number">{stats.totalOrders}</h3>
                      <p className="stats-label">Total Orders</p>
                      <small className="stats-change text-success">
                        <i className="fas fa-arrow-up"></i> +12% from last month
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card stats-card-success">
                <Card.Body>
                  <div className="stats-content">
                    <div className="stats-icon">
                      <i className="fas fa-rupee-sign"></i>
                    </div>
                    <div className="stats-info">
                      <h3 className="stats-number">{formatCurrency(stats.totalRevenue)}</h3>
                      <p className="stats-label">Total Revenue</p>
                      <small className="stats-change text-success">
                        <i className="fas fa-arrow-up"></i> +18% from last month
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card stats-card-info">
                <Card.Body>
                  <div className="stats-content">
                    <div className="stats-icon">
                      <i className="fas fa-box"></i>
                    </div>
                    <div className="stats-info">
                      <h3 className="stats-number">{stats.totalProducts}</h3>
                      <p className="stats-label">Total Products</p>
                      <small className="stats-change text-info">
                        <i className="fas fa-arrow-up"></i> +5 new products
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <Card className="stats-card stats-card-warning">
                <Card.Body>
                  <div className="stats-content">
                    <div className="stats-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stats-info">
                      <h3 className="stats-number">{stats.totalUsers}</h3>
                      <p className="stats-label">Total Users</p>
                      <small className="stats-change text-success">
                        <i className="fas fa-arrow-up"></i> +8% from last month
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions & Recent Orders */}
          <Row>
            <Col lg={4} className="mb-4">
              <Card className="quick-actions-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-bolt me-2"></i>
                    Quick Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="quick-actions">
                    <Button variant="outline-primary" as={Link} to="/admin/products" className="w-100 mb-3">
                      <i className="fas fa-plus me-2"></i>
                      Add New Product
                    </Button>
                    <Button variant="outline-success" as={Link} to="/admin/orders" className="w-100 mb-3">
                      <i className="fas fa-eye me-2"></i>
                      View All Orders
                    </Button>
                    <Button variant="outline-info" as={Link} to="/admin/users" className="w-100 mb-3">
                      <i className="fas fa-user-plus me-2"></i>
                      Manage Users
                    </Button>
                    <Button variant="outline-warning" as={Link} to="/admin/analytics" className="w-100">
                      <i className="fas fa-chart-bar me-2"></i>
                      View Analytics
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8} className="mb-4">
              <Card className="recent-orders-card">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Recent Orders
                    </h5>
                    <Button variant="outline-primary" size="sm" as={Link} to="/admin/orders">
                      View All
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.id}</strong>
                          </td>
                          <td>{order.customer}</td>
                          <td>{formatCurrency(order.amount)}</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Alerts */}
          <Row>
            <Col>
              <Card className="alerts-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Important Alerts
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>{stats.pendingOrders}</strong> orders are pending approval.
                    <Button variant="link" as={Link} to="/admin/orders" className="p-0 ms-2">
                      Review Orders
                    </Button>
                  </div>
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-box-open me-2"></i>
                    <strong>{stats.lowStockProducts}</strong> products are running low on stock.
                    <Button variant="link" as={Link} to="/admin/products" className="p-0 ms-2">
                      Manage Inventory
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;