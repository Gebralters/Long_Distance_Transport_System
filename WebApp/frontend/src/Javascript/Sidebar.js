import React from 'react';

const Sidebar = ({ setActiveSection }) => {
  const handleMenuClick = (section) => {
    setActiveSection(section);

    const sections = document.querySelectorAll('main');
    sections.forEach(main => {
      if (main) {
        main.style.display = 'none';
      }
    });

    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      sectionElement.style.display = 'block';
    }

    if (section === 'messages') {
      filterMessages('admin');
    }
  };

  const filterMessages = (senderType) => {
    const adminMessagesSubMenu = document.getElementById('adminMessagesSubMenu');
    const passengerMessagesSubMenu = document.getElementById('passengerMessagesSubMenu');

    if (adminMessagesSubMenu && passengerMessagesSubMenu) {
      if (senderType === 'admin') {
        adminMessagesSubMenu.style.display = 'block';
        passengerMessagesSubMenu.style.display = 'none';
      } else if (senderType === 'passenger') {
        adminMessagesSubMenu.style.display = 'none';
        passengerMessagesSubMenu.style.display = 'block';
      }
    }
  };

  return (
    <section id="sidebar">
      <a href="#" className="brand">
        <i className='bx bxs-smile'></i>
        <span className="text">Driver</span>
      </a>
      <ul className="side-menu top">
        <li className="active" data-section="dashboard" onClick={() => handleMenuClick('dashboard')}>
          <a href="#">
            <i className='bx bxs-dashboard'></i>
            <span className="text">Dashboard</span>
          </a>
        </li>
        <li data-section="bookings" onClick={() => handleMenuClick('bookings')}>
          <a href="#">
            <i className='bx bxs-shopping-bag-alt'></i>
            <span className="text">Bookings</span>
          </a>
        </li>
        <li data-section="reports" onClick={() => handleMenuClick('reports')}>
          <a href="#">
            <i className='bx bxs-report'></i>
            <span className="text">Report Incident</span>
          </a>
        </li>
        <li data-section="messages" onClick={() => handleMenuClick('messages')}>
          <a href="#">
            <i className='bx bxs-message-dots'></i>
            <span className="text">Messages</span>
          </a>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
