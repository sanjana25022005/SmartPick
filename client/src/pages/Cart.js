import React from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemsCount,
    clearCart 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Container className="py-5">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Your cart is empty</h2>
            <p className="text-muted">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button as={Link} to="/" variant="primary" size="lg">
              Start Shopping
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Container className="py-4">
        <Row>
          <Col>
            <div className="page-header">
              <h1>Shopping Cart</h1>
              <p className="text-muted">
                {getCartItemsCount()} item{getCartItemsCount() !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="cart-items-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items</h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const originalPrice = item.originalPrice;
                  const hasDiscount = originalPrice && originalPrice > item.price;

                  return (
                    <div key={item.id} className="cart-item">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <div className="item-image">
                            <img
                              src={item.image || item.images?.[0]}
                              alt={item.name}
                              className="img-fluid"
                            />
                          </div>
                        </Col>
                        
                        <Col md={4}>
                          <div className="item-details">
                            <h6 className="item-name">
                              <Link to={`/product/${item.id}`}>
                                {item.name}
                              </Link>
                            </h6>
                            <div className="item-brand">{item.brand}</div>
                            {hasDiscount && (
                              <Badge bg="success" className="discount-badge">
                                {item.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </Col>
                        
                        <Col md={2}>
                          <div className="item-price">
                            <div className="current-price">
                              {formatPrice(item.price)}
                            </div>
                            {hasDiscount && (
                              <div className="original-price">
                                {formatPrice(originalPrice)}
                              </div>
                            )}
                          </div>
                        </Col>
                        
                        <Col md={2}>
                          <div className="quantity-controls">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="quantity-input"
                              min="1"
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        
                        <Col md={1}>
                          <div className="item-total">
                            {formatPrice(itemTotal)}
                          </div>
                        </Col>
                        
                        <Col md={1}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="order-summary-card sticky-top">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="summary-item">
                  <span>Subtotal ({getCartItemsCount()} items)</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="summary-item">
                  <span>Tax</span>
                  <span>{formatPrice(getCartTotal() * 0.18)}</span>
                </div>
                <hr />
                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal() + (getCartTotal() * 0.18))}</span>
                </div>
                
                <div className="checkout-actions">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                    as={Link}
                    to="/checkout"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="w-100"
                    as={Link}
                    to="/"
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="security-info">
                  <div className="security-item">
                    <i className="fas fa-shield-alt text-success"></i>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="security-item">
                    <i className="fas fa-truck text-primary"></i>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="security-item">
                    <i className="fas fa-undo text-warning"></i>
                    <span>Easy Returns</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
