import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  console.log('Wishlist page - current items:', wishlistItems); // Debug log

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    alert(`${product.name} moved to cart!`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const WishlistCard = ({ product }) => (
    <Card className="h-100 wishlist-card hover-lift">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.image}
          alt={`${product.name} by ${product.brand}`}
          style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => navigate(`/products/${product.id}`)}
        />
        <Button
          variant="danger"
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle"
          onClick={() => removeFromWishlist(product.id)}
          style={{ width: '35px', height: '35px' }}
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <h6 className="card-title">{product.name}</h6>
          <p className="text-muted small">{product.brand}</p>
          
          <div className="mb-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${i < Math.floor(product.rating?.average || 0) ? 'text-warning' : 'text-muted'}`}
                style={{ fontSize: '0.8rem' }}
              ></i>
            ))}
            <span className="text-muted small ms-2">({product.rating?.count || 0})</span>
          </div>
          
          <div className="mb-3">
            <span className="h5 text-primary">{formatCurrency(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            onClick={() => moveToCart(product)}
            aria-label={`Move ${product.name} to cart`}
          >
            <i className="fas fa-shopping-cart me-2"></i>
            Move to Cart
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate(`/products/${product.id}`)}
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>My Wishlist</h2>
              <span className="text-muted">({wishlistItems.length} items)</span>
            </div>

            {wishlistItems.length === 0 ? (
              <Card className="text-center py-5">
                <Card.Body>
                  <i className="fas fa-heart fa-4x text-muted mb-4"></i>
                  <h4>Your wishlist is empty</h4>
                  <p className="text-muted mb-4">
                    Save items you love to your wishlist and shop them later.
                  </p>
                  <Button as={Link} to="/products" variant="primary" size="lg">
                    <i className="fas fa-shopping-bag me-2"></i>
                    Continue Shopping
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                <Row>
                  {wishlistItems.map(product => (
                    <Col key={product.id} lg={3} md={6} sm={6} xs={12} className="mb-4">
                      <WishlistCard product={product} />
                    </Col>
                  ))}
                </Row>
                
                <Row className="mt-4">
                  <Col className="text-center">
                    <Button
                      variant="success"
                      size="lg"
                      className="me-3"
                      onClick={() => {
                        wishlistItems.forEach(product => addToCart(product));
                        clearWishlist();
                        alert('All items moved to cart!');
                        navigate('/cart');
                      }}
                      disabled={wishlistItems.length === 0}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Move All to Cart
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="lg"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your wishlist?')) {
                          clearWishlist();
                        }
                      }}
                      disabled={wishlistItems.length === 0}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Clear Wishlist
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Wishlist;
