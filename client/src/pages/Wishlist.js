import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    addToCart, 
    isInCart 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <Container className="py-5">
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h2>Your wishlist is empty</h2>
            <p className="text-muted">
              Save items you love by clicking the heart icon on products.
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
    <div className="wishlist-page">
      <Container className="py-4">
        <Row>
          <Col>
            <div className="page-header">
              <h1>My Wishlist</h1>
              <p className="text-muted">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {wishlistItems.map((product) => (
            <Col lg={3} md={4} sm={6} key={product.id} className="mb-4">
              <Card className="wishlist-item-card card-hover-effect">
                <div className="product-image-container">
                  <Card.Img 
                    variant="top" 
                    src={product.image || product.images?.[0]} 
                    alt={product.name}
                    className="product-image"
                  />
                  {product.discount > 0 && (
                    <Badge bg="danger" className="discount-badge">
                      {product.discount}% OFF
                    </Badge>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromWishlist(product.id)}
                    className="remove-wishlist-btn"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                
                <Card.Body>
                  <div className="product-brand">{product.brand}</div>
                  <Card.Title className="product-title">
                    <Link to={`/product/${product.id}`}>
                      {product.name}
                    </Link>
                  </Card.Title>
                  
                  {product.rating && (
                    <div className="product-rating">
                      <span className="rating-stars">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </span>
                      <span className="rating-text">
                        {product.rating} ({product.reviews || 0} reviews)
                      </span>
                    </div>
                  )}
                  
                  <div className="product-price">
                    <span className="current-price">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="original-price">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                      className="w-100 add-to-cart-btn"
                    >
                      {isInCart(product.id) ? (
                        <>
                          <i className="fas fa-check me-1"></i>
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shopping-cart me-1"></i>
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <Button as={Link} to="/" variant="outline-primary" size="lg">
              Continue Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Wishlist;
