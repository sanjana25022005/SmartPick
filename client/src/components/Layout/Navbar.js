import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const CustomNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount, wishlistItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="top-links">
              <Link to="/deals" className="top-link">
                <i className="fas fa-fire me-1"></i>Today's Deals
              </Link>
              <Link to="/best-sellers" className="top-link">
                <i className="fas fa-star me-1"></i>Best Sellers
              </Link>
              <Link to="/new-arrivals" className="top-link">
                <i className="fas fa-sparkles me-1"></i>New Arrivals
              </Link>
            </div>
            <div className="top-info">
              <span className="free-shipping">
                <i className="fas fa-truck me-1"></i>Free Shipping on orders over ₹500
              </span>
            </div>
            <div className="top-actions">
              <Button
                variant="link"
                size="sm"
                onClick={toggleTheme}
                className="theme-toggle-top"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar 
        expand="lg" 
        className="custom-navbar glass-effect" 
        fixed="top"
        variant={theme}
      >
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <span className="logo-icon">📝</span>
            <span className="logo-text text-gradient">SmartPick</span>
          </Navbar.Brand>

          {/* Main Navigation */}
          <Nav className="me-auto d-none d-lg-flex">
            {/* Categories Dropdown */}
            <NavDropdown title="Categories" className="main-nav-dropdown">
              <div className="mega-menu">
                <div className="mega-menu-section">
                  <h6>Writing</h6>
                  <NavDropdown.Item as={Link} to="/categories/pens">
                    <i className="fas fa-pen me-2"></i>Pens & Writing
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/categories/markers">
                    <i className="fas fa-marker me-2"></i>Markers & Highlighters
                  </NavDropdown.Item>
                </div>
                <div className="mega-menu-section">
                  <h6>Paper Products</h6>
                  <NavDropdown.Item as={Link} to="/categories/notebooks">
                    <i className="fas fa-book me-2"></i>Notebooks & Journals
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/categories/sticky-notes">
                    <i className="fas fa-sticky-note me-2"></i>Sticky Notes
                  </NavDropdown.Item>
                </div>
                <div className="mega-menu-section">
                  <h6>Organization</h6>
                  <NavDropdown.Item as={Link} to="/categories/organizers">
                    <i className="fas fa-folder me-2"></i>Desk Organizers
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/categories/planners">
                    <i className="fas fa-calendar me-2"></i>Planners & Calendars
                  </NavDropdown.Item>
                </div>
                <div className="mega-menu-section">
                  <h6>Art & Craft</h6>
                  <NavDropdown.Item as={Link} to="/categories/art">
                    <i className="fas fa-palette me-2"></i>Art Supplies
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/categories/craft">
                    <i className="fas fa-cut me-2"></i>Craft Materials
                  </NavDropdown.Item>
                </div>
              </div>
            </NavDropdown>

            {/* Brands Dropdown */}
            <NavDropdown title="Brands" className="main-nav-dropdown">
              <NavDropdown.Item as={Link} to="/brands/pilot">
                <i className="fas fa-award me-2"></i>Pilot
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brands/parker">
                <i className="fas fa-crown me-2"></i>Parker
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brands/classmate">
                <i className="fas fa-graduation-cap me-2"></i>Classmate
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brands/reynolds">
                <i className="fas fa-pen-fancy me-2"></i>Reynolds
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/brands">
                <i className="fas fa-list me-2"></i>View All Brands
              </NavDropdown.Item>
            </NavDropdown>

            {/* Special Offers */}
            <Nav.Link as={Link} to="/deals" className="special-nav-link">
              <i className="fas fa-percent me-1"></i>Deals
            </Nav.Link>

            {/* More Dropdown */}
            <NavDropdown title="More" className="main-nav-dropdown">
              <NavDropdown.Item as={Link} to="/about">
                <i className="fas fa-info-circle me-2"></i>About Us
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/contact">
                <i className="fas fa-envelope me-2"></i>Contact Us
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/blog">
                <i className="fas fa-blog me-2"></i>Blog
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/help">
                <i className="fas fa-question-circle me-2"></i>Help & Support
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Search Bar */}
          <form className="search-form mx-auto" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for pens, notebooks, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Right Side Navigation */}
            <Nav className="ms-auto align-items-center">
              {/* Wishlist */}
              <Nav.Link as={Link} to="/wishlist" className="nav-icon-link">
                <div className="nav-item-content">
                  <div className="icon-container">
                    <i className="fas fa-heart"></i>
                    {wishlistItems.length > 0 && (
                      <Badge bg="danger" className="icon-badge">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </div>
                  <div className="nav-text d-none d-xl-block">
                    <small>Returns</small>
                    <span>& Orders</span>
                  </div>
                </div>
              </Nav.Link>

              {/* Cart */}
              <Nav.Link as={Link} to="/cart" className="nav-icon-link cart-link">
                <div className="nav-item-content">
                  <div className="icon-container">
                    <i className="fas fa-shopping-cart"></i>
                    {getCartItemsCount() > 0 && (
                      <Badge bg="warning" className="icon-badge">
                        {getCartItemsCount()}
                      </Badge>
                    )}
                  </div>
                  <div className="nav-text d-none d-xl-block">
                    <small>Cart</small>
                    <span>₹{getCartItemsCount() > 0 ? '999' : '0'}</span>
                  </div>
                </div>
              </Nav.Link>

              {/* User Account */}
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    className="user-dropdown"
                    id="user-dropdown"
                  >
                    <div className="nav-item-content">
                      <div className="user-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="nav-text d-none d-xl-block">
                        <small>Hello, {user?.firstName}</small>
                        <span>Account & Lists</span>
                      </div>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <div className="dropdown-header-custom">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <strong>{user?.firstName} {user?.lastName}</strong>
                          <br />
                          <small className="text-muted">{user?.email}</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-section">
                      <h6 className="dropdown-section-title">Your Account</h6>
                      <Dropdown.Item as={Link} to="/profile">
                        <i className="fas fa-user-cog me-2"></i>
                        Manage Your Account
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/orders">
                        <i className="fas fa-box me-2"></i>
                        Your Orders
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/wishlist">
                        <i className="fas fa-heart me-2"></i>
                        Your Wishlist
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/addresses">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Your Addresses
                      </Dropdown.Item>
                    </div>

                    <div className="dropdown-section">
                      <h6 className="dropdown-section-title">Your Lists</h6>
                      <Dropdown.Item as={Link} to="/lists/create">
                        <i className="fas fa-plus me-2"></i>
                        Create a List
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/lists">
                        <i className="fas fa-list me-2"></i>
                        Find a List
                      </Dropdown.Item>
                    </div>

                    {user?.isAdmin && (
                      <div className="dropdown-section">
                        <h6 className="dropdown-section-title">Admin</h6>
                        <Dropdown.Item as={Link} to="/admin">
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/products">
                          <i className="fas fa-box me-2"></i>
                          Products
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/orders">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Orders
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/users">
                          <i className="fas fa-users me-2"></i>
                          Users
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/analytics">
                          <i className="fas fa-chart-line me-2"></i>
                          Analytics
                        </Dropdown.Item>
                      </div>
                    )}
                    
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="auth-section">
                  <div className="nav-item-content">
                    <div className="auth-buttons">
                      <Button 
                        as={Link} 
                        to="/login" 
                        variant="outline-light" 
                        size="sm" 
                        className="me-2"
                      >
                        Sign In
                      </Button>
                    </div>
                    <div className="nav-text d-none d-xl-block">
                      <small>Hello, Sign in</small>
                      <span>Account & Lists</span>
                    </div>
                  </div>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Categories Bar */}
      <div className="mobile-categories-bar d-lg-none">
        <Container>
          <div className="categories-scroll">
            <Link to="/categories/pens" className="category-chip">
              <i className="fas fa-pen me-1"></i>Pens
            </Link>
            <Link to="/categories/notebooks" className="category-chip">
              <i className="fas fa-book me-1"></i>Notebooks
            </Link>
            <Link to="/categories/organizers" className="category-chip">
              <i className="fas fa-folder me-1"></i>Organizers
            </Link>
            <Link to="/categories/art" className="category-chip">
              <i className="fas fa-palette me-1"></i>Art
            </Link>
            <Link to="/deals" className="category-chip deals-chip">
              <i className="fas fa-fire me-1"></i>Deals
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
};

export default CustomNavbar;
