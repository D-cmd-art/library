import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';

const Navigation = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">📚 Library Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/admin">Browse Books</Nav.Link>
            <Nav.Link as={Link} to="/ebooks">eBooks</Nav.Link>
            <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
           <Nav.Link as={Link} to="/account" className="me-1">  <FaUserCircle /></Nav.Link>
         <Button as={Link} to="/login"  className="me-2">
        Login
      </Button>
      <Button as={Link} to="/Register" variant="info">
        Register
      </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;