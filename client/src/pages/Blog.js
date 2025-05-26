import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Mock blog posts
    const mockPosts = [
      {
        id: 1,
        title: 'Top 5 Productivity Planners for 2024',
        excerpt: 'Discover the best planners to boost your productivity...',
        author: 'SmartPick Team',
        date: '2024-01-15',
        image: 'https://via.placeholder.com/400x200?text=Planners',
        slug: 'top-5-productivity-planners-2024'
      }
    ];
    setPosts(mockPosts);
  }, []);

  return (
    <div className="blog-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <h1 className="text-center mb-5">SmartPick Blog</h1>
        <Row>
          {posts.map(post => (
            <Col lg={4} md={6} key={post.id} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={post.image} />
                <Card.Body>
                  <Card.Title as={Link} to={`/blog/${post.slug}`} className="text-decoration-none">
                    {post.title}
                  </Card.Title>
                  <Card.Text>{post.excerpt}</Card.Text>
                  <small className="text-muted">
                    By {post.author} • {new Date(post.date).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
