import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Local wishlist state - NO CONTEXT DEPENDENCIES
  const [wishlist, setWishlist] = useState([]);
  
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

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smartpick_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        setWishlist([]);
      }
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('smartpick_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Wishlist functions with DIFFERENT NAMES
  const checkWishlist = (id) => wishlist.some(item => item.id === id);
  
  const toggleWishlist = (product) => {
    if (checkWishlist(product.id)) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWishlist(prev => [...prev, product]);
    }
  };

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
    <Card className="product-card h-100 hover-lift" role="article" aria-labelledby={`product-title-${product.id}`}>
      <div className="product-image-container">
        <Card.Img 
          variant="top" 
          src={product.image} 
          alt={`${product.name} by ${product.brand} - Premium stationery product`}
          className="product-image"
          onClick={() => navigate(`/products/${product.id}`)}
          style={{ cursor: 'pointer' }}
          tabIndex="0"
          role="button"
          aria-label={`View details for ${product.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(`/products/${product.id}`);
            }
          }}
        />
        <div className="product-overlay">
          <Button
            variant="outline-light"
            size="sm"
            className="wishlist-btn button-bounce"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={checkWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={checkWishlist(product.id)}
          >
            <i className={`fas fa-heart ${checkWishlist(product.id) ? 'text-danger' : ''}`} aria-hidden="true"></i>
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            className="quick-view-btn button-bounce"
            onClick={() => navigate(`/products/${product.id}`)}
            aria-label={`Quick view for ${product.name}`}
          >
            <i className="fas fa-eye" aria-hidden="true"></i>
          </Button>
        </div>
        {product.originalPrice > product.price && (
          <Badge bg="danger" className="discount-badge" role="text" aria-label={`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} percent discount`}>
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="product-info flex-grow-1">
          <h6 className="product-title" id={`product-title-${product.id}`}>{product.name}</h6>
          <p className="product-brand text-muted">{product.brand}</p>
          
          <div className="product-rating mb-2" role="img" aria-label={`Rating: ${product.rating.average} out of 5 stars, based on ${product.rating.count} reviews`}>
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(product.rating.average) ? 'text-warning' : 'text-muted'}`}
                aria-hidden="true"
              ></i>
            ))}
            <span className="rating-count ms-2" aria-label={`${product.rating.count} customer reviews`}>
              ({product.rating.count})
            </span>
          </div>
          
          <div className="product-price">
            <span className="current-price" aria-label={`Current price: ${product.price} rupees`}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price ms-2" aria-label={`Original price: ${product.originalPrice} rupees`}>₹{product.originalPrice}</span>
            )}
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="add-to-cart-btn w-100 mt-3 button-bounce"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to shopping cart`}
        >
          <i className="fas fa-shopping-cart me-2" aria-hidden="true"></i>
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