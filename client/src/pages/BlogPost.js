import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BlogPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  // Mock blog post data
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Study Tips for Better Academic Performance',
      content: `
        <h3>Introduction</h3>
        <p>Academic success isn't just about intelligence – it's about having the right strategies, tools, and mindset. In this comprehensive guide, we'll explore proven study techniques that can help you achieve better grades and retain information more effectively.</p>
        
        <h3>1. Create a Dedicated Study Space</h3>
        <p>Having a designated study area helps your brain associate that space with learning. Ensure your study space has good lighting, comfortable seating, and all necessary supplies within reach.</p>
        
        <h3>2. Use the Right Writing Tools</h3>
        <p>Quality pens and notebooks can make a significant difference in your note-taking experience. Smooth-writing gel pens reduce hand fatigue during long study sessions, while well-structured notebooks help organize your thoughts.</p>
        
        <h3>3. Practice Active Reading</h3>
        <p>Don't just read passively. Highlight key points, write margin notes, and summarize chapters in your own words. This active engagement helps improve comprehension and retention.</p>
        
        <h3>4. Use Color-Coding Systems</h3>
        <p>Implement a color-coding system for different subjects or types of information. This visual organization technique makes reviewing notes more efficient and helps with memory recall.</p>
        
        <h3>5. Take Regular Breaks</h3>
        <p>The Pomodoro Technique suggests studying for 25 minutes followed by a 5-minute break. This approach helps maintain focus and prevents mental fatigue.</p>
        
        <h3>Conclusion</h3>
        <p>Remember, effective studying is about quality, not just quantity. By implementing these strategies and using the right tools, you'll find yourself learning more efficiently and achieving better academic results.</p>
      `,
      author: 'Dr. Sarah Wilson',
      date: '2024-01-15',
      category: 'Study Tips',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
      readTime: '5 min read',
      tags: ['study', 'productivity', 'education'],
      views: 1250,
      likes: 89
    }
    // Add other posts as needed
  ];

  const mockComments = [
    {
      id: 1,
      author: 'John Doe',
      date: '2024-01-16',
      content: 'Great article! The color-coding tip really helped me organize my notes better.'
    },
    {
      id: 2,
      author: 'Jane Smith',
      date: '2024-01-16',
      content: 'Thanks for sharing these tips. I\'ve already started implementing the Pomodoro Technique.'
    }
  ];

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(id));
    setPost(foundPost);
    setComments(mockComments);
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    // Here you would typically update the backend
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: `${user.firstName} ${user.lastName}`,
        date: new Date().toISOString().split('T')[0],
        content: newComment
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  if (!post) {
    return (
      <div style={{ marginTop: '120px', minHeight: '60vh' }}>
        <Container>
          <Alert variant="warning" className="text-center">
            <h4>Post not found</h4>
            <Button as={Link} to="/blog" variant="primary">
              Back to Blog
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '120px', background: '#f8f9fa', minHeight: '80vh' }}>
      <Container>
        <Row className="py-4">
          <Col lg={8}>
            {/* Back to Blog */}
            <div className="mb-3">
              <Button as={Link} to="/blog" variant="outline-primary" size="sm">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Blog
              </Button>
            </div>

            {/* Blog Post */}
            <Card className="shadow-sm border-0">
              <Card.Img
                variant="top"
                src={post.image}
                alt={post.title}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              
              <Card.Body>
                {/* Post Meta */}
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">{post.category}</Badge>
                  <small className="text-muted">
                    By {post.author} • {new Date(post.date).toLocaleDateString()} • {post.readTime}
                  </small>
                </div>

                {/* Post Title */}
                <h1 className="mb-4">{post.title}</h1>

                {/* Post Content */}
                <div 
                  className="blog-content mb-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-2">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Like and Share */}
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <div>
                    <Button
                      variant={liked ? "danger" : "outline-danger"}
                      size="sm"
                      onClick={handleLike}
                      className="me-2"
                    >
                      <i className="fas fa-heart me-1"></i>
                      {liked ? 'Liked' : 'Like'} ({post.likes + (liked ? 1 : 0)})
                    </Button>
                    <span className="text-muted small">
                      <i className="fas fa-eye me-1"></i>{post.views} views
                    </span>
                  </div>
                  
                  <div>
                    <small className="text-muted me-2">Share:</small>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                      className="me-1"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                      className="me-1"
                    >
                      <i className="fab fa-twitter"></i>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShare('linkedin')}
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Comments Section */}
            <Card className="mt-4 shadow-sm border-0">
              <Card.Header>
                <h5 className="mb-0">Comments ({comments.length})</h5>
              </Card.Header>
              <Card.Body>
                {/* Add Comment Form */}
                {user ? (
                  <Form onSubmit={handleCommentSubmit} className="mb-4">
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-2">
                      Post Comment
                    </Button>
                  </Form>
                ) : (
                  <Alert variant="info">
                    <Link to="/login">Login</Link> to join the discussion
                  </Alert>
                )}

                {/* Comments List */}
                {comments.map((comment) => (
                  <div key={comment.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1">{comment.author}</h6>
                      <small className="text-muted">
                        {new Date(comment.date).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mb-0">{comment.content}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Header>
                <h6 className="mb-0">Related Articles</h6>
              </Card.Header>
              <Card.Body>
                {blogPosts.slice(0, 3).map((relatedPost) => (
                  <div key={relatedPost.id} className="d-flex mb-3">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      className="rounded me-3"
                    />
                    <div>
                      <h6 className="small">
                        <Link to={`/blog/${relatedPost.id}`} className="text-decoration-none">
                          {relatedPost.title}
                        </Link>
                      </h6>
                      <small className="text-muted">{relatedPost.readTime}</small>
                    </div>
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
