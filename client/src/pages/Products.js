import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Pagination } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
    <Card className="h-100 product-card" role="article" aria-labelledby={`product-${product.id}-title`}>
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.image}
          alt={`${product.name} by ${product.brand} - High quality stationery product`}
          style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => navigate(`/products/${product.id}`)}
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
        {product.originalPrice > product.price && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2" role="text" aria-label={`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} percent discount`}>
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <h6 className="card-title" id={`product-${product.id}-title`}>{product.name}</h6>
          <p className="text-muted small">{product.brand}</p>
          
          <div className="mb-2" role="img" aria-label={`Rating: ${product.rating.average} out of 5 stars, based on ${product.rating.count} reviews`}>
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${i < Math.floor(product.rating.average) ? 'text-warning' : 'text-muted'}`}
                style={{ fontSize: '0.8rem' }}
                aria-hidden="true"
              ></i>
            ))}
            <span className="text-muted small ms-2" aria-label={`${product.rating.count} customer reviews`}>
              ({product.rating.count})
            </span>
          </div>
          
          <div className="mb-3">
            <span className="h5 text-primary" aria-label={`Current price: ${product.price} rupees`}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2" aria-label={`Original price: ${product.originalPrice} rupees`}>₹{product.originalPrice}</span>
            )}
          </div>
        </div>
        
        <Button
          variant="primary"
          className="w-100"
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
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for specific products"
            />
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
