import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="header-navigation">
      <Link to="/signin">Sign In</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
};

export default Navigation;