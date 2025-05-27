import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useTheme } from '../../contexts/ThemeContext';
import VoiceSearch from '../Common/VoiceSearch';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { darkMode, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setExpanded(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar 
      bg={darkMode ? "dark" : "light"} 
      variant={darkMode ? "dark" : "light"} 
      expand="lg" 
      fixed="top" 
      className="shadow-sm navbar-custom"
      role="navigation"
      aria-label="Main navigation"
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold brand-logo"
          aria-label="SmartPick - Go to homepage"
        >
          <i className="fas fa-graduation-cap me-2" aria-hidden="true"></i>
          SmartPick
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation menu"
        />
        
        <Navbar.Collapse id="basic-navbar-nav" in={expanded}>
          <Nav className="me-auto" role="menubar">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={() => setExpanded(false)}
              role="menuitem"
              aria-label="Go to homepage"
            >
              <i className="fas fa-home me-2"></i>
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/products" 
              onClick={() => setExpanded(false)}
              role="menuitem"
              aria-label="Browse all products"
            >
              <i className="fas fa-boxes me-2"></i>
              Products
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/blog" 
              onClick={() => setExpanded(false)}
              role="menuitem"
              aria-label="Read our blog articles"
            >
              <i className="fas fa-blog me-2"></i>
              Blog
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to="/orders" 
                onClick={() => setExpanded(false)}
                role="menuitem"
                aria-label="View your order history"
              >
                <i className="fas fa-clipboard-list me-2"></i>
                My Orders
              </Nav.Link>
            )}
            {user?.isAdmin && (
              <NavDropdown 
                title={
                  <span>
                    <i className="fas fa-crown me-1"></i>
                    Admin
                  </span>
                } 
                id="admin-nav-dropdown"
                role="menu"
                aria-label="Admin menu"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to="/admin/dashboard"
                  role="menuitem"
                  aria-label="Go to admin dashboard"
                >
                  <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item 
                  as={Link} 
                  to="/admin/products"
                  role="menuitem"
                  aria-label="Manage products"
                >
                  <i className="fas fa-box me-2"></i>Products
                </NavDropdown.Item>
                <NavDropdown.Item 
                  as={Link} 
                  to="/admin/orders"
                  role="menuitem"
                  aria-label="Manage orders"
                >
                  <i className="fas fa-shopping-bag me-2"></i>Orders
                </NavDropdown.Item>
                <NavDropdown.Item 
                  as={Link} 
                  to="/admin/users"
                  role="menuitem"
                  aria-label="Manage users"
                >
                  <i className="fas fa-users me-2"></i>Users
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* Voice Search */}
          <div className="me-3 d-none d-md-block" style={{ width: '300px' }}>
            <VoiceSearch />
          </div>

          <Nav className="align-items-center" role="toolbar" aria-label="User actions">
            {/* Theme Toggle */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={toggleTheme}
              className="me-2 theme-toggle-btn"
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              aria-pressed={darkMode}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true"></i>
            </Button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to="/wishlist" 
                className="position-relative me-3 wishlist-link"
                aria-label={`Wishlist with ${wishlistCount} items`}
                role="button"
                title="My Wishlist"
              >
                <i className="fas fa-heart fs-5" aria-hidden="true"></i>
                {wishlistCount > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle wishlist-badge"
                    aria-label={`${wishlistCount} items in wishlist`}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {/* Cart */}
            <Nav.Link 
              as={Link} 
              to="/cart" 
              className="position-relative me-3 cart-link"
              aria-label={`Shopping cart with ${cartCount} items`}
              role="button"
              title="Shopping Cart"
            >
              <i className="fas fa-shopping-cart fs-5" aria-hidden="true"></i>
              {cartCount > 0 && (
                <Badge 
                  bg="primary" 
                  pill 
                  className="position-absolute top-0 start-100 translate-middle cart-badge"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="fas fa-user-circle me-1" aria-hidden="true"></i>
                    {user?.firstName || 'User'}
                  </span>
                } 
                id="user-nav-dropdown"
                align="end"
                role="menu"
                aria-label="User account menu"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to="/profile"
                  role="menuitem"
                  aria-label="View and edit your profile"
                >
                  <i className="fas fa-user me-2" aria-hidden="true"></i>Profile
                </NavDropdown.Item>
                <NavDropdown.Item 
                  as={Link} 
                  to="/orders"
                  role="menuitem"
                  aria-label="View your order history"
                >
                  <i className="fas fa-box me-2" aria-hidden="true"></i>My Orders
                </NavDropdown.Item>
                <NavDropdown.Item 
                  as={Link} 
                  to="/wishlist"
                  role="menuitem"
                  aria-label="View your wishlist"
                >
                  <i className="fas fa-heart me-2" aria-hidden="true"></i>Wishlist
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item 
                  onClick={handleLogout}
                  role="menuitem"
                  aria-label="Sign out of your account"
                >
                  <i className="fas fa-sign-out-alt me-2" aria-hidden="true"></i>Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  size="sm"
                  aria-label="Sign in to your account"
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  size="sm"
                  aria-label="Create a new account"
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
