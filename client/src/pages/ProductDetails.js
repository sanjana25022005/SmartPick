import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in real app, this would come from API
  const products = [
    {
      id: 1,
      name: 'Premium Gel Pen Set',
      brand: 'Pilot',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=600&h=600&fit=crop',
      rating: { average: 4.5, count: 128 },
      description: 'High-quality gel pens with smooth writing experience. Perfect for students and professionals.',
      features: ['Smooth gel ink', 'Comfortable grip', 'Long-lasting', 'Available in multiple colors'],
      inStock: true,
      stockCount: 25
    },
    {
      id: 2,
      name: 'A4 Ruled Notebooks Pack',
      brand: 'Classmate',
      price: 450,
      originalPrice: 500,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
      rating: { average: 4.3, count: 95 },
      description: 'Premium quality notebooks with ruled pages. Ideal for note-taking and studying.',
      features: ['A4 size', 'Ruled pages', 'Quality paper', 'Durable binding'],
      inStock: true,
      stockCount: 15
    },
    {
      id: 3,
      name: 'Desk Organizer Pro',
      brand: 'OfficeMax',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=600&h=600&fit=crop',
      rating: { average: 4.7, count: 67 },
      description: 'Multi-compartment desk organizer to keep your workspace tidy and organized.',
      features: ['Multiple compartments', 'Durable material', 'Space-saving design', 'Easy to clean'],
      inStock: true,
      stockCount: 8
    },
    {
      id: 4,
      name: 'Art Supplies Kit',
      brand: 'Faber-Castell',
      price: 1200,
      originalPrice: 1500,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop',
      rating: { average: 4.8, count: 234 },
      description: 'Complete art supplies kit for creative projects and artistic endeavors.',
      features: ['Complete art set', 'Professional quality', 'Portable case', 'All essential tools included'],
      inStock: true,
      stockCount: 12
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchProduct = () => {
      setLoading(true);
      const foundProduct = products.find(p => p.id === parseInt(id));
      setTimeout(() => {
        setProduct(foundProduct || null);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${product.name} added to cart!`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ marginTop: '120px', minHeight: '60vh' }}>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ marginTop: '120px', minHeight: '60vh' }}>
        <Container>
          <Alert variant="warning" className="text-center">
            <h4>Product not found</h4>
            <p>The product you're looking for doesn't exist.</p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '120px', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => navigate('/products')}
              className="mb-4"
              aria-label="Go back to products page"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Products
            </Button>
          </Col>
        </Row>

        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0">
              <Card.Img
                src={product.image}
                alt={`${product.name} by ${product.brand}`}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </Card>
          </Col>

          <Col lg={6}>
            <div className="product-details">
              <h1 className="mb-2">{product.name}</h1>
              <p className="text-muted mb-3">by {product.brand}</p>

              {/* Rating */}
              <div className="mb-3" role="img" aria-label={`Rating: ${product.rating.average} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${i < Math.floor(product.rating.average) ? 'text-warning' : 'text-muted'}`}
                    aria-hidden="true"
                  ></i>
                ))}
                <span className="ms-2">
                  <i className="fas fa-users me-1 text-muted"></i>
                  ({product.rating.count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="h3 text-primary">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-muted text-decoration-line-through ms-3">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <Badge bg="success" className="ms-2">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5>
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Description
                </h5>
                <p>{product.description}</p>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h5>
                  <i className="fas fa-check-circle me-2 text-success"></i>
                  Features
                </h5>
                <ul>
                  {product.features?.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check me-2 text-success"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.inStock ? (
                  <div className="text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    In Stock ({product.stockCount} available)
                  </div>
                ) : (
                  <div className="text-danger">
                    <i className="fas fa-times-circle me-2"></i>
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <label htmlFor="quantity" className="form-label">
                      <i className="fas fa-sort-numeric-up me-2"></i>
                      Quantity:
                    </label>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <i className="fas fa-minus"></i>
                      </Button>
                      <span className="mx-3 fw-bold">{quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= product.stockCount}
                        aria-label="Increase quantity"
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isInCart(product.id)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    {isInCart(product.id) ? 'Already in Cart' : 'Add to Cart'}
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="small text-muted">
                <i className="fas fa-truck me-2"></i>
                Free shipping on orders over ₹500
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;
