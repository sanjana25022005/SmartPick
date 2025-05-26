import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
    
    // Mock orders data - replace with actual API call
    setOrders([
      {
        id: 'ORD001',
        date: '2024-01-15',
        status: 'Delivered',
        total: 1299,
        items: [
          { name: 'Premium Gel Pen Set', quantity: 2, price: 299 },
          { name: 'A4 Notebooks Pack', quantity: 1, price: 450 }
        ]
      },
      {
        id: 'ORD002',
        date: '2024-01-10',
        status: 'Shipped',
        total: 899,
        items: [
          { name: 'Desk Organizer Pro', quantity: 1, price: 899 }
        ]
      }
    ]);
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Add password change API call here
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while changing password.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Delivered': 'success',
      'Shipped': 'primary',
      'Processing': 'warning',
      'Cancelled': 'danger',
      'Pending': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="profile-page">
      <Container className="py-4">
        <Row>
          <Col>
            <div className="page-header mb-4">
              <h1>My Account</h1>
              <p className="text-muted">Manage your profile and view your orders</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={3}>
            {/* User Info Sidebar */}
            <Card className="user-info-card mb-4">
              <Card.Body className="text-center">
                <div className="user-avatar mb-3">
                  <i className="fas fa-user"></i>
                </div>
                <h5>{user?.firstName} {user?.lastName}</h5>
                <p className="text-muted mb-2">{user?.email}</p>
                {user?.isAdmin && (
                  <Badge bg="primary" className="mb-2">Admin</Badge>
                )}
                <div className="user-stats">
                  <div className="stat-item">
                    <strong>{orders.length}</strong>
                    <span>Orders</span>
                  </div>
                  <div className="stat-item">
                    <strong>{user?.wishlist?.length || 0}</strong>
                    <span>Wishlist</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
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

            <Card className="profile-content-card">
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="profile-tabs"
              >
                {/* Profile Tab */}
                <Tab eventKey="profile" title="Profile Information">
                  <div className="tab-content-wrapper">
                    <h5 className="mb-4">Personal Information</h5>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleProfileChange}
                              placeholder="Enter first name"
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              placeholder="Enter last name"
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="form-control-custom"
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed. Contact support if needed.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="Enter phone number"
                          className="form-control-custom"
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="save-btn"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Form>
                  </div>
                </Tab>

                {/* Orders Tab */}
                <Tab eventKey="orders" title="Order History">
                  <div className="tab-content-wrapper">
                    <h5 className="mb-4">Your Orders</h5>
                    {orders.length === 0 ? (
                      <div className="empty-orders text-center py-5">
                        <i className="fas fa-box-open mb-3"></i>
                        <h6>No orders yet</h6>
                        <p className="text-muted">Start shopping to see your orders here</p>
                      </div>
                    ) : (
                      <div className="orders-list">
                        {orders.map(order => (
                          <Card key={order.id} className="order-card mb-3">
                            <Card.Body>
                              <Row className="align-items-center">
                                <Col md={3}>
                                  <div className="order-info">
                                    <h6 className="order-id">#{order.id}</h6>
                                    <p className="order-date text-muted">
                                      {new Date(order.date).toLocaleDateString()}
                                    </p>
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
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      className="me-2"
                                    >
                                      View Details
                                    </Button>
                                    {order.status === 'Delivered' && (
                                      <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                      >
                                        Reorder
                                      </Button>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                              
                              <div className="order-items mt-3">
                                <h6>Items:</h6>
                                {order.items.map((item, index) => (
                                  <div key={index} className="order-item">
                                    <span>{item.name}</span>
                                    <span className="text-muted">
                                      Qty: {item.quantity} × {formatPrice(item.price)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Tab>

                {/* Security Tab */}
                <Tab eventKey="security" title="Security">
                  <div className="tab-content-wrapper">
                    <h5 className="mb-4">Change Password</h5>
                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          className="form-control-custom"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="form-control-custom"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="form-control-custom"
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="save-btn"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </Form>
                  </div>
                </Tab>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
