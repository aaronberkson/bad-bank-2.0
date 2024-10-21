import React, { useContext, useState, useEffect } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { UserContext } from './Context.jsx';

function AllData() {
  const ctx = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/fetchData');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          setUsers(data);
        } else {
          setError('Failed to fetch data');
          console.error('Failed to fetch data', response.status);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Failed to fetch data', err);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    const cssRules = users.map((_, index) => `      .fade-in-${index} {        animation: fadeIn 600ms ${index * 0.5}s ease-in-out forwards;      }    `).join('');
    style.innerHTML = cssRules;
  }, [users.length]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="all-data-container">
      <div className="all-data-title">All Data</div>
      <div>
        {Array.isArray(users) && users.length > 0 && users.map((user, index) => (
          <Card key={user._id} className={`mb-3 all-data-card fade-in-${index}`}>
            <Card.Body style={{ paddingTop: '21px', paddingBottom: '7px' }}>
              <Row className="mb-2">
                <Col xs={2} md={2}>
                  <Image src={`/images/${user.profilepic}`} rounded style={{ height: '100px', borderRadius: '10px' }} />
                </Col>
                <Col xs={10} md={10}>
                  <Row className="mb-2">
                    <Col xs={5} md={3}>
                      <strong>Name:</strong>
                    </Col>
                    <Col xs={7} md={9}>
                      {user.name}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={5} md={3}>
                      <strong>Email:</strong>
                    </Col>
                    <Col xs={7} md={9}>
                      {user.email}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={5} md={3}>
                      <strong>Balance:</strong>
                    </Col>
                    <Col xs={7} md={9}>
                      ${numberWithCommas(user.balance)}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AllData;
