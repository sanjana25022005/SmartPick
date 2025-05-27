import React from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();

  // Calculate totals properly
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  console.log('Cart totals:', { subtotal, shipping, tax, total }); // Debug log

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>
                <i className="fas fa-shopping-cart me-2 text-primary"></i>
                Shopping Cart
              </h2>
              <span className="text-muted">({cartCount} items)</span>
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
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <i className="fas fa-minus"></i>
                            </Button>
                            <span className="mx-3 fw-bold">{item.quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <i className="fas fa-plus"></i>
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
                            aria-label={`Remove ${item.name} from cart`}
                            title="Remove from cart"
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

          {/* Cart Summary */}
          <Col lg={4}>
            <Card className="cart-summary sticky-top" style={{ top: '140px' }}>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="summary-row">
                  <span>Subtotal ({cartCount} items):</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? 'text-success fw-bold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (GST 18%):</span>
                  <span>₹{Math.round(tax).toLocaleString()}</span>
                </div>
                
                <hr />
                
                <div className="summary-row total-row">
                  <strong>Total:</strong>
                  <strong className="text-primary fs-5">₹{Math.round(total).toLocaleString()}</strong>
                </div>

                {subtotal < 500 && (
                  <Alert variant="info" className="mt-3 small">
                    <i className="fas fa-truck me-2"></i>
                    Add ₹{Math.round(500 - subtotal).toLocaleString()} more for free shipping!
                  </Alert>
                )}
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 mt-3"
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Proceed to Checkout
                  <i className="fas fa-arrow-right ms-2"></i>
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  className="w-100 mt-2"
                  onClick={() => navigate('/products')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
