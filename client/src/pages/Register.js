```javascript
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ text: 'Account created successfully!', type: 'success' });
    }, 2000);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="fas fa-user-plus fa-3x text-success mb-3"></i>
                <h2 className="mb-0">Create Account</h2>
                <p className="text-muted">Join SmartPick today</p>
              </div>

              {message.text && (
                <Alert variant={message.type} className="d-flex align-items-center">
                  <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-user me-2 text-muted"></i>
                        First Name
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                          className="ps-5"
                        />
                        <i className="fas fa-user position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-user me-2 text-muted"></i>
                        Last Name
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                          className="ps-5"
                        />
                        <i className="fas fa-user position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-envelope me-2 text-muted"></i>
                    Email Address
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="ps-5"
                    />
                    <i className="fas fa-envelope position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-phone me-2 text-muted"></i>
                    Phone Number
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="ps-5"
                    />
                    <i className="fas fa-phone position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-lock me-2 text-muted"></i>
                    Password
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength="6"
                      className="ps-5"
                    />
                    <i className="fas fa-lock position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="fas fa-lock me-2 text-muted"></i>
                    Confirm Password
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      className="ps-5"
                    />
                    <i className="fas fa-lock position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                  </div>
                </Form.Group>

                <Button type="submit" variant="success" className="w-100 mb-3" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Sign In
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
```