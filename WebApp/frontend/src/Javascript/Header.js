import React from 'react';

const Header = ({ onProfileClick }) => {
  return (
    <header>
      <h2 className="Logo"><span className="dark-text">Comfort</span>Cruize</h2>
      <nav className="navigation">
        <a href="#">Home</a>
        <a href="#" id="authLink">Logout</a>
        <a href="#" className="profile" id="profileIcon" onClick={onProfileClick}>
          <img src="image/people.png" alt="Profile" />
        </a>
      </nav>
    </header>
  );
};

export default Header;
