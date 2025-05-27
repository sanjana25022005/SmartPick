import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  // const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart();
  
  // Remove the unused wishlist functions for now

  useEffect(() => {
    // Mock search results
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: 'Premium Gel Pen Set',
          price: 299,
          originalPrice: 399,
          discount: 25,
          brand: 'Pilot',
          rating: 4.5,
          reviews: 128,
          image: 'https://via.placeholder.com/300x300?text=Gel+Pen+Set'
        }
        // ... more results
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [query]);

  return (
    <div className="search-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-4">
        <div className="search-header mb-4">
          <h1>Search Results</h1>
          <p className="text-muted">
            {loading ? 'Searching...' : `${results.length} results for "${query}"`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row>
            <Col lg={3}>
              {/* Search filters */}
              <Card className="filter-card">
                <Card.Header>
                  <h5>Refine Results</h5>
                </Card.Header>
                <Card.Body>
                  {/* Filter options */}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={9}>
              {/* Sort options */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span>{results.length} results</span>
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </Form.Select>
              </div>

              {/* Results grid */}
              <Row>
                {results.map(product => (
                  <Col lg={4} md={6} key={product.id} className="mb-4">
                    {/* Product card */}
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Search;
