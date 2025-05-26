import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row className="footer-content">
          {/* Brand Section */}
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand">
              <h5 className="brand-name">
                <span className="logo-icon">📝</span>
                SmartPick
              </h5>
              <p className="brand-description">
                Your essential stationery hub for all your productivity needs. 
                Quality products, amazing prices, and exceptional service.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/deals">Special Deals</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
          </Col>

          {/* Customer Service */}
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-title">Customer Service</h6>
              <ul className="footer-links">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
          </Col>

          {/* Account */}
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-title">My Account</h6>
              <ul className="footer-links">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/orders">Order History</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/addresses">Addresses</Link></li>
                <li><Link to="/rewards">Rewards</Link></li>
              </ul>
            </div>
          </Col>

          {/* Newsletter */}
          <Col lg={2} md={12} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-title">Stay Updated</h6>
              <p className="newsletter-text">
                Get the latest deals and product updates
              </p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright">
                © 2024 SmartPick. All rights reserved.
              </p>
            </Col>
            <Col md={6}>
              <div className="footer-bottom-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/cookies">Cookie Policy</Link>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
