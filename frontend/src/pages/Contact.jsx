import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Contact = () => (
  <Container className="py-5">
    <h2 className="text-center mb-4">Contact Us</h2>
    <Form style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your name" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter your email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formMessage">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" rows={4} placeholder="Your message" />
      </Form.Group>

      <Button variant="primary" type="submit">Send Message</Button>
    </Form>
  </Container>
);

export default Contact;