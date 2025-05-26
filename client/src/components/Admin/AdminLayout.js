import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    {
      path: '/admin',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/products',
      icon: 'fas fa-box',
      label: 'Products'
    },
    {
      path: '/admin/orders',
      icon: 'fas fa-shopping-cart',
      label: 'Orders'
    },
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'Users'
    },
    {
      path: '/admin/analytics',
      icon: 'fas fa-chart-line',
      label: 'Analytics'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-brand">
            <i className="fas fa-shield-alt me-2"></i>
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-toggle"
          >
            <i className={`fas fa-${sidebarCollapsed ? 'expand' : 'compress'}-arrows-alt`}></i>
          </Button>
        </div>

        <div className="admin-user-info">
          <div className="admin-avatar">
            <i className="fas fa-user-shield"></i>
          </div>
          {!sidebarCollapsed && (
            <div className="admin-details">
              <h6>{user?.firstName} {user?.lastName}</h6>
              <small>Administrator</small>
            </div>
          )}
        </div>

        <Nav className="admin-nav flex-column">
          {navigationItems.map((item, index) => (
            <Nav.Link
              key={index}
              as={Link}
              to={item.path}
              className={`admin-nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              <i className={`${item.icon} nav-icon`}></i>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Nav.Link>
          ))}
        </Nav>

        <div className="sidebar-footer">
          <Nav.Link as={Link} to="/" className="admin-nav-link">
            <i className="fas fa-external-link-alt nav-icon"></i>
            {!sidebarCollapsed && <span className="nav-label">Visit Store</span>}
          </Nav.Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Container fluid>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
