import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';
import AdminLayout from '../../components/Admin/AdminLayout';
import './Analytics.css';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 125000,
      thisMonth: 25000,
      lastMonth: 22000,
      growth: 13.6
    },
    orders: {
      total: 234,
      thisMonth: 45,
      lastMonth: 38,
      growth: 18.4
    },
    customers: {
      total: 89,
      thisMonth: 12,
      lastMonth: 8,
      growth: 50
    },
    topProducts: [
      { name: 'Premium Gel Pen Set', sales: 45, revenue: 13455 },
      { name: 'A4 Ruled Notebooks', sales: 38, revenue: 17100 },
      { name: 'Desk Organizer Pro', sales: 25, revenue: 22475 }
    ],
    salesByCategory: [
      { category: 'Pens & Writing', sales: 45, percentage: 35 },
      { category: 'Notebooks', sales: 38, percentage: 30 },
      { category: 'Organizers', sales: 25, percentage: 20 },
      { category: 'Art Supplies', sales: 19, percentage: 15 }
    ]
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getGrowthBadge = (growth) => {
    const isPositive = growth > 0;
    return (
      <span className={`growth-badge ${isPositive ? 'positive' : 'negative'}`}>
        <i className={`fas fa-arrow-${isPositive ? 'up' : 'down'} me-1`}></i>
        {Math.abs(growth)}%
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-analytics">
        {/* Header */}
        <div className="analytics-header mb-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="page-title">
                <i className="fas fa-chart-line me-2"></i>
                Analytics Dashboard
              </h1>
              <p className="page-subtitle">
                Insights and performance metrics
              </p>
            </Col>
          </Row>
        </div>

        {/* Key Metrics */}
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-3">
            <Card className="metrics-card revenue-card">
              <Card.Body>
                <div className="metrics-content">
                  <div className="metrics-icon">
                    <i className="fas fa-rupee-sign"></i>
                  </div>
                  <div className="metrics-info">
                    <h3>{formatPrice(analytics.revenue.total)}</h3>
                    <p>Total Revenue</p>
                    <div className="metrics-growth">
                      This month: {formatPrice(analytics.revenue.thisMonth)}
                      {getGrowthBadge(analytics.revenue.growth)}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6} className="mb-3">
            <Card className="metrics-card orders-card">
              <Card.Body>
                <div className="metrics-content">
                  <div className="metrics-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="metrics-info">
                    <h3>{analytics.orders.total}</h3>
                    <p>Total Orders</p>
                    <div className="metrics-growth">
                      This month: {analytics.orders.thisMonth}
                      {getGrowthBadge(analytics.orders.growth)}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6} className="mb-3">
            <Card className="metrics-card customers-card">
              <Card.Body>
                <div className="metrics-content">
                  <div className="metrics-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="metrics-info">
                    <h3>{analytics.customers.total}</h3>
                    <p>Total Customers</p>
                    <div className="metrics-growth">
                      This month: {analytics.customers.thisMonth}
                      {getGrowthBadge(analytics.customers.growth)}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Top Products */}
          <Col lg={6}>
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Top Selling Products
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="product-rank">
                            <span className="rank-badge">#{index + 1}</span>
                            {product.name}
                          </div>
                        </td>
                        <td>
                          <strong>{product.sales}</strong>
                        </td>
                        <td>
                          <strong>{formatPrice(product.revenue)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Sales by Category */}
          <Col lg={6}>
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-chart-pie me-2"></i>
                  Sales by Category
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="category-analytics">
                  {analytics.salesByCategory.map((category, index) => (
                    <div key={index} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{category.category}</span>
                        <span className="category-sales">{category.sales} sales</span>
                      </div>
                      <ProgressBar 
                        now={category.percentage} 
                        label={`${category.percentage}%`}
                        variant={index % 2 === 0 ? 'primary' : 'info'}
                        className="category-progress"
                      />
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row className="mt-4">
          <Col>
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Activity
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon bg-success">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="activity-details">
                      <p><strong>New order placed</strong> - Order #ORD001</p>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon bg-primary">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-details">
                      <p><strong>New customer registered</strong> - john@example.com</p>
                      <small className="text-muted">4 hours ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon bg-warning">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="activity-details">
                      <p><strong>Low stock alert</strong> - Premium Gel Pen Set</p>
                      <small className="text-muted">6 hours ago</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
