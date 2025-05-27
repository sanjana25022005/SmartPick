import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Study Tips for Better Academic Performance',
      excerpt: 'Discover proven strategies to improve your study habits and boost your grades with the right stationery tools.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Dr. Sarah Wilson',
      date: '2024-01-15',
      category: 'Study Tips',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
      readTime: '5 min read',
      tags: ['study', 'productivity', 'education'],
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: 'The Art of Note-Taking: Choosing the Right Notebook',
      excerpt: 'Learn how different notebook styles can impact your note-taking effectiveness and academic success.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Mike Johnson',
      date: '2024-01-12',
      category: 'Product Guide',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=250&fit=crop',
      readTime: '7 min read',
      tags: ['notebooks', 'note-taking', 'productivity'],
      views: 980,
      likes: 67
    },
    {
      id: 3,
      title: 'Organizing Your Workspace for Maximum Productivity',
      excerpt: 'Transform your study space into a productivity powerhouse with these organization tips and tools.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Emma Davis',
      date: '2024-01-10',
      category: 'Organization',
      image: 'https://images.unsplash.com/photo-1586281010691-20b3d3bb6b81?w=400&h=250&fit=crop',
      readTime: '6 min read',
      tags: ['organization', 'workspace', 'productivity'],
      views: 1450,
      likes: 123
    },
    {
      id: 4,
      title: 'Creative Writing: Unleashing Your Artistic Potential',
      excerpt: 'Explore how the right writing tools can enhance your creative expression and artistic journey.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Alex Rodriguez',
      date: '2024-01-08',
      category: 'Creativity',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop',
      readTime: '8 min read',
      tags: ['creativity', 'writing', 'art'],
      views: 756,
      likes: 45
    }
  ];

  const categories = ['all', 'Study Tips', 'Product Guide', 'Organization', 'Creativity'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-5">
          <Col>
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary">SmartPick Blog</h1>
              <p className="lead text-muted">
                Insights, tips, and guides to help you succeed in your academic journey
              </p>
            </div>

            {/* Search and Filter */}
            <Row className="mb-4">
              <Col md={8}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-primary">
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup>
              </Col>
              <Col md={4}>
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
              </Col>
            </Row>

            {/* Blog Posts Grid */}
            <Row>
              {filteredPosts.map((post) => (
                <Col key={post.id} lg={6} className="mb-4">
                  <Card className="h-100 shadow-sm border-0">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={post.image}
                        alt={post.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Badge
                        bg="primary"
                        className="position-absolute top-0 start-0 m-3"
                      >
                        {post.category}
                      </Badge>
                    </div>
                    
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <small className="text-muted">
                          By {post.author} • {formatDate(post.date)} • {post.readTime}
                        </small>
                      </div>
                      
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} bg="light" text="dark" className="small">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                          <i className="fas fa-eye me-1"></i>{post.views}
                          <i className="fas fa-heart ms-3 me-1"></i>{post.likes}
                        </div>
                        <Button
                          as={Link}
                          to={`/blog/${post.id}`}
                          variant="primary"
                          size="sm"
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {filteredPosts.length === 0 && (
              <div className="text-center py-5">
                <h4>No articles found</h4>
                <p className="text-muted">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
