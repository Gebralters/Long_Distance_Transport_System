import React from 'react';

function Navbar() {
  const handleProfileClick = () => {
    document.querySelectorAll('main').forEach(main => {
      main.style.display = 'none';
    });
    document.getElementById('myAccount').style.display = 'block';
  };

  return (
    <nav>
      <i className='bx bx-menu'></i>
      <a href="#" className="nav-link"></a>
      <form id="searchForm">
        <div className="form-input">
          <input type="search" placeholder="Search..." id="searchInput" />
          <button type="submit" className="search-btn"><i className='bx bx-search'></i></button>
        </div>
      </form>
      <input type="checkbox" id="switch-mode" hidden />
      <label htmlFor="switch-mode" className="switch-mode"></label>
      <a href="#" className="notification">
        <i className='bx bxs-bell'></i>
        <span className="num">8</span>
      </a>
      <a href="#" className="profile" id="profileIcon" onClick={handleProfileClick}>
        <img src="image/people.png" alt="Profile" />
      </a>
    </nav>
  );
}

export default Navbar;
