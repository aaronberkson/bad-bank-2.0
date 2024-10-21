import React from 'react';
import { Card } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

function Home() {
  const nodeRef = React.useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={500}
      classNames="fade"
      unmountOnExit
    >
      <Card
        ref={nodeRef}
        bg="dark"
        text="white"
        className="home-card"
      >
        <Card.Header>A message from the Chairman of the Board:</Card.Header>
        <Card.Body>
          <Card.Title>Welcome to Bad Bank.</Card.Title>
          <Card.Text>
            “Where the green gets stashed, no questions asked.”
          </Card.Text>
          <img src="/images/badbank-welcome.png" className="img-fluid" alt="Responsive image" />
        </Card.Body>
      </Card>
    </CSSTransition>
  );
}

export default Home;
