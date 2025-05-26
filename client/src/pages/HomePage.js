import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();

  // Mock data for development
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Premium Gel Pen Set",
          price: 299,
          originalPrice: 399,
          discount: 25,
          brand: "Pilot",
          type: "Pens",
          rating: 4.5,
          reviews: 128,
          image: "https://via.placeholder.com/300x300?text=Gel+Pen+Set",
          images: ["https://via.placeholder.com/300x300?text=Gel+Pen+Set"],
          description: "Smooth writing gel pens with vibrant colors",
          featured: true,
          stock: 50
        },
        {
          id: 2,
          name: "A4 Ruled Notebooks Pack",
          price: 450,
          originalPrice: 500,
          discount: 10,
          brand: "Classmate",
          type: "Notebooks",
          rating: 4.2,
          reviews: 89,
          image: "https://via.placeholder.com/300x300?text=Notebooks",
          images: ["https://via.placeholder.com/300x300?text=Notebooks"],
          description: "High-quality ruled notebooks for students",
          featured: true,
          stock: 30
        },
        {
          id: 3,
          name: "Desk Organizer Pro",
          price: 899,
          originalPrice: 1299,
          discount: 31,
          brand: "OfficeMax",
          type: "Organizers",
          rating: 4.7,
          reviews: 156,
          image: "https://via.placeholder.com/300x300?text=Desk+Organizer",
          images: ["https://via.placeholder.com/300x300?text=Desk+Organizer"],
          description: "Multi-compartment desk organizer",
          featured: false,
          stock: 15
        },
        {
          id: 4,
          name: "Highlighter Set - 6 Colors",
          price: 199,
          originalPrice: 250,
          discount: 20,
          brand: "Stabilo",
          type: "Highlighters",
          rating: 4.3,
          reviews: 67,
          image: "https://via.placeholder.com/300x300?text=Highlighters",
          images: ["https://via.placeholder.com/300x300?text=Highlighters"],
          description: "Bright highlighters for marking important text",
          featured: false,
          stock: 80
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter products based on filters
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesType = !filters.type || product.type === filters.type;
      const matchesMinPrice = !filters.minPrice || product.price >= parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || product.price <= parseInt(filters.maxPrice);
      const matchesRating = !filters.rating || product.rating >= parseFloat(filters.rating);

      return matchesSearch && matchesBrand && matchesType && matchesMinPrice && matchesMaxPrice && matchesRating;
    });

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // You can add toast notification here
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    // You can add toast notification here
  };

  const getUniqueValues = (key) => {
    return [...new Set(products.map(product => product[key]))];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Container>
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <h4 className="mt-3">Loading amazing products...</h4>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <div className="hero-content fade-in">
                <h1 className="hero-title">
                  Your Essential <span className="text-gradient">Stationery Hub</span>
                </h1>
                <p className="hero-subtitle">
                  Discover premium quality stationery products for all your productivity needs. 
                  From pens to planners, we've got everything to boost your creativity.
                </p>
                <div className="hero-buttons">
                  <Button size="lg" className="btn-primary-custom me-3">
                    Shop Now
                  </Button>
                  <Button variant="outline-primary" size="lg">
                    View Categories
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image slide-up">
                <img 
                  src="https://via.placeholder.com/600x400?text=Stationery+Collection" 
                  alt="Stationery Collection"
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <Container>
          <Card className="filter-card">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Search Products</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Brand</Form.Label>
                    <Form.Select
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="form-control-custom"
                    >
                      <option value="">All Brands</option>
                      {getUniqueValues('brand').map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="form-control-custom"
                    >
                      <option value="">All Types</option>
                      {getUniqueValues('type').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="₹0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="₹5000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="form-control-custom"
                    >
                      <option value="">All</option>
                      <option value="4">4+ ⭐</option>
                      <option value="3">3+ ⭐</option>
                      <option value="2">2+ ⭐</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <Container>
          <Row>
            <Col>
              <div className="section-header">
                <h2>Featured Products</h2>
                <p className="text-muted">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            {filteredProducts.map(product => (
              <Col lg={3} md={4} sm={6} key={product.id} className="mb-4">
                <Card className="product-card card-hover-effect">
                  <div className="product-image-container">
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                    {product.discount > 0 && (
                      <Badge bg="danger" className="discount-badge">
                        {product.discount}% OFF
                      </Badge>
                    )}
                    <div className="product-overlay">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => handleAddToWishlist(product)}
                        className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      >
                        <i className="fas fa-heart"></i>
                      </Button>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="product-brand">{product.brand}</div>
                    <Card.Title className="product-title">
                      <Link to={`/product/${product.id}`}>
                        {product.name}
                      </Link>
                    </Card.Title>
                    <div className="product-rating">
                      <span className="rating-stars">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </span>
                      <span className="rating-text">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="product-actions">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart(product.id)}
                        className="add-to-cart-btn"
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
          
          {filteredProducts.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your filters to see more products.</p>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
