import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Pagination } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  
  const [products] = useState([
    {
      id: 1,
      name: 'Premium Gel Pen Set',
      brand: 'Pilot',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=400&h=400&fit=crop',
      rating: { average: 4.5, count: 128 },
      category: 'pens'
    },
    {
      id: 2,
      name: 'A4 Ruled Notebooks Pack',
      brand: 'Classmate',
      price: 450,
      originalPrice: 500,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      rating: { average: 4.3, count: 95 },
      category: 'notebooks'
    },
    {
      id: 3,
      name: 'Desk Organizer Pro',
      brand: 'OfficeMax',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=400&h=400&fit=crop',
      rating: { average: 4.7, count: 67 },
      category: 'organizers'
    },
    {
      id: 4,
      name: 'Art Supplies Kit',
      brand: 'Faber-Castell',
      price: 1200,
      originalPrice: 1500,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      rating: { average: 4.8, count: 234 },
      category: 'art'
    },
    {
      id: 5,
      name: 'Mechanical Pencil Set',
      brand: 'Staedtler',
      price: 350,
      originalPrice: 450,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=400&h=400&fit=crop',
      rating: { average: 4.6, count: 89 },
      category: 'pens'
    },
    {
      id: 6,
      name: 'Spiral Notebooks Set',
      brand: 'Oxford',
      price: 320,
      originalPrice: 400,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      rating: { average: 4.4, count: 156 },
      category: 'notebooks'
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'pens', label: 'Pens & Writing' },
    { value: 'notebooks', label: 'Notebooks' },
    { value: 'organizers', label: 'Organizers' },
    { value: 'art', label: 'Art & Craft' }
  ];

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating.average - a.rating.average;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy, products]);

  const ProductCard = ({ product }) => (
    <Card className="h-100 product-card">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.image}
          alt={`${product.name} by ${product.brand} - High quality stationery product`}
          style={{ height: '280px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => navigate(`/products/${product.id}`)}
        />
        
        {/* Wishlist button - always visible on products page */}
        <Button
          variant={isInWishlist(product.id) ? "danger" : "outline-light"}
          size="sm"
          className="position-absolute wishlist-btn"
          style={{ 
            top: '10px', 
            right: '10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            background: isInWishlist(product.id) ? '#dc3545' : 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            zIndex: 2
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`fas fa-heart ${isInWishlist(product.id) ? 'text-white' : 'text-danger'}`}></i>
        </Button>
        
        {product.originalPrice > product.price && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <h6 className="card-title">{product.name}</h6>
          <p className="text-muted small">{product.brand}</p>
          
          <div className="mb-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${i < Math.floor(product.rating.average) ? 'text-warning' : 'text-muted'}`}
                style={{ fontSize: '0.8rem' }}
              ></i>
            ))}
            <span className="text-muted small ms-2">({product.rating.count})</span>
          </div>
          
          <div className="mb-3">
            <span className="h5 text-primary">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <Button
          variant="primary"
          className="w-100"
          onClick={() => addToCart(product)}
        >
          <i className="fas fa-shopping-cart me-2"></i>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <div style={{ marginTop: '120px', minHeight: '80vh' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1>Products</h1>
            <p className="text-muted">Discover our complete range of stationery items</p>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4" role="toolbar" aria-label="Product filters">
          <Col md={3}>
            <div className="position-relative">
              <i className="fas fa-filter position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                style={{ paddingLeft: '35px' }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Form.Select>
            </div>
          </Col>
          <Col md={3}>
            <div className="position-relative">
              <i className="fas fa-sort position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by"
                style={{ paddingLeft: '35px' }}
              >
                <option value="name"><i className="fas fa-sort-alpha-down"></i> Sort by Name</option>
                <option value="price-low"><i className="fas fa-sort-numeric-down"></i> Price: Low to High</option>
                <option value="price-high"><i className="fas fa-sort-numeric-up"></i> Price: High to Low</option>
                <option value="rating"><i className="fas fa-star"></i> Sort by Rating</option>
              </Form.Select>
            </div>
          </Col>
          <Col md={6}>
            <div className="position-relative">
              <i className="fas fa-search position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}></i>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for specific products"
                style={{ paddingLeft: '45px' }}
              />
            </div>
          </Col>
        </Row>

        {/* Products Grid */}
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Col key={product.id} lg={4} md={6} sm={6} xs={12} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col>
              <div className="text-center py-5" role="status" aria-live="polite">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your filters or search terms</p>
              </div>
            </Col>
          )}
        </Row>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Pagination role="navigation" aria-label="Product pages navigation">
                <Pagination.Prev disabled aria-label="Previous page" />
                <Pagination.Item active aria-label="Current page, page 1">1</Pagination.Item>
                <Pagination.Item aria-label="Go to page 2">2</Pagination.Item>
                <Pagination.Item aria-label="Go to page 3">3</Pagination.Item>
                <Pagination.Next aria-label="Next page" />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Products;
