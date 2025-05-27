import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      date: '2024-01-16',
      content: 'Great article! Very helpful tips.'
    }
  ]);

  // Mock blog post data
  const post = {
    id: parseInt(id),
    title: 'Best Stationery Items for Students in 2024',
    content: `
      <p>As we enter 2024, students need the right tools to succeed in their academic journey. Here are the essential stationery items every student should have:</p>
      
      <h3>1. Quality Notebooks</h3>
      <p>A good notebook is the foundation of effective note-taking. Look for notebooks with quality paper that won't bleed through when using different pens.</p>
      
      <h3>2. Reliable Pens</h3>
      <p>Invest in pens that write smoothly and consistently. Gel pens are excellent for everyday writing, while ballpoint pens are perfect for forms and documents.</p>
      
      <h3>3. Organizational Tools</h3>
      <p>Desk organizers, file folders, and planners help keep your study space tidy and your schedule on track.</p>
    `,
    author: 'Sarah Johnson',
    date: '2024-01-15',
    category: 'Student Tips',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    tags: ['students', 'productivity', 'back-to-school']
  };

  const sharePost = (platform) => {
    const url = window.location.href;
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
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        return;
    }
    
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: 'You',
        date: new Date().toISOString().split('T')[0],
        content: comment
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => navigate('/blog')}
              className="mb-4"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Blog
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm">
              <img src={post.image} alt={post.title} className="card-img-top" style={{ height: '300px', objectFit: 'cover' }} />
              
              <Card.Body>
                <div className="mb-3">
                  <Badge bg="primary">
                    <i className="fas fa-folder me-1"></i>
                    {post.category}
                  </Badge>
                </div>

                <h1 className="mb-3">{post.title}</h1>

                <div className="d-flex align-items-center text-muted mb-4">
                  <i className="fas fa-user me-2"></i>
                  <span className="me-4">{post.author}</span>
                  <i className="fas fa-calendar me-2"></i>
                  <span className="me-4">{new Date(post.date).toLocaleDateString()}</span>
                  <i className="fas fa-clock me-2"></i>
                  <span>{post.readTime}</span>
                </div>

                {/* Share Buttons */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-3">
                    <i className="fas fa-share-alt me-2"></i>
                    Share this article:
                  </h6>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => sharePost('facebook')}
                    >
                      <i className="fab fa-facebook-f me-2"></i>
                      Facebook
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => sharePost('twitter')}
                    >
                      <i className="fab fa-twitter me-2"></i>
                      Twitter
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => sharePost('linkedin')}
                    >
                      <i className="fab fa-linkedin-in me-2"></i>
                      LinkedIn
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => sharePost('whatsapp')}
                    >
                      <i className="fab fa-whatsapp me-2"></i>
                      WhatsApp
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => sharePost('email')}
                    >
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                    >
                      <i className="fas fa-copy me-2"></i>
                      Copy Link
                    </Button>
                  </div>
                </div>

                <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="mt-4">
                  <h6>
                    <i className="fas fa-tags me-2"></i>
                    Tags:
                  </h6>
                  {post.tags.map((tag, index) => (
                    <Badge key={index} bg="outline-secondary" className="me-1 mb-1">
                      <i className="fas fa-tag me-1"></i>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Comments Section */}
            <Card className="shadow-sm mt-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-comments me-2"></i>
                  Comments ({comments.length})
                </h5>
              </Card.Header>
              <Card.Body>
                {/* Add Comment Form */}
                <Form onSubmit={handleCommentSubmit} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-comment-dots me-2"></i>
                      Leave a comment:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    <i className="fas fa-paper-plane me-2"></i>
                    Post Comment
                  </Button>
                </Form>

                {/* Comments List */}
                {comments.map((comment) => (
                  <div key={comment.id} className="border-bottom mb-3 pb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-user-circle text-muted me-2"></i>
                      <strong>{comment.author}</strong>
                      <span className="text-muted ms-2">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mb-0">{comment.content}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogPost;
