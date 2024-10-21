import React, { useState, useContext, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { UserContext } from './Context.jsx'; // Ensure the path is correct

function Withdraw() {
  const [selectedName, setSelectedName] = useState('');
  const [withdrawal, setWithdrawal] = useState('');
  const [balance, setBalance] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [withdrawalMade, setWithdrawalMade] = useState(false);
  const ctx = useContext(UserContext);
  const nodeRef = useRef(null);

  async function handleWithdrawal(e) {
    e.preventDefault();
    if (!/^-?\d+(\.\d+)?$/.test(withdrawal)) {
      alert("\n‼️ALERT‼️ \nThat's not a number!");
      return;
    }
    if (Number(withdrawal) <= 0) {
      alert("\n‼️ALERT‼️ \nWithdrawal amount must be greater than zero!");
      return;
    }
    const user = ctx.users.find(user => user.name === selectedName);
    if (user) {
      if (Number(withdrawal) > user.balance) {
        alert("\n‼️ALERT‼️ \nOverdraft: that amount is larger than the current balance!");
        return;
      }
      const newBalance = user.balance - Number(withdrawal);
      user.balance = newBalance;
      setBalance(newBalance);
      setStatus(`Successful withdrawal! New balance for ${user.name}: $${numberWithCommas(newBalance)}`);
      setShow(true);
      setWithdrawalMade(true);
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
    setWithdrawal('');
    setBalance('');
    setShow(false);
    setStatus('');
    setWithdrawalMade(false);
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
        className="mb-2 withdrawal-card"
      >
        <Card.Header>Make a Withdrawal</Card.Header>
        <Card.Body>
          {show && (
            <Alert variant="success" className="alert-success-withdraw">
              {status}
              <br /><em>&ldquo;There’s no such thing as good money or bad money. There’s just money.&rdquo;</em>
            </Alert>
          )}
          {!withdrawalMade && (
            <Form onSubmit={handleWithdrawal}>
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
                  <Form.Label>Withdrawal Amount</Form.Label>
                  <Form.Control
                    type="text"
                    value={withdrawal}
                    onChange={e => setWithdrawal(e.currentTarget.value)}
                  />
                </Form.Group>
              </Row>
              <Button
                variant="primary"
                type="submit"
                disabled={!selectedName || withdrawal === ''}
              >
                Make Withdrawal
              </Button>
            </Form>
          )}
          {withdrawalMade && (
            <Button variant="primary" onClick={resetForm}>
              Make Another Withdrawal
            </Button>
          )}
        </Card.Body>
      </Card>
    </CSSTransition>
  );
}

export default Withdraw;
