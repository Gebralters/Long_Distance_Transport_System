import React, { useState } from 'react';

const MyAccount = () => {
  const [userDetails, setUserDetails] = useState({
    name: "Mphaga Jr. Philelo",
    phone: "+27714035414",
    email: "mphagaphilelo@gmail.com"
  });

  const handleEdit = (field) => {
    const newValue = prompt(`Enter new value for ${field}:`, userDetails[field]);
    if (newValue) {
      setUserDetails({ ...userDetails, [field]: newValue });
    }
  };

  const handleChangeProfilePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('profileImage').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main id="myAccount" className="main-MyAccount">
      <div className="head-title">
        <div className="left">
          <h1>My Account</h1>
          <ul className="breadcrumb">
            <li><a href="#">Dashboard</a></li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li><a className="active" href="#">My Account</a></li>
          </ul>
        </div>
      </div>
      <div className="account-container">
        <div className="account-sidebar">
          <img src="image/people.png" className="profile-picture" id="profileImage" alt="Profile" />
          <input type="file" id="profileImageInput" style={{ display: 'none' }} onChange={handleChangeProfilePhoto} />
          <h3 id="accountName">{userDetails.name}</h3>
          <ul>
            <li className="active"><a href="#" data-section="accountDashboard">Dashboard</a></li>
            <li><a href="#" data-section="personalInfo">Personal Information</a></li>
            <li><a href="#" data-section="loginSecurity">Login & Security</a></li>
            <li><a href="#" data-section="addHomeAddress">Add home address</a></li>
            <li><a href="#" id="sidebarLogoutLink">Logout</a></li>
          </ul>
        </div>
        <div className="account-content">
          <h2>Welcome, <span id="welcomeName">{userDetails.name}</span></h2>
          <div id="accountDashboard" className="account-section">
            <p>Dashboard content goes here...</p>
          </div>
          <div id="personalInfo" className="account-section" style={{ display: 'none' }}>
            <h3>Personal Information</h3>
            <div className="personal-info-container">
              <div className="profile-photo">
                <img src="image/people.png" className="profile-picture" id="profileImage" alt="Profile" />
                <input type="file" id="profileImageInput" style={{ display: 'none' }} onChange={handleChangeProfilePhoto} />
                <p><a href="#" id="changeProfilePhoto" onClick={() => document.getElementById('profileImageInput').click()}>Add a profile photo so Admin and Customer can recognise you</a></p>
              </div>
              <div className="personal-info-details">
                <p><i className='bx bxs-user'></i> <span id="userName">{userDetails.name}</span> <a href="#" className="edit-btn" onClick={() => handleEdit('name')}>Edit</a></p>
                <p><i className='bx bxs-phone'></i> <span id="userPhone">{userDetails.phone}</span> <a href="#" className="edit-btn" onClick={() => handleEdit('phone')}>Edit</a></p>
                <p><i className='bx bxs-envelope'></i> <span id="userEmail">{userDetails.email}</span> <a href="#" className="edit-btn" onClick={() => handleEdit('email')}>Edit</a></p>
              </div>
            </div>
          </div>
          <div id="loginSecurity" className="account-section" style={{ display: 'none' }}>
            <h3>Login & Security</h3>
            <div className="login-security-container">
              <h3>Passkeys</h3>
              <a href="#" id="setupPasskeys" className="link">Set up your Passkeys</a>
              <p>Passkeys offer a seamless, highly-secure way to log in with just a touch or a glance.</p>
              <hr />
              <h3>Other login options</h3>
              <div className="login-option">
                <span><i className="fab fa-apple"></i> Apple</span> <a href="#" className="link social-link" data-platform="Apple">Link</a>
              </div>
              <div className="login-option">
                <span><i className="fab fa-google"></i> Google</span> <a href="#" className="link social-link" data-platform="Google">Link</a>
              </div>
              <div className="login-option">
                <span><i className="fab fa-facebook"></i> Facebook</span> <a href="#" className="link social-link" data-platform="Facebook">Link</a>
              </div>
              <p>Linking a social account allows you to sign in without using a phone. We will not use your social account for anything else without your permission.</p>
            </div>
          </div>
          <div id="addresses" className="account-section" style={{ display: 'none' }}>
            <h3>Addresses</h3>
            <p>Addresses content goes here...</p>
          </div>
          <div id="addHomeAddress" className="account-section" style={{ display: 'none' }}>
            <h3>Add Home Address</h3>
            <div className="search-location">
              <input type="text" placeholder="Search location" className="search-input" id="homeAddressInput" />
              <i className="fas fa-map-marker-alt" id="addHomeAddressBtn"></i>
            </div>
            <ul className="location-results" id="homeAddressList"></ul>
          </div>
          <div id="addWorkAddress" className="account-section" style={{ display: 'none' }}>
            <h3>Add Work Address</h3>
            <div className="search-location">
              <input type="text" placeholder="Search location" className="search-input" id="workAddressInput" />
              <i className="fas fa-map-marker-alt" id="addWorkAddressBtn"></i>
            </div>
            <ul className="location-results" id="workAddressList"></ul>
          </div>
          <div id="addPlace" className="account-section" style={{ display: 'none' }}>
            <h3>Add a Place</h3>
            <p>Add a place content goes here...</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyAccount;

