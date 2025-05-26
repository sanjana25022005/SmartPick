import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <div className="about-page" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        <Row>
          <Col>
            <h1 className="text-center mb-5">About SmartPick</h1>
            <Card className="p-4">
              <Card.Body>
                <h3>Your Essential Stationery Hub</h3>
                <p className="lead">
                  SmartPick is your one-stop destination for all premium stationery needs. 
                  We believe that the right tools can enhance creativity and productivity.
                </p>
                <p>
                  Founded with a passion for quality stationery, we curate the best products 
                  from trusted brands to serve students, professionals, and artists alike.
                </p>
                <h4 className="mt-4">Our Mission</h4>
                <p>
                  To provide high-quality stationery products that inspire creativity, 
                  enhance productivity, and make every writing experience delightful.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
