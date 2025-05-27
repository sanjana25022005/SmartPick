import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Tab, Tabs, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [orders, setOrders] = useState([]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    orderUpdates: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Initialize profile data with user data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || ''
      });
    }
    
    // Load orders from localStorage (in real app, this would be from API)
    const savedOrders = JSON.parse(localStorage.getItem('smartpick_orders') || '[]');
    setOrders(savedOrders);
  }, [user, isAuthenticated, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...profileData };
      updateUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('smartpick_user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match!' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters long!' });
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save preferences
      localStorage.setItem('smartpick_preferences', JSON.stringify(preferences));
      
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update preferences. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>
                <i className="fas fa-user-circle me-2 text-primary"></i>
                My Profile
              </h2>
              {user?.isAdmin && (
                <Badge bg="primary" className="fs-6">
                  <i className="fas fa-crown me-1"></i>
                  Administrator
                </Badge>
              )}
            </div>

            {message.text && (
              <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                {message.text}
              </Alert>
            )}

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
              {/* Profile Information Tab */}
              <Tab eventKey="profile" title={<><i className="fas fa-user me-2"></i>Profile</>}>
                <Card className="shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-id-card me-2"></i>
                      Personal Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name *</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name *</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.city}
                              onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Select
                              value={profileData.state}
                              onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                            >
                              <option value="">Select State</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                              {/* Add more states as needed */}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.pincode}
                              onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                              maxLength="6"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              value={profileData.gender}
                              onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Update Profile
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>

              {/* Security Tab */}
              <Tab eventKey="security" title={<><i className="fas fa-lock me-2"></i>Security</>}>
                <Card className="shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-key me-2"></i>
                      Change Password
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password *</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>New Password *</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          required
                          minLength="6"
                        />
                        <Form.Text className="text-muted">
                          Password must be at least 6 characters long.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password *</Form.Label>
                        <Form.Control
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          required
                        />
                      </Form.Group>

                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shield-alt me-2"></i>
                            Update Password
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>

              {/* Orders Tab */}
              <Tab eventKey="orders" title={<><i className="fas fa-box me-2"></i>Orders ({orders.length})</>}>
                <Card className="shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-history me-2"></i>
                      Order History
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {orders.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Items</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order.id}>
                                <td><strong>{order.id}</strong></td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.items.length} items</td>
                                <td>{formatCurrency(order.orderSummary.total)}</td>
                                <td>
                                  <Badge bg={getStatusColor(order.status)}>
                                    {order.status.toUpperCase()}
                                  </Badge>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/order-details/${order.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                        <h5>No orders yet</h5>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <Button variant="primary" onClick={() => navigate('/products')}>
                          <i className="fas fa-shopping-bag me-2"></i>
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              {/* Preferences Tab */}
              <Tab eventKey="preferences" title={<><i className="fas fa-cog me-2"></i>Preferences</>}>
                <Card className="shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-bell me-2"></i>
                      Notification Preferences
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handlePreferencesSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="emailNotifications"
                          label="Email Notifications"
                          checked={preferences.emailNotifications}
                          onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                        />
                        <Form.Text className="text-muted">
                          Receive general email notifications about your account.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="smsNotifications"
                          label="SMS Notifications"
                          checked={preferences.smsNotifications}
                          onChange={(e) => setPreferences({...preferences, smsNotifications: e.target.checked})}
                        />
                        <Form.Text className="text-muted">
                          Receive SMS notifications for important updates.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="promotionalEmails"
                          label="Promotional Emails"
                          checked={preferences.promotionalEmails}
                          onChange={(e) => setPreferences({...preferences, promotionalEmails: e.target.checked})}
                        />
                        <Form.Text className="text-muted">
                          Receive emails about special offers and promotions.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="orderUpdates"
                          label="Order Updates"
                          checked={preferences.orderUpdates}
                          onChange={(e) => setPreferences({...preferences, orderUpdates: e.target.checked})}
                        />
                        <Form.Text className="text-muted">
                          Receive notifications about order status changes.
                        </Form.Text>
                      </Form.Group>

                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
