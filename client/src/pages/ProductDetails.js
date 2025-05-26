import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Form } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Mock product data - replace with actual API call
    setTimeout(() => {
      const mockProduct = {
        id: parseInt(id),
        name: "Premium Gel Pen Set",
        price: 299,
        originalPrice: 399,
        discount: 25,
        brand: "Pilot",
        type: "Pens",
        rating: 4.5,
        reviews: 128,
        images: [
          "https://via.placeholder.com/500x500?text=Gel+Pen+Set+1",
          "https://via.placeholder.com/500x500?text=Gel+Pen+Set+2",
          "https://via.placeholder.com/500x500?text=Gel+Pen+Set+3"
        ],
        description: "Experience smooth, vibrant writing with our premium gel pen set. Perfect for students, professionals, and artists who demand quality and consistency in their writing instruments.",
        specifications: {
          "Pack Size": "10 Pens",
          "Ink Type": "Gel",
          "Tip Size": "0.7mm",
          "Colors": "Assorted",
          "Material": "Plastic Body",
          "Warranty": "6 Months"
        },
        features: [
          "Smooth gel ink technology",
          "Comfortable grip design",
          "Quick-drying ink",
          "Vibrant color selection",
          "Leak-proof design",
          "Eco-friendly materials"
        ],
        stock: 50,
        reviews: [
          {
            id: 1,
            user: "John Doe",
            rating: 5,
            comment: "Excellent quality pens! Very smooth writing experience.",
            date: "2024-01-15"
          },
          {
            id: 2,
            user: "Sarah Smith",
            rating: 4,
            comment: "Good pens but could be a bit cheaper.",
            date: "2024-01-10"
          }
        ]
      };
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading product details...</h4>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Product not found</h2>
          <p className="text-muted">The product you're looking for doesn't exist.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="product-details-page">
      <Container className="py-4">
        <Row>
          {/* Product Images */}
          <Col lg={6}>
            <div className="product-images">
              <div className="main-image-container">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="main-image"
                />
                {product.discount > 0 && (
                  <Badge bg="danger" className="discount-badge">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6}>
            <div className="product-info">
              <div className="product-brand">{product.brand}</div>
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="rating-text">
                  {product.rating} ({product.reviews.length} reviews)
                </span>
              </div>

              <div className="product-price">
                <span className="current-price">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">₹{product.originalPrice}</span>
                )}
                {product.discount > 0 && (
                  <span className="savings">You save ₹{product.originalPrice - product.price}</span>
                )}
              </div>

              <div className="product-features">
                <h6>Key Features:</h6>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="product-stock">
                <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? (
                    <>
                      <i className="fas fa-check-circle"></i>
                      In Stock ({product.stock} available)
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times-circle"></i>
                      Out of Stock
                    </>
                  )}
                </span>
              </div>

              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="quantity-display">{quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="product-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isInCart(product.id)}
                  className="add-to-cart-btn"
                >
                  {isInCart(product.id) ? (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline-danger"
                  size="lg"
                  onClick={handleAddToWishlist}
                  className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                >
                  <i className="fas fa-heart me-2"></i>
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Row className="mt-5">
          <Col>
            <Card className="product-details-card">
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="product-tabs"
              >
                <Tab eventKey="description" title="Description">
                  <div className="tab-content-wrapper">
                    <h5>Product Description</h5>
                    <p>{product.description}</p>
                  </div>
                </Tab>
                
                <Tab eventKey="specifications" title="Specifications">
                  <div className="tab-content-wrapper">
                    <h5>Technical Specifications</h5>
                    <table className="specifications-table">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key}>
                            <td className="spec-label">{key}</td>
                            <td className="spec-value">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Tab>
                
                <Tab eventKey="reviews" title={`Reviews (${product.reviews.length})`}>
                  <div className="tab-content-wrapper">
                    <h5>Customer Reviews</h5>
                    <div className="reviews-summary">
                      <div className="overall-rating">
                        <span className="rating-number">{product.rating}</span>
                        <div className="rating-stars">
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span className="review-count">Based on {product.reviews.length} reviews</span>
                      </div>
                    </div>
                    
                    <div className="reviews-list">
                      {product.reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <strong>{review.user}</strong>
                            <div className="review-rating">
                              {'★'.repeat(review.rating)}
                              {'☆'.repeat(5 - review.rating)}
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    
                    {isAuthenticated && (
                      <div className="add-review-section">
                        <h6>Write a Review</h6>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select>
                              <option>5 Stars</option>
                              <option>4 Stars</option>
                              <option>3 Stars</option>
                              <option>2 Stars</option>
                              <option>1 Star</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Share your experience..." />
                          </Form.Group>
                          <Button variant="primary">Submit Review</Button>
                        </Form>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;
