import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { isAuthenticated, user, loading, requireAdmin });

  if (loading) {
    return (
      <Container className="py-5" style={{ marginTop: '120px' }}>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card className="p-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <h4>Verifying access...</h4>
              <p className="text-muted">Please wait while we check your permissions</p>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    console.log('User is not admin, access denied');
    return (
      <Container className="py-5" style={{ marginTop: '120px' }}>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card className="p-5">
              <i className="fas fa-shield-alt text-danger mb-3" style={{ fontSize: '3rem' }}></i>
              <h3>Access Denied</h3>
              <p className="text-muted">You don't have permission to access this page.</p>
              <p>Only administrators can access this area.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  console.log('Access granted, rendering protected content');
  return children;
};

export default ProtectedRoute;
