import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <div className="blog-post-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="p-4">
              <Card.Body>
                <h1>Top 5 Productivity Planners for 2024</h1>
                <p className="text-muted mb-4">Published on January 15, 2024</p>
                <img 
                  src="https://via.placeholder.com/800x400?text=Blog+Post+Image" 
                  alt="Blog post" 
                  className="img-fluid mb-4 rounded"
                />
                <div className="blog-content">
                  <p>Content for the blog post goes here...</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogPost;
