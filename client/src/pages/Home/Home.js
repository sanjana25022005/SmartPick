import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Fixed products data
  const products = [
    {
      id: 1,
      name: 'Premium Gel Pen Set',
      brand: 'Pilot',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=400&h=400&fit=crop',
      rating: { average: 4.5, count: 128 }
    },
    {
      id: 2,
      name: 'A4 Ruled Notebooks Pack', 
      brand: 'Classmate',
      price: 450,
      originalPrice: 500,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      rating: { average: 4.3, count: 95 }
    },
    {
      id: 3,
      name: 'Desk Organizer Pro',
      brand: 'OfficeMax', 
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=400&h=400&fit=crop',
      rating: { average: 4.7, count: 67 }
    },
    {
      id: 4,
      name: 'Art Supplies Kit',
      brand: 'Faber-Castell',
      price: 1200, 
      originalPrice: 1500,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      rating: { average: 4.8, count: 234 }
    }
  ];

  // Define categories array properly
  const categories = [
    { id: 1, name: 'Pens & Writing', icon: 'fas fa-pen', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=300&h=200&fit=crop', link: '/products?category=pens' },
    { id: 2, name: 'Notebooks', icon: 'fas fa-book', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop', link: '/products?category=notebooks' },
    { id: 3, name: 'Organizers', icon: 'fas fa-th-large', image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=300&h=200&fit=crop', link: '/products?category=organizers' },
    { id: 4, name: 'Art & Craft', icon: 'fas fa-paint-brush', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop', link: '/products?category=art' }
  ];

  // Define features array properly
  const features = [
    { icon: 'fas fa-shipping-fast', title: 'Fast Delivery', desc: 'Quick and reliable delivery to your doorstep' },
    { icon: 'fas fa-shield-alt', title: 'Quality Assured', desc: 'Premium quality products guaranteed' },
    { icon: 'fas fa-headset', title: '24/7 Support', desc: 'Round the clock customer support' },
    { icon: 'fas fa-undo', title: 'Easy Returns', desc: 'Hassle-free return and exchange policy' }
  ];

  // Render individual product
  const ProductCard = ({ product }) => (
    <Card className="product-card h-100">
      <div className="product-image-container">
        <Card.Img 
          variant="top" 
          src={product.image} 
          alt={`${product.name} by ${product.brand} - Premium stationery product`}
          className="product-image"
          onClick={() => navigate(`/products/${product.id}`)}
          style={{ cursor: 'pointer' }}
        />
        <div className="product-overlay">
          <Button
            variant="light"
            size="sm"
            className="wishlist-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Wishlist button clicked for:', product); // Debug log
              toggleWishlist(product);
              // Show immediate visual feedback
              const btn = e.currentTarget;
              const icon = btn.querySelector('i');
              if (isInWishlist(product.id)) {
                icon.style.color = '#dc3545';
                btn.title = 'Remove from wishlist';
              } else {
                icon.style.color = '';
                btn.title = 'Add to wishlist';
              }
            }}
            aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isInWishlist(product.id)}
            title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i className={`fas fa-heart ${isInWishlist(product.id) ? 'text-danger' : ''}`}></i>
          </Button>
          <Button
            variant="light"
            size="sm"
            className="quick-view-btn"
            onClick={() => navigate(`/products/${product.id}`)}
            aria-label={`Quick view for ${product.name}`}
            title="Quick view"
          >
            <i className="fas fa-eye"></i>
          </Button>
        </div>
        {product.originalPrice > product.price && (
          <Badge bg="danger" className="discount-badge">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="product-info">
          <h6 className="product-title">{product.name}</h6>
          <p className="product-brand">{product.brand}</p>
          
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(product.rating.average) ? 'text-warning' : 'text-muted'}`}
              ></i>
            ))}
            <span className="rating-count ms-1">({product.rating.count})</span>
          </div>
          
          <div className="product-price">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="original-price ms-2">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="add-to-cart-btn mt-auto"
          onClick={() => {
            addToCart(product);
            // Optional: Show a quick feedback
            const btn = document.activeElement;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
            btn.disabled = true;
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
            }, 1500);
          }}
        >
          <i className="fas fa-shopping-cart me-2"></i>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" role="banner" aria-labelledby="hero-title">
        <Carousel fade className="hero-carousel" aria-label="Featured promotions">
          <Carousel.Item>
            <div className="hero-slide hero-slide-1">
              <Container>
                <Row className="align-items-center min-vh-100">
                  <Col lg={6}>
                    <div className="hero-content">
                      <h1 className="hero-title" id="hero-title">
                        Smart Stationery for 
                        <span className="highlight"> Smart Students</span>
                      </h1>
                      <p className="hero-subtitle">
                        Discover premium quality stationery items that enhance your productivity and creativity.
                      </p>
                      <div className="hero-buttons">
                        <Button 
                          as={Link} 
                          to="/products" 
                          variant="primary" 
                          size="lg" 
                          className="hero-btn-primary button-bounce"
                          aria-label="Shop all products"
                        >
                          <i className="fas fa-shopping-bag me-2" aria-hidden="true"></i>
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5" role="region" aria-labelledby="categories-title">
        <Container>
          <Row>
            <Col>
              <div className="section-header text-center mb-5">
                <h2 className="section-title" id="categories-title">Shop by Category</h2>
                <p className="section-subtitle">Find exactly what you're looking for</p>
              </div>
            </Col>
          </Row>
          
          <Row role="list" aria-label="Product categories">
            {categories.map((cat) => (
              <Col key={cat.id} lg={3} md={6} className="mb-4" role="listitem">
                <Card 
                  as={Link} 
                  to={cat.link} 
                  className="category-card h-100 text-decoration-none hover-lift"
                  role="link"
                  aria-label={`Browse ${cat.name} products`}
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(cat.link);
                    }
                  }}
                >
                  <div className="category-image-container">
                    <Card.Img 
                      variant="top" 
                      src={cat.image} 
                      alt={`${cat.name} category featuring quality stationery products`}
                      className="category-image" 
                    />
                    <div className="category-overlay" aria-hidden="true">
                      <i className={cat.icon}></i>
                    </div>
                  </div>
                  <Card.Body className="text-center">
                    <h5 className="category-name">{cat.name}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section py-5 bg-light" role="region" aria-labelledby="featured-title">
        <Container>
          <Row>
            <Col>
              <div className="section-header text-center mb-5">
                <h2 className="section-title" id="featured-title">Featured Products</h2>
                <p className="section-subtitle">Discover our top-rated stationery items</p>
              </div>
            </Col>
          </Row>
          
          <Row>
            {products.map(product => (
              <Col key={product.id} lg={3} md={6} sm={6} xs={12} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          
          <Row>
            <Col className="text-center mt-4">
              <Button 
                as={Link} 
                to="/products" 
                variant="outline-primary" 
                size="lg" 
                className="hover-scale"
                aria-label="View all available products"
              >
                View All Products
                <i className="fas fa-arrow-right ms-2" aria-hidden="true"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5" role="region" aria-labelledby="features-title">
        <Container>
          <h2 className="visually-hidden" id="features-title">Our Service Features</h2>
          <Row role="list" aria-label="Service features">
            {features.map((feature, index) => (
              <Col key={index} lg={3} md={6} className="mb-4" role="listitem">
                <div className="feature-card text-center neu-card" role="article">
                  <div className="feature-icon" aria-hidden="true">
                    <i className={feature.icon}></i>
                  </div>
                  <h5>{feature.title}</h5>
                  <p>{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;