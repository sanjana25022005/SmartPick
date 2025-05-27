import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const CustomNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount = 0 } = useCart() || { cartCount: 0 };
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Navbar bg="white" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="brand">
          <div className="brand-content">
            <i className="fas fa-graduation-cap brand-icon"></i>
            <span className="brand-text">SmartPick</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main Navigation */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
            )}
            {user?.isAdmin && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/products">Products</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orders">Orders</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">Users</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* Right Side Navigation */}
          <Nav className="ms-auto align-items-center">
            {/* Search Bar */}
            <Form className="d-flex search-form me-3">
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <Button variant="outline-primary" className="search-btn" onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </Button>
            </Form>

            {/* Wishlist Icon */}
            <Nav.Link as={Link} to="/wishlist" className="nav-link icon-link">
              <div className="icon-wrapper">
                <i className="fas fa-heart"></i>
                {wishlistCount > 0 && (
                  <Badge bg="danger" className="icon-badge">
                    {wishlistCount}
                  </Badge>
                )}
              </div>
            </Nav.Link>

            {/* Cart Icon */}
            <Nav.Link as={Link} to="/cart" className="nav-link icon-link">
              <div className="icon-wrapper">
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <Badge bg="primary" className="icon-badge">
                    {cartCount}
                  </Badge>
                )}
              </div>
            </Nav.Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span className="user-menu-title">
                    <i className="fas fa-user-circle me-2"></i>
                    {user?.firstName || 'User'}
                  </span>
                } 
                id="user-dropdown"
                className="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  <i className="fas fa-shopping-bag me-2"></i>
                  My Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/wishlist">
                  <i className="fas fa-heart me-2"></i>
                  Wishlist
                </NavDropdown.Item>
                {user?.isAdmin && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Admin Dashboard
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="auth-buttons">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  size="sm"
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
