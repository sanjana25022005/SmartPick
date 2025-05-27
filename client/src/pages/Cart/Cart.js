import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems = [], cartTotal, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price || 0);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <Container className="py-5" style={{ marginTop: '120px' }}>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card className="empty-cart-card">
              <Card.Body className="p-5">
                <div className="empty-cart-icon mb-3">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button as={Link} to="/products" variant="primary" size="lg">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '120px' }}>
      <Row>
        <Col lg={8}>
          <Card className="cart-items-card">
            <Card.Header>
              <h4 className="mb-0">
                <i className="fas fa-shopping-cart me-2"></i>
                Shopping Cart ({cartItems.length} items)
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="product-info">
                          <img 
                            src={item.images?.[0] || item.image || 'https://via.placeholder.com/80x80'} 
                            alt={item.name}
                            className="product-image"
                          />
                          <div className="product-details">
                            <h6 className="product-name">{item.name}</h6>
                            <p className="product-brand">{item.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{formatPrice(item.price)}</strong>
                      </td>
                      <td>
                        <div className="quantity-controls">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <i className="fas fa-minus"></i>
                          </Button>
                          <span className="quantity-display">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </Button>
                        </div>
                      </td>
                      <td>
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="order-summary-card">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {cartTotal > 500 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatPrice(50)
                  )}
                </span>
              </div>
              <hr />
              <div className="summary-row total">
                <strong>Total: {formatPrice(cartTotal + (cartTotal > 500 ? 0 : 50))}</strong>
              </div>
              
              {cartTotal < 500 && (
                <Alert variant="info" className="mt-3">
                  <i className="fas fa-truck me-2"></i>
                  Add {formatPrice(500 - cartTotal)} more for FREE shipping!
                </Alert>
              )}

              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mt-3"
                onClick={handleCheckout}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Button>

              <Button 
                as={Link}
                to="/products"
                variant="outline-primary" 
                className="w-100 mt-2"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
