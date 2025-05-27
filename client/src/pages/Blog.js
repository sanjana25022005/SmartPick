import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Best Stationery Items for Students in 2024',
      excerpt: 'Discover the must-have stationery items that every student needs for academic success.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      category: 'Student Tips',
      readTime: '5 min read',
      tags: ['students', 'productivity', 'back-to-school']
    },
    {
      id: 2,
      title: 'Organizing Your Workspace for Maximum Productivity',
      excerpt: 'Learn how to create an organized and efficient workspace using the right stationery.',
      image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=400&h=300&fit=crop',
      author: 'Mike Chen',
      date: '2024-01-10',
      category: 'Productivity',
      readTime: '7 min read',
      tags: ['organization', 'workspace', 'productivity']
    },
    {
      id: 3,
      title: 'Eco-Friendly Stationery: A Sustainable Choice',
      excerpt: 'Explore environmentally friendly stationery options that help protect our planet.',
      image: 'https://images.unsplash.com/photo-1542601098-3adb3a6c60dc?w=400&h=300&fit=crop',
      author: 'Emma Wilson',
      date: '2024-01-05',
      category: 'Environment',
      readTime: '6 min read',
      tags: ['eco-friendly', 'sustainability', 'environment']
    }
  ];

  const categories = ['all', 'Student Tips', 'Productivity', 'Environment', 'Reviews'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sharePost = (post, platform) => {
    const url = `${window.location.origin}/blog/${post.id}`;
    const text = `Check out this article: ${post.title}`;
    
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const BlogCard = ({ post }) => (
    <Card className="h-100 blog-card">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={post.image}
          alt={post.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Badge bg="primary" className="position-absolute top-0 start-0 m-2">
          <i className="fas fa-folder me-1"></i>
          {post.category}
        </Badge>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text text-muted">{post.excerpt}</p>
          
          <div className="d-flex align-items-center text-muted small mb-3">
            <i className="fas fa-user me-2"></i>
            <span className="me-3">{post.author}</span>
            <i className="fas fa-calendar me-2"></i>
            <span className="me-3">{new Date(post.date).toLocaleDateString()}</span>
            <i className="fas fa-clock me-2"></i>
            <span>{post.readTime}</span>
          </div>
          
          <div className="mb-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} bg="outline-secondary" className="me-1 mb-1">
                <i className="fas fa-tag me-1"></i>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/blog/${post.id}`)}
          >
            <i className="fas fa-book-open me-2"></i>
            Read More
          </Button>
          
          <div className="d-flex gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => sharePost(post, 'facebook')}
              title="Share on Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </Button>
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => sharePost(post, 'twitter')}
              title="Share on Twitter"
            >
              <i className="fab fa-twitter"></i>
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => sharePost(post, 'linkedin')}
              title="Share on LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => sharePost(post, 'whatsapp')}
              title="Share on WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <div className="text-center mb-5">
              <h1>
                <i className="fas fa-blog me-3 text-primary"></i>
                SmartPick Blog
              </h1>
              <p className="lead text-muted">
                <i className="fas fa-lightbulb me-2"></i>
                Tips, insights, and inspiration for your stationery needs
              </p>
            </div>

            {/* Search and Filter */}
            <Row className="mb-4">
              <Col md={6}>
                <InputGroup>
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <span className="input-group-text">
                    <i className="fas fa-filter"></i>
                  </span>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>

            {/* Blog Posts */}
            <Row>
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <Col key={post.id} lg={4} md={6} className="mb-4">
                    <BlogCard post={post} />
                  </Col>
                ))
              ) : (
                <Col>
                  <div className="text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No blog posts found</h4>
                    <p className="text-muted">Try adjusting your search or filter criteria</p>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
