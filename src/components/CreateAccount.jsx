import React, { useState, useContext, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from './Context.jsx'; // Ensure the path is correct

function CreateAccount() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const ctx = useContext(UserContext);
  const nodeRef = React.useRef(null);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function validate(field, label) {
    if (!field) {
      alert(`\n‼️ALERT‼️\n ${capitalizeFirstLetter(label)} is required`);
      return false;
    }
    if (label === 'password' && field.length < 8) {
      alert(`\n‼️ALERT‼️\n ${capitalizeFirstLetter(label)} must be at least 8 characters long`);
      return false;
    }
    return true;
  }

  async function handleCreate() {
    if (!validate(name, 'name')) return;
    if (!validate(email, 'email')) return;
    if (!validate(password, 'password')) return;

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await fetch('/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ name, email, password, balance: 100 })
      });

      ctx.users.push({ name, email, password, balance: 100 });
      setStatus('Successful account creation for ' + name + '!');
      setShow(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setStatus('Error creating user');
    }
  }

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setShow(true);
    setStatus('');
  }

  return (
    <Card text="white" className="mb-2 create-account-card">
      <Card.Header>Create Account</Card.Header>
      <Card.Body>
        <CSSTransition
          nodeRef={nodeRef}
          in={show}
          appear={true}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div ref={nodeRef}>
            {show && (
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={e => setName(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={e => setEmail(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.currentTarget.value)}
                    />
                  </Form.Group>
                </Row>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleCreate}
                  disabled={!name || !email || !password}
                >
                  Create Account
                </Button>
              </Form>
            )}
          </div>
        </CSSTransition>
        {!show && (
          <>
            <Alert variant="success" className="alert-success-create-account">
              {status}<br/>
              <em>&ldquo;Welcome to the family.&rdquo;</em>
            </Alert>
            <Button variant="primary" onClick={clearForm}>
              Add another account
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default CreateAccount