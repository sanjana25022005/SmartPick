import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useCart } from '../../contexts/CartContext';

const BundleSuggestions = ({ cartItems }) => {
  const { addToCart } = useCart();
  const [suggestions, setSuggestions] = useState([]);

  // Smart bundle suggestions based on cart items
  const bundleRules = [
    {
      id: 'writing-bundle',
      name: 'Complete Writing Bundle',
      description: 'Perfect for students and professionals',
      discount: 15,
      requiredCategories: ['pens'],
      suggestedItems: [
        { id: 2, name: 'A4 Ruled Notebooks Pack', price: 450, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop' },
        { id: 5, name: 'Mechanical Pencil Set', price: 350, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=200&h=200&fit=crop' }
      ]
    },
    {
      id: 'student-bundle',
      name: 'Student Essentials Bundle',
      description: 'Everything you need for school',
      discount: 20,
      requiredCategories: ['notebooks'],
      suggestedItems: [
        { id: 1, name: 'Premium Gel Pen Set', price: 299, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=200&h=200&fit=crop' },
        { id: 3, name: 'Desk Organizer Pro', price: 899, image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=200&h=200&fit=crop' }
      ]
    },
    {
      id: 'creative-bundle',
      name: 'Creative Artist Bundle',
      description: 'Unleash your creativity',
      discount: 25,
      requiredCategories: ['art'],
      suggestedItems: [
        { id: 1, name: 'Premium Gel Pen Set', price: 299, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc63fc2?w=200&h=200&fit=crop' },
        { id: 2, name: 'A4 Ruled Notebooks Pack', price: 450, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop' }
      ]
    }
  ];

  useEffect(() => {
    const generateSuggestions = () => {
      if (!cartItems || cartItems.length === 0) {
        setSuggestions([]);
        return;
      }

      const cartCategories = cartItems.map(item => {
        // Determine category based on item name (simplified logic)
        if (item.name.toLowerCase().includes('pen') || item.name.toLowerCase().includes('pencil')) return 'pens';
        if (item.name.toLowerCase().includes('notebook')) return 'notebooks';
        if (item.name.toLowerCase().includes('art') || item.name.toLowerCase().includes('supplies')) return 'art';
        if (item.name.toLowerCase().includes('organizer')) return 'organizers';
        return 'misc';
      });

      const cartItemIds = cartItems.map(item => item.id);
      
      const relevantBundles = bundleRules.filter(bundle => 
        bundle.requiredCategories.some(cat => cartCategories.includes(cat))
      ).map(bundle => ({
        ...bundle,
        suggestedItems: bundle.suggestedItems.filter(item => !cartItemIds.includes(item.id))
      })).filter(bundle => bundle.suggestedItems.length > 0);

      setSuggestions(relevantBundles);
    };

    generateSuggestions();
  }, [cartItems]);

  const handleAddBundle = (bundle) => {
    bundle.suggestedItems.forEach(item => {
      addToCart(item);
    });
    alert(`${bundle.name} added to cart with ${bundle.discount}% discount!`);
  };

  const calculateBundlePrice = (bundle) => {
    const originalPrice = bundle.suggestedItems.reduce((sum, item) => sum + item.price, 0);
    const discountedPrice = originalPrice * (1 - bundle.discount / 100);
    return { originalPrice, discountedPrice, savings: originalPrice - discountedPrice };
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <Card.Header className="bg-gradient-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-lightbulb me-2"></i>
          Smart Bundle Suggestions
        </h5>
        <small>Complete your purchase with these recommended bundles</small>
      </Card.Header>
      <Card.Body>
        {suggestions.map((bundle) => {
          const pricing = calculateBundlePrice(bundle);
          
          return (
            <Card key={bundle.id} className="mb-3 border">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center mb-2">
                      <h6 className="mb-0 me-2">{bundle.name}</h6>
                      <Badge bg="success">{bundle.discount}% OFF</Badge>
                    </div>
                    <p className="text-muted small mb-3">{bundle.description}</p>
                    
                    <div className="d-flex flex-wrap gap-2">
                      {bundle.suggestedItems.map((item) => (
                        <div key={item.id} className="d-flex align-items-center bg-light rounded p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            className="rounded me-2"
                          />
                          <div>
                            <small className="d-block font-weight-bold">{item.name}</small>
                            <small className="text-muted">₹{item.price}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                  
                  <Col md={4} className="text-end">
                    <div className="mb-2">
                      <div className="text-muted text-decoration-line-through">
                        ₹{pricing.originalPrice.toLocaleString()}
                      </div>
                      <div className="h5 text-success">
                        ₹{pricing.discountedPrice.toLocaleString()}
                      </div>
                      <small className="text-success">
                        Save ₹{pricing.savings.toLocaleString()}
                      </small>
                    </div>
                    
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAddBundle(bundle)}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Add Bundle
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default BundleSuggestions;
