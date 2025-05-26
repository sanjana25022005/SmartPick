import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState(''); // 'admin' or 'user'
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login successful, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (type) => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@smartpick.com',
        password: 'admin123',
        rememberMe: false
      });
      setLoginType('admin');
    } else if (type === 'user') {
      setFormData({
        email: 'user@test.com',
        password: 'password',
        rememberMe: false
      });
      setLoginType('user');
    }
    setErrors({});
    setMessage('');
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={6}>
            <Card className="auth-card">
              <Card.Body className="p-5">
                <div className="auth-header text-center">
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-subtitle">Choose your login type</p>
                </div>

                {/* Login Type Selection */}
                <div className="login-type-selection mb-4">
                  <Row>
                    <Col xs={6}>
                      <Card 
                        className={`login-type-card ${loginType === 'admin' ? 'active' : ''}`}
                        onClick={() => handleQuickLogin('admin')}
                      >
                        <Card.Body className="text-center p-3">
                          <div className="login-type-icon admin-icon mb-2">
                            <i className="fas fa-user-shield"></i>
                          </div>
                          <h6 className="mb-1">Admin Login</h6>
                          <small className="text-muted">Administrator Access</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xs={6}>
                      <Card 
                        className={`login-type-card ${loginType === 'user' ? 'active' : ''}`}
                        onClick={() => handleQuickLogin('user')}
                      >
                        <Card.Body className="text-center p-3">
                          <div className="login-type-icon user-icon mb-2">
                            <i className="fas fa-user"></i>
                          </div>
                          <h6 className="mb-1">Customer Login</h6>
                          <small className="text-muted">Customer Access</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* Demo Credentials Info */}
                {loginType && (
                  <div className="demo-info mb-4 p-3" style={{ 
                    background: loginType === 'admin' ? '#fef3c7' : '#dbeafe', 
                    borderRadius: '8px',
                    border: `1px solid ${loginType === 'admin' ? '#f59e0b' : '#3b82f6'}`
                  }}>
                    <div className="d-flex align-items-center">
                      <i className={`fas fa-${loginType === 'admin' ? 'shield-alt' : 'info-circle'} me-2`}
                         style={{ color: loginType === 'admin' ? '#f59e0b' : '#3b82f6' }}>
                      </i>
                      <div>
                        <h6 className="mb-1" style={{ color: loginType === 'admin' ? '#92400e' : '#1e40af' }}>
                          {loginType === 'admin' ? 'Admin Access' : 'Customer Access'}
                        </h6>
                        <small style={{ color: loginType === 'admin' ? '#92400e' : '#1e40af' }}>
                          {loginType === 'admin' 
                            ? 'Full access to admin panel and store management'
                            : 'Access to shopping features and order history'
                          }
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {message && (
                  <Alert 
                    variant={message.type === 'success' ? 'success' : 'danger'} 
                    className="mb-4"
                  >
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="form-control-custom"
                      isInvalid={!!errors.email}
                      readOnly={!!loginType}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="password-input-group">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="form-control-custom"
                        isInvalid={!!errors.password}
                        readOnly={!!loginType}
                      />
                      <Button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      label="Remember me"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="remember-me"
                    />
                    {loginType && (
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => {
                          setLoginType('');
                          setFormData({ email: '', password: '', rememberMe: false });
                        }}
                        className="reset-login-btn"
                      >
                        Change Login Type
                      </Button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className={`w-100 auth-submit-btn ${loginType ? `${loginType}-login-btn` : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className={`fas fa-${loginType === 'admin' ? 'shield-alt' : 'sign-in-alt'} me-2`}></i>
                        {loginType === 'admin' ? 'Admin Sign In' : loginType === 'user' ? 'Customer Sign In' : 'Sign In'}
                      </>
                    )}
                  </Button>
                </Form>

                {/* Manual Login Option */}
                {!loginType && (
                  <div className="manual-login mt-4">
                    <div className="text-center">
                      <small className="text-muted">Or enter credentials manually</small>
                    </div>
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
