import React, { useState, useRef } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.js'; // Adjust the import

function Login() {
  const nodeRef = useRef(null);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // If you want to handle username to email resolution yourself, do it here
      // But we'll assume the user provides email directly for simplicity

      signInWithEmailAndPassword(auth, emailOrUsername, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('User signed in:', user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error signing in:', errorCode, errorMessage);
        });
    } catch (error) {
      console.error('Error during login process:', error);
    }
  };

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={500}
      classNames="fade"
      unmountOnExit
    >
      <Card ref={nodeRef} bg="dark" text="white" className="login-card" style={{ padding: '20px' }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6} className="d-flex flex-column justify-content-center" style={{ paddingRight: '20px', paddingLeft: '15px' }}>
              <Card.Title className="text-left mb-2">What's the password?</Card.Title>
              <img
                src="/images/badbank-login.png"
                className="img-fluid rounded-lg"
                style={{ border: '2px solid #6c757d', borderRadius: '15px', marginBottom: '5px' }}
                alt="Login Illustration"
              />
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center" style={{ paddingLeft: '20px', paddingRight: '15px' }}>
              <Card.Title className="text-center mb-4" style={{ fontWeight: 'bold' }}>Bad Bank Access</Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmailOrUsername" className="d-flex flex-column" style={{ marginBottom: '20px' }}>
                  <Form.Label style={{ marginBottom: '0', paddingBottom: '5px' }}>Email or Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter email or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="d-flex flex-column" style={{ marginBottom: '20px' }}>
                  <Form.Label style={{ marginBottom: '0', paddingBottom: '5px' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Log In
                </Button>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </CSSTransition>
  );
}

export default Login;
