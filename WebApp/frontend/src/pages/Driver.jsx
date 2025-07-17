import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Diverjs from '../Javascript/Diverjs';
import NotificationModal from '../components/NotificationModal ';
import MessageModal from '../components/MessageModal ';

const Driver = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [rideDetails, setRideDetails] = useState({});
  const [isRideDetailsModalOpen, setIsRideDetailsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rides, setRides] = useState([]);
  const [userId, setUserId] = useState(1); // Example user ID, replace with actual user ID logic
  const [activeSubMenu, setActiveSubMenu] = useState('adminMessagesSubMenu');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editFields, setEditFields] = useState({
    name: false,
    phone: false,
    email: false,
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [routeId, setRouteId] = useState('');
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchNotifications();
    fetchMessages();
    fetchBookings();
    fetchRides();
    fetchIncidents();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/getUserDetails/${userId}`);
      const user = response.data;
      setFormData({
        name: `${user.U_FIRSTNAME} ${user.U_SURNAME}`,
        phone: user.U_CONTACT,
        email: user.U_EMAIL,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/notifications/${userId}`);
      console.log('Notifications:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/messages/${userId}`);
      console.log('Messages:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8081/bookings');
      console.log('Bookings:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchRides = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/rides`);
      console.log('Rides:', response.data);
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:8081/incidents');
      console.log('Incidents:', response.data);
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const renderMessages = (senderType) => {
    return messages
      .filter(message => message.M_SENDER === senderType)
      .map((message, index) => (
        <tr key={index} onClick={() => { setSelectedMessage(message); setIsMessageModalOpen(true); }}>
          <td>{message.M_SENDER}</td>
          <td>{message.M_CONTENT}</td>
          <td><button className="inboxBtn">Reply</button></td>
        </tr>
      ));
  };

  const handleEditClick = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleSaveClick = async (field) => {
    setEditFields((prev) => ({ ...prev, [field]: false }));

    const updatedData = {
      firstName: formData.name.split(' ')[0],
      surname: formData.name.split(' ')[1],
      email: formData.email,
      contact: formData.phone,
    };

    try {
      const response = await axios.put(`/updateUserDetails/${userId}`, updatedData);
      console.log('Update response:', response.data);
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const profileIcon = document.getElementById('profileIcon');
    const handleProfileIconClick = () => {
      setActiveSection('myAccount');
    };

    if (profileIcon) {
      profileIcon.addEventListener('click', handleProfileIconClick);
    }

    return () => {
      if (profileIcon) {
        profileIcon.removeEventListener('click', handleProfileIconClick);
      }
    };
  }, []);

  const navigateToSection = (section) => {
    setActiveSection(section);
  };

  const navigateToMessages = (subMenu) => {
    setActiveSubMenu(subMenu);
    setActiveSection('messages');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/reportIncident', {
        routeId,
        description,
        intensity,
      });
      setSuccessMessage('Incident reported successfully');
      setRouteId('');
      setDescription('');
      setIntensity('');
      fetchIncidents(); // Fetch incidents after a successful report
    } catch (error) {
      console.error('Error reporting incident:', error);
    }
  };

  const handleBookingDetailsClick = (booking) => {
    setSelectedBooking(booking);
    setIsRideDetailsModalOpen(true);
  };

  const handleEditIncidentClick = (incident) => {
    setSelectedIncident(incident);
    setIsIncidentModalOpen(true);
  };

  const handleIncidentEdit = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8081/updateIncident/${id}`, selectedIncident);
      console.log('Incident updated:', response.data);
      setIsIncidentModalOpen(false);
      fetchIncidents();
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  const handleIncidentDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8081/deleteIncident/${id}`);
      console.log('Incident deleted:', response.data);
      fetchIncidents();
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  return (
    <div>
      <div className="admin-page">
        <div className="container-navbar">
          <div className="layer-1">
            <header>
              <h2 className="Logo"><span className="dark-text">Comfort</span>Cruize</h2>
              <nav className="navigation">
                <a href="#">Home</a>
                <a href="#" id="authLink">Logout</a>
              </nav>
            </header>
          </div>
        </div>
        <div className="container-navbar2">
          <section id="sidebar">
            <a href="#" className="brand">
              <i className="bx bxs-smile" />
              <span className="text">Driver</span>
            </a>
            <ul className="side-menu top">
              <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => navigateToSection('dashboard')}>
                <a href="#">
                  <i className="bx bxs-dashboard" />
                  <span className="text">Dashboard</span>
                </a>
              </li>
              <li className={activeSection === 'bookings' ? 'active' : ''} onClick={() => navigateToSection('bookings')}>
                <a href="#">
                  <i className="bx bxs-shopping-bag-alt" />
                  <span className="text">Bookings</span>
                </a>
              </li>
              <li className={activeSection === 'reports' ? 'active' : ''} onClick={() => navigateToSection('reports')}>
                <a href="#">
                  <i className="bx bxs-report" />
                  <span className="text">Report Incident</span>
                </a>
              </li>
              <li className={activeSection === 'messages' ? 'active' : ''} onClick={() => navigateToSection('messages')}>
                <a href="#">
                  <i className="bx bxs-message-dots" />
                  <span className="text">Messages</span>
                </a>
              </li>
            </ul>
          </section>
          <section id="content">
            <nav>
              <i className="bx bx-menu" />
              <a href="#" className="nav-link" />
              <form id="searchForm">
                <div className="form-input">
                  <input type="search" placeholder="Search..." id="searchInput" />
                  <button type="submit" className="search-btn"><i className="bx bx-search" /></button>
                </div>
              </form>
              <input type="checkbox" id="switch-mode" hidden />
              <label htmlFor="switch-mode" className="switch-mode" />
              <a href="#" className="notification" id="notificationIcon" onClick={() => setIsNotificationModalOpen(true)}>
                <i className="bx bxs-bell" />
                <span className="num">{notifications.length}</span>
              </a>
              <a href="#" className="profile" id="profileIcon">
                <img src="asserts/DriverAsserts/image/people.png" alt="Profile" />
              </a>
            </nav>
            {activeSection === 'dashboard' && (
              <main className="main-dashboard" id="dashboard">
                <div className="head-title">
                  <div className="left">
                    <h1>Dashboard</h1>
                    <ul className="breadcrumb">
                      <li>
                        <a href="#">Dashboard</a>
                      </li>
                      <li><i className="bx bx-chevron-right" /></li>
                      <li>
                        <a className="active" href="#">Home</a>
                      </li>
                    </ul>
                  </div>
                  <a href="#" className="btn-download" id="refreshButton">
                    <i className="bx bxs-cloud-download" />
                    <span className="text">Refresh</span>
                  </a>
                </div>
                <div className="table-data">
                  <div className="order">
                    <div className="head">
                      <h3>Rides</h3>
                      <i className="bx bx-search" />
                      <i className="bx bx-filter" />
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Passenger</th>
                          <th>Date of Ride</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rides.length ? (
                          rides.map((ride, index) => (
                            <tr className="ride-row" key={index} data-passenger={ride.passenger} data-date={ride.R_DATE} data-status={ride.R_STATUS} data-pickup={ride.pickup} data-dropoff={ride.dropoff} data-price={ride.price} data-booking-id={ride.bookingId}>
                              <td>
                                <img src="asserts/DriverAsserts/image/people.png" alt="Passenger" />
                                <p>{ride.passenger}</p>
                              </td>
                              <td>{ride.R_DATE}</td>
                              <td><span className={`status ${ride.R_STATUS.toLowerCase()}`}>{ride.R_STATUS}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No rides available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="todo">
                    <div className="head">
                      <h3>Messages</h3>
                      <i className="bx bx-plus" />
                      <i className="bx bx-filter" />
                    </div>
                    <ul className="todo-list">
                      <li className="not-completed" onClick={() => navigateToMessages('adminMessagesSubMenu')}>
                        <p>Message from Admin</p>
                        <i className="bx bx-dots-vertical-rounded" />
                      </li>
                      <li className="completed" onClick={() => navigateToMessages('passengerMessagesSubMenu')}>
                        <p>Message from Passenger</p>
                        <i className="bx bx-dots-vertical-rounded" />
                      </li>
                    </ul>
                  </div>
                </div>
              </main>
            )}
            {activeSection === 'bookings' && (
              <main id="bookings" className="main-Bookings">
                <div className="head-title">
                  <div className="left">
                    <h1>Bookings</h1>
                    <ul className="breadcrumb">
                      <li>
                        <a href="#">Dashboard</a>
                      </li>
                      <li><i className="bx bx-chevron-right" /></li>
                      <li>
                        <a className="active" href="#">Bookings</a>
                      </li>
                    </ul>
                  </div>
                  <a href="#" className="btn-download">
                    <i className="bx bxs-cloud-download" />
                    <span className="text">Refresh</span>
                  </a>
                </div>
                <div className="manageusers-container">
                  <div className="menu">
                    {/*<button class="menu-btn active">Accept Drive</button> */}
                  </div>
                  <div className="booking-list">
                    <table className="Booking-table">
                      <thead>
                        <tr>
                          <th>Trip ID</th>
                          <th>Route ID</th>
                          <th>Pickup Location</th>
                          <th>Drop-off Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(bookings) && bookings.length > 0 ? (
                          bookings.map((booking, index) => (
                            <tr key={index}>
                              <td>{booking.B_ID}</td>
                              <td>{booking.RO_ID}</td>
                              <td>{booking.B_PICKUPLOCATION}</td>
                              <td>{booking.B_DESTLOCATION}</td>
                              <td>
                                <button className="accept-drive-btn" onClick={() => handleBookingDetailsClick(booking)}>Details</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No bookings available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </main>
            )}
            {activeSection === 'reports' && (
              <main id="reports" className="main-Reports">
                <div className="head-title">
                  <div className="left">
                    <h1>Report Incident</h1>
                    <ul className="breadcrumb">
                      <li>
                        <a href="#">Dashboard</a>
                      </li>
                      <li><i className="bx bx-chevron-right" /></li>
                      <li>
                        <a className="active" href="#">Report Incident</a>
                      </li>
                    </ul>
                  </div>
                  <a href="#" className="btn-download">
                    <i className="bx bxs-cloud-download" />
                    <span className="text">Refresh</span>
                  </a>
                </div>
                <div className="report-incident-container">
                  <form id="incidentForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input type="text" id="route-id" name="route-id" placeholder="Route ID" value={routeId} onChange={(e) => setRouteId(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <textarea id="description" name="description" rows="4" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>
                    <div className="input-group">
                      <input type="text" id="intensity" name="intensity" placeholder="Intensity" value={intensity} onChange={(e) => setIntensity(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-btn">Submit Report</button>
                  </form>
                  {successMessage && <p>{successMessage}</p>}
                  <div className="incidents-list">
                    <table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Intensity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incidents.map((incident, index) => (
                          <tr key={index}>
                            <td>{incident.CINC_DESCRIP}</td>
                            <td>{incident.CINC_DATE}</td>
                            <td>{incident.CINC_INTENSITY}</td>
                            <td>
                              <button onClick={() => handleEditIncidentClick(incident)}>Edit</button>
                              <button onClick={() => handleIncidentDelete(incident.CINC_ID)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </main>
            )}
            {activeSection === 'messages' && (
              <main id="messages" className="main-Messages">
                <div className="head-title">
                  <div className="left">
                    <h1>Messages</h1>
                    <ul className="breadcrumb">
                      <li>
                        <a href="#">Dashboard</a>
                      </li>
                      <li><i className="bx bx-chevron-right" /></li>
                      <li>
                        <a className="active" href="#">Messages</a>
                      </li>
                    </ul>
                  </div>
                  <a href="#" className="btn-download" id="refreshButton">
                    <i className="bx bxs-cloud-download" />
                    <span className="text">Refresh</span>
                  </a>
                </div>
                <div className="messages-container">
                  <div className="menu">
                    <button
                      className={`menuinbox-btn ${activeSubMenu === 'adminMessagesSubMenu' ? 'active' : ''}`}
                      onClick={() => setActiveSubMenu('adminMessagesSubMenu')}
                    >
                      Admin
                    </button>
                    <button
                      className={`menuinbox-btn ${activeSubMenu === 'passengerMessagesSubMenu' ? 'active' : ''}`}
                      onClick={() => setActiveSubMenu('passengerMessagesSubMenu')}
                    >
                      Passengers
                    </button>
                  </div>
                  <div id="adminMessagesSubMenu" className="submenu" style={{ display: activeSubMenu === 'adminMessagesSubMenu' ? 'block' : 'none' }}>
                    <table className="Inbox-table">
                      <thead>
                        <tr>
                          <th>Admin Name</th>
                          <th>Message</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderMessages('admin')}
                      </tbody>
                    </table>
                  </div>
                  <div id="passengerMessagesSubMenu" className="submenu" style={{ display: activeSubMenu === 'passengerMessagesSubMenu' ? 'block' : 'none' }}>
                    <table className="Inbox-table">
                      <thead>
                        <tr>
                          <th>Passenger Name</th>
                          <th>Message</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderMessages('passenger')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </main>
            )}
            {activeSection === 'myAccount' && (
              <main id="myAccount" className="main-MyAccount">
                <div className="head-title">
                  <div className="left">
                    <h1>My Account</h1>
                    <ul className="breadcrumb">
                      <li>
                        <a href="#">Dashboard</a>
                      </li>
                      <li><i className="bx bx-chevron-right" /></li>
                      <li>
                        <a className="active" href="#">My Account</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="account-container">
                  <div className="account-sidebar">
                    <img src="asserts/DriverAsserts/image/people.png" className="profile-picture" id="profileImage" alt="Profile" />
                    <input type="file" id="profileImageInput" style={{ display: 'none' }} />
                    <h3 id="accountName">{formData.name}</h3>
                    <ul>
                      <li className="active"><a href="#" data-section="accountDashboard">Dashboard</a></li>
                      <li><a href="#" data-section="personalInfo">Personal Information</a></li>
                      <li><a href="#" id="sidebarLogoutLink">Logout</a></li>
                    </ul>
                  </div>
                  <div className="account-content">
                    <h2>Welcome, <span id="welcomeName">{formData.name}</span></h2>
                    <div id="accountDashboard" className="account-section">
                      <p>Dashboard content goes here...</p>
                    </div>
                    <div id="personalInfo" className="account-section">
                      <h3>Personal Information</h3>
                      <div className="personal-info-container">
                        <div className="profile-photo">
                          <img src="asserts/DriverAsserts/image/people.png" className="profile-picture" id="personalProfileImage" alt="Profile" />
                          <input type="file" id="profileImageInput" style={{ display: 'none' }} />
                          <p><a href="#" id="changeProfilePhoto">Add a profile photo so Admin and Customer can recognise you</a></p>
                        </div>
                        <div className="personal-info-details">
                          <p>
                            <i className="bx bxs-user" />
                            {editFields.name ? (
                              <>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                />
                                <button onClick={() => handleSaveClick('name')}>Save</button>
                              </>
                            ) : (
                              <>
                                <span id="userName">{formData.name}</span>
                                <a href="#" className="edit-btn" onClick={() => handleEditClick('name')}>Edit</a>
                              </>
                            )}
                          </p>
                          <p>
                            <i className="bx bxs-phone" />
                            {editFields.phone ? (
                              <>
                                <input
                                  type="text"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                />
                                <button onClick={() => handleSaveClick('phone')}>Save</button>
                              </>
                            ) : (
                              <>
                                <span id="userPhone">{formData.phone}</span>
                                <a href="#" className="edit-btn" onClick={() => handleEditClick('phone')}>Edit</a>
                              </>
                            )}
                          </p>
                          <p>
                            <i className="bx bxs-envelope" />
                            {editFields.email ? (
                              <>
                                <input
                                  type="text"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                />
                                <button onClick={() => handleSaveClick('email')}>Save</button>
                              </>
                            ) : (
                              <>
                                <span id="userEmail">{formData.email}</span>
                                <a href="#" className="edit-btn" onClick={() => handleEditClick('email')}>Edit</a>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div id="loginSecurity" className="account-section" style={{ display: 'none' }}>
                      <h3>Login &amp; Security</h3>
                      <div className="login-security-container">
                        <h3>Passkeys</h3>
                        <a href="#" id="setupPasskeys" className="link">Set up your Passkeys</a>
                        <p>Passkeys offer a seamless, highly-secure way to log in with just a touch or a glance.</p>
                        <hr />
                        <h3>Other login options</h3>
                        <div className="login-option">
                          <span><i className="fab fa-apple" /> Apple</span> <a href="#" className="link social-link" data-platform="Apple">Link</a>
                        </div>
                        <div className="login-option">
                          <span><i className="fab fa-google" /> Google</span> <a href="#" className="link social-link" data-platform="Google">Link</a>
                        </div>
                        <div class="login-option">
                          <span><i class="fab fa-facebook" /> Facebook</span> <a href="#" class="link social-link" data-platform="Facebook">Link</a>
                        </div>
                        <div class="login-option">
                          <span><i class="fab fa-twitter" /> Twitter</span> <a href="#" class="link social-link" data-platform="Twitter">Link</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            )}
            <div id="rideDetailsModal" className="modal" style={{ display: isRideDetailsModalOpen ? 'block' : 'none' }}>
              <div className="modal-content">
                <span className="close-ride-details-btn" onClick={() => setIsRideDetailsModalOpen(false)}>&times;</span>
                <h3>Booking Details</h3>
                {selectedBooking && (
                  <>
                    <p>Trip ID: {selectedBooking.B_ID}</p>
                    <p>Route ID: {selectedBooking.RO_ID}</p>
                    <p>Pickup Location: {selectedBooking.B_PICKUPLOCATION}</p>
                    <p>Drop-off Location: {selectedBooking.B_DESTLOCATION}</p>
                    <p>Status: {selectedBooking.B_STATUS}</p>
                    <p>Number of Bookings: {selectedBooking.B_NUMBOOKING}</p>
                    <p>Booking Type: {selectedBooking.B_TYPE}</p>
                  </>
                )}
                <button id="quitRideDetailsBtn" className="btn btn-danger" onClick={() => setIsRideDetailsModalOpen(false)}>Close</button>
              </div>
            </div>
            <div id="incidentEditModal" className="modal" style={{ display: isIncidentModalOpen ? 'block' : 'none' }}>
              <div className="modal-content">
                <span className="close-incident-edit-btn" onClick={() => setIsIncidentModalOpen(false)}>&times;</span>
                <h3>Edit Incident</h3>
                {selectedIncident && (
                  <form onSubmit={() => handleIncidentEdit(selectedIncident.CINC_ID)}>
                    <div className="input-group">
                      <input
                        type="text"
                        name="routeId"
                        value={selectedIncident.routeId}
                        onChange={(e) => setSelectedIncident({ ...selectedIncident, routeId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <textarea
                        name="description"
                        rows="4"
                        value={selectedIncident.description}
                        onChange={(e) => setSelectedIncident({ ...selectedIncident, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        name="intensity"
                        value={selectedIncident.intensity}
                        onChange={(e) => setSelectedIncident({ ...selectedIncident, intensity: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </form>
                )}
                <button className="btn btn-danger" onClick={() => setIsIncidentModalOpen(false)}>Close</button>
              </div>
            </div>
            <NotificationModal 
              notifications={notifications} 
              isOpen={isNotificationModalOpen} 
              onClose={() => setIsNotificationModalOpen(false)} 
            />
            <MessageModal
              message={selectedMessage}
              isOpen={isMessageModalOpen}
              onClose={() => setIsMessageModalOpen(false)}
            />
            <div id="replySentModal" className="modal">
              <div className="modal-content">
                <span className="close-reply-sent-btn">&times;</span>
                <h3>Reply Sent</h3>
                <p>Your reply has been sent successfully!</p>
                <button id="closeReplySentModalBtn" className="btn btn-primary">Close</button>
              </div>
            </div>
            <div id="reportSuccessModal" className="modal">
              <div className="modal-content">
                <span className="close-report-btn">&times;</span>
                <h3>Incident Reported</h3>
                <p id="reportSuccessMessage">You have successfully reported the incident of route ID</p>
                <button id="closeReportModalBtn" className="btn btn-primary">Close</button>
              </div>
            </div>
            <div id="successModal" className="modal">
              <div className="modal-content">
                <span className="close-btn">&times;</span>
                <h3>Success</h3>
                <p>Your action was successful!</p>
              </div>
            </div>
            <Diverjs activeSubMenu={activeSubMenu} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Driver;
