import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const OrderSummary = ({ items, summary, currentStep }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <Card className="order-summary-card sticky-top">
      <Card.Header>
        <h5 className="mb-0">
          <i className="fas fa-shopping-bag me-2"></i>
          Order Summary
        </h5>
      </Card.Header>
      <Card.Body>
        {/* Order Items */}
        <div className="order-items mb-3">
          {items && items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img 
                  src={item.images?.[0] || item.image || 'https://via.placeholder.com/60x60'} 
                  alt={item.name}
                />
                <Badge bg="primary" className="item-quantity">
                  {item.quantity}
                </Badge>
              </div>
              <div className="item-details">
                <h6 className="item-name">{item.name}</h6>
                <p className="item-price">{formatPrice(item.price)}</p>
              </div>
              <div className="item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal ({items?.length || 0} items):</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          
          <div className="price-row">
            <span>Shipping:</span>
            <span>
              {summary.shipping === 0 ? (
                <span className="text-success fw-bold">FREE</span>
              ) : (
                formatPrice(summary.shipping)
              )}
            </span>
          </div>
          
          <div className="price-row">
            <span>Tax (GST):</span>
            <span>{formatPrice(summary.tax)}</span>
          </div>
          
          {summary.discount > 0 && (
            <div className="price-row discount">
              <span>Discount:</span>
              <span className="text-success">-{formatPrice(summary.discount)}</span>
            </div>
          )}
          
          <hr />
          
          <div className="price-row total">
            <span><strong>Total:</strong></span>
            <span><strong>{formatPrice(summary.total)}</strong></span>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {summary.shipping > 0 && (
          <div className="free-shipping-notice">
            <i className="fas fa-truck me-2"></i>
            Add {formatPrice(500 - summary.subtotal)} more for FREE shipping!
          </div>
        )}

        {/* Security Badges */}
        <div className="security-badges mt-3">
          <div className="security-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Secure Checkout</span>
          </div>
          <div className="security-badge">
            <i className="fas fa-lock"></i>
            <span>SSL Encrypted</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
