import React, { useState, useContext, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Ensure correct path to firebaseConfig
import { UserContext } from './Context.jsx'; // Ensure correct path to Context

function NavBar() {
  const ctx = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const popperConfig = {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [14, 3], // [horizontal, vertical] in pixels
        },
      },
    ],
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark raleway-medium-bold">
      <div className="navbar-inner d-flex flex-column w-100">
        <div className="d-flex justify-content-end align-items-center w-100 p-2" style={{ color: 'whitesmoke' }}>
          {currentUser ? (
            <div className="d-flex align-items-center">
              <span className="mr-2">Logged in as {currentUser.email}</span>
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                Log Out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-outline-light btn-sm">
              Log In
            </NavLink>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center w-100">
          <NavLink
            to="/"
            className={({ isActive }) => `navbar-brand mx-0 ${isActive ? 'active-nav-brand' : ''}`}
          >
            <img src="/images/badbank-badkitty.png" style={{ height: '175px', width: '175px' }} alt="Logo" />
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <OverlayTrigger
                  placement="bottom-start"
                  overlay={<Tooltip className="custom-tooltip">Enroll now, for an <i>offer you can’t refuse.</i></Tooltip>}
                  popperConfig={popperConfig}
                >
                  <NavLink
                    to="/createAccount"
                    className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                  >
                    Create Account
                  </NavLink>
                </OverlayTrigger>
              </li>
              <li className="nav-item">
                <OverlayTrigger
                  placement="bottom-start"
                  overlay={<Tooltip className="custom-tooltip">Deposit now, thank us later.</Tooltip>}
                  popperConfig={popperConfig}
                >
                  <NavLink
                    to="/deposit"
                    className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                  >
                    Deposit
                  </NavLink>
                </OverlayTrigger>
              </li>
              <li className="nav-item">
                <OverlayTrigger
                  placement="bottom-start"
                  overlay={<Tooltip className="custom-tooltip">Make your move. Execute the withdrawal.</Tooltip>}
                  popperConfig={popperConfig}
                >
                  <NavLink
                    to="/withdraw"
                    className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                  >
                    Withdraw
                  </NavLink>
                </OverlayTrigger>
              </li>
              <li className="nav-item">
                <OverlayTrigger
                  placement="bottom-start"
                  overlay={<Tooltip className="custom-tooltip">Keep tabs on all data.</Tooltip>}
                  popperConfig={popperConfig}
                >
                  <NavLink
                    to="/alldata"
                    className={({ isActive }) => `nav-link custom-link-color ${isActive ? 'active-nav-item' : ''}`}
                  >
                    All Data
                  </NavLink>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
