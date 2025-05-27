import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useCart } from '../../contexts/CartContext';

const HomePage = () => {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Simple test product
  const featuredProducts = [
    {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'https://via.placeholder.com/300x300'
    }
  ];

  // Define function BEFORE using it
  const isInWishlist = (productId) => {
    console.log('isInWishlist called with:', productId);
    console.log('wishlistItems:', wishlistItems);
    return wishlistItems.some(item => item.id === productId);
  };

  console.log('HomePage rendering, isInWishlist function:', typeof isInWishlist);

  return (
    <div className="home-page" style={{ marginTop: '120px' }}>
      <Container>
        <h1>Debug HomePage</h1>
        <Row>
          {featuredProducts.map((product) => {
            console.log('Rendering product:', product.id);
            console.log('isInWishlist function available:', typeof isInWishlist);
            
            return (
              <Col key={product.id} md={6}>
                <Card>
                  <Card.Body>
                    <h5>{product.name}</h5>
                    <p>Price: ₹{product.price}</p>
                    <Button
                      variant={isInWishlist(product.id) ? 'danger' : 'outline-danger'}
                      onClick={() => console.log('Wishlist clicked')}
                    >
                      <i className="fas fa-heart"></i>
                      {isInWishlist(product.id) ? ' Remove' : ' Add'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
