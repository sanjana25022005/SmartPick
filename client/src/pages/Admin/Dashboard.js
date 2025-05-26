import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/Admin/AdminLayout';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalProducts: 156,
          totalOrders: 234,
          totalUsers: 89,
          totalRevenue: 125000,
          pendingOrders: 12,
          lowStockProducts: 8
        });

        setRecentOrders([
          {
            id: 'ORD001',
            customer: 'John Doe',
            email: 'john@example.com',
            date: '2024-01-15',
            status: 'Pending',
            total: 1299,
            items: 3
          },
          {
            id: 'ORD002',
            customer: 'Jane Smith',
            email: 'jane@example.com',
            date: '2024-01-14',
            status: 'Shipped',
            total: 899,
            items: 1
          },
          {
            id: 'ORD003',
            customer: 'Mike Johnson',
            email: 'mike@example.com',
            date: '2024-01-14',
            status: 'Delivered',
            total: 650,
            items: 2
          }
        ]);

        setTopProducts([
          {
            id: 1,
            name: 'Premium Gel Pen Set',
            sales: 45,
            revenue: 13455,
            stock: 23
          },
          {
            id: 2,
            name: 'A4 Ruled Notebooks',
            sales: 38,
            revenue: 17100,
            stock: 15
          },
          {
            id: 3,
            name: 'Desk Organizer Pro',
            sales: 25,
            revenue: 22475,
            stock: 8
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
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
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading dashboard...</h4>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Welcome Header */}
        <div className="dashboard-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="dashboard-title">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="dashboard-subtitle">
                Here's what's happening with your store today.
              </p>
            </Col>
            <Col xs="auto">
              <div className="dashboard-date">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </Col>
          </Row>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card revenue-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-success">
                    <i className="fas fa-rupee-sign"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{formatPrice(stats.totalRevenue)}</h3>
                    <p>Total Revenue</p>
                    <small className="text-success">
                      <i className="fas fa-arrow-up me-1"></i>
                      +12% from last month
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card orders-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-primary">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{stats.totalOrders}</h3>
                    <p>Total Orders</p>
                    <small className="text-warning">
                      <i className="fas fa-clock me-1"></i>
                      {stats.pendingOrders} pending
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card products-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-info">
                    <i className="fas fa-box"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{stats.totalProducts}</h3>
                    <p>Products</p>
                    <small className="text-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      {stats.lowStockProducts} low stock
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-card users-card">
              <Card.Body>
                <div className="stats-content">
                  <div className="stats-icon bg-warning">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stats-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Customers</p>
                    <small className="text-success">
                      <i className="fas fa-user-plus me-1"></i>
                      +5 this week
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Recent Orders */}
          <Col lg={8}>
            <Card className="recent-orders-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-list-alt me-2"></i>
                  Recent Orders
                </h5>
                <Button as={Link} to="/admin/orders" variant="outline-primary" size="sm">
                  View All Orders
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>
                          <div>
                            <strong>{order.customer}</strong>
                            <br />
                            <small className="text-muted">{order.email}</small>
                          </div>
                        </td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td><strong>{formatPrice(order.total)}</strong></td>
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

          {/* Quick Actions & Top Products */}
          <Col lg={4}>
            {/* Quick Actions */}
            <Card className="quick-actions-card mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="quick-actions">
                  <Button 
                    as={Link}
                    to="/admin/products"
                    variant="primary" 
                    className="w-100 mb-2"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add New Product
                  </Button>
                  <Button 
                    as={Link}
                    to="/admin/orders"
                    variant="outline-primary" 
                    className="w-100 mb-2"
                  >
                    <i className="fas fa-list me-2"></i>
                    Manage Orders
                  </Button>
                  <Button 
                    as={Link}
                    to="/admin/users"
                    variant="outline-secondary" 
                    className="w-100 mb-2"
                  >
                    <i className="fas fa-users me-2"></i>
                    View Customers
                  </Button>
                  <Button 
                    as={Link}
                    to="/admin/analytics"
                    variant="outline-info" 
                    className="w-100"
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    View Analytics
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Top Products */}
            <Card className="top-products-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Top Products
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="top-products-list">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="top-product-item">
                      <div className="product-rank">
                        #{index + 1}
                      </div>
                      <div className="product-details">
                        <h6>{product.name}</h6>
                        <div className="product-stats">
                          <small className="text-muted">
                            {product.sales} sales • {formatPrice(product.revenue)}
                          </small>
                          <br />
                          <small className={product.stock < 10 ? 'text-danger' : 'text-success'}>
                            Stock: {product.stock}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;