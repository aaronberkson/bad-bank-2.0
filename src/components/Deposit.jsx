import React, { useState, useContext, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from './Context.jsx'; // Ensure the path is correct

function Deposit() {
  const [selectedName, setSelectedName] = useState('');
  const [deposit, setDeposit] = useState('');
  const [balance, setBalance] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [depositMade, setDepositMade] = useState(false);
  const ctx = useContext(UserContext);
  const nodeRef = useRef(null);

  async function handleDeposit(e) {
    e.preventDefault();
    if (!/^-?\d+(\.\d+)?$/.test(deposit)) {
      alert("\n‼️ALERT‼️ \nThat's not a number!");
      return;
    }
    if (Number(deposit) < 0) {
      alert("\n‼️ALERT‼️ \nYou can't deposit a negative number!");
      return;
    }
    const user = ctx.users.find(user => user.name === selectedName);
    if (user) {
      const newBalance = user.balance + Number(deposit);
      user.balance = newBalance;
      setBalance(newBalance);
      setStatus(`Deposit successful! New balance for ${user.name}: $${newBalance.toLocaleString()}`);
      setShow(true);
      setDepositMade(true);
      await fetch('/update-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebase.auth().currentUser.getIdToken()}`
        },
        body: JSON.stringify({ name: user.name, balance: newBalance })
      });
    }
  }

  function resetForm() {
    setSelectedName('');
    setDeposit('');
    setBalance('');
    setShow(false);
    setStatus('');
    setDepositMade(false);
  }

  function updateBalance(selectedName) {
    if (selectedName === '') {
      setBalance('');
    } else {
      const user = ctx.users.find(user => user.name === selectedName);
      if (user) {
        setBalance(`$${user.balance}`);
      }
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <Card
        ref={nodeRef}
        className="mb-2 deposit-card"
      >
        <Card.Header>Make a Deposit</Card.Header>
        <Card.Body>
          {show && (
            <Alert variant="success" className={`alert-success-deposit ${show ? '' : 'hide'}`}>
              Successful deposit! New balance for {selectedName}: ${numberWithCommas(balance)}
              <br /><em>&ldquo;It's not what you make, it's what you keep.&ldquo;</em>
            </Alert>
          )}
          {!depositMade && (
            <Form onSubmit={handleDeposit}>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Account Name</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedName}
                    onChange={e => {
                      setSelectedName(e.currentTarget.value);
                      updateBalance(e.currentTarget.value);
                    }}
                  >
                    <option value="">Select Account</option>
                    {ctx.users.map((user, index) => (
                      <option key={index} value={user.name}>{user.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Balance</Form.Label>
                  <div>
                    {balance !== '' ? `${numberWithCommas(balance)}` : <em>Select an account above to view balance</em>}
                  </div>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Deposit Amount</Form.Label>
                  <Form.Control
                    type="text"
                    value={deposit}
                    onChange={e => setDeposit(e.currentTarget.value)}
                  />
                </Form.Group>
              </Row>
              <Button
                variant="primary"
                type="submit"
                disabled={!selectedName || deposit === ''}
              >
                Make Deposit
              </Button>
            </Form>
          )}
          {depositMade && (
            <Button variant="primary" onClick={resetForm}>
              Make Another Deposit
            </Button>
          )}
        </Card.Body>
      </Card>
    </CSSTransition>
  );
}

export default Deposit;
