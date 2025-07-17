import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { FaUserCircle, FaBook } from 'react-icons/fa'; // Import FaBook icon
import './Navbar.css';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">📚 Library Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/browsebook">BrowseBooks</Nav.Link>
            {/* New: Borrow Books link with icon */}
           
            <Nav.Link as={Link} to="/ebooks">eBooks</Nav.Link>

            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            {/* Donate Book button, only visible when logged in */}
            {token && (
              <Nav.Link as={Link} to="/donate">Donate Book</Nav.Link>
            )}
          </Nav>

          {token ? (
            <>
             <Nav.Link as={Link} to="/borrowhistory">
              <FaBook className="me-1" /> 
            </Nav.Link>
              <Nav.Link as={Link} to="/account" className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-white hover:bg-blue-600 transition">
                <FaUserCircle className="text-2xl" />
              </Nav.Link>
              <Button className="me-2" variant="info" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" className="me-2" variant="light">
                Login
              </Button>
              <Button as={Link} to="/register" variant="info">
                Register
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;