import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Breadcrumb, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Categories.css';

const Categories = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();

  const categoryData = {
    pens: {
      title: 'Pens & Writing Instruments',
      description: 'Premium quality pens for all your writing needs',
      subcategories: ['Gel Pens', 'Ball Pens', 'Markers', 'Highlighters', 'Fountain Pens']
    },
    notebooks: {
      title: 'Notebooks & Paper Products',
      description: 'High-quality notebooks and paper for students and professionals',
      subcategories: ['Ruled Notebooks', 'Plain Notebooks', 'Spiral Notebooks', 'Sticky Notes', 'Copy Paper']
    },
    // ... more categories
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockProducts = [
        // ... product data based on category
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [category]);

  const currentCategory = categoryData[category] || { 
    title: 'All Products', 
    description: 'Browse our complete collection',
    subcategories: []
  };

  return (
    <div className="categories-page">
      <Container className="py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to="/categories">Categories</Breadcrumb.Item>
          <Breadcrumb.Item active>{currentCategory.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Category Header */}
        <div className="category-header mb-5">
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="category-title">{currentCategory.title}</h1>
              <p className="category-description">{currentCategory.description}</p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div className="category-stats">
                <span className="products-count">{filteredProducts.length} Products</span>
              </div>
            </Col>
          </Row>
        </div>

        <Row>
          {/* Filters Sidebar */}
          <Col lg={3}>
            <div className="filters-sidebar">
              <Card className="filter-card mb-4">
                <Card.Header>
                  <h5 className="mb-0">Filters</h5>
                </Card.Header>
                <Card.Body>
                  {/* Subcategories */}
                  {currentCategory.subcategories.length > 0 && (
                    <div className="filter-section mb-4">
                      <h6 className="filter-title">Subcategories</h6>
                      {currentCategory.subcategories.map((sub, index) => (
                        <Form.Check
                          key={index}
                          type="checkbox"
                          label={sub}
                          className="mb-2"
                        />
                      ))}
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Price Range</h6>
                    <Form.Range
                      min={0}
                      max={5000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="price-range-display">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Brands</h6>
                    {['Pilot', 'Parker', 'Classmate', 'Reynolds'].map((brand, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={brand}
                        className="mb-2"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }
                        }}
                      />
                    ))}
                  </div>

                  {/* Ratings */}
                  <div className="filter-section">
                    <h6 className="filter-title">Customer Rating</h6>
                    {[4, 3, 2, 1].map((rating) => (
                      <Form.Check
                        key={rating}
                        type="checkbox"
                        label={
                          <div>
                            {'★'.repeat(rating)}{'☆'.repeat(5-rating)} & Up
                          </div>
                        }
                        className="mb-2"
                      />
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Special Offers */}
              <Card className="special-offers-card">
                <Card.Body>
                  <h6>Special Offers</h6>
                  <div className="offer-item">
                    <Badge bg="danger">25% OFF</Badge>
                    <span className="ms-2">Premium Pens</span>
                  </div>
                  <div className="offer-item">
                    <Badge bg="success">Free Shipping</Badge>
                    <span className="ms-2">Orders over ₹500</span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Products Grid */}
          <Col lg={9}>
            {/* Sort & View Options */}
            <div className="products-controls mb-4">
              <Row className="align-items-center">
                <Col md={6}>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </Form.Select>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="view-options">
                    <Button variant="outline-secondary" size="sm" className="me-2">
                      <i className="fas fa-th-large"></i>
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="fas fa-list"></i>
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Row>
                {filteredProducts.map(product => (
                  <Col lg={4} md={6} key={product.id} className="mb-4">
                    {/* Product Card Component - Similar to HomePage */}
                    <Card className="product-card card-hover-effect">
                      {/* Product card content */}
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination */}
            <div className="pagination-container text-center mt-5">
              {/* Add pagination component */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Categories;
