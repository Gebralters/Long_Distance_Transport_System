import React, { useState } from 'react';

const Bookings = () => {
  const [tripDetails, setTripDetails] = useState(null);

  const handleAcceptDrive = (trip) => {
    setTripDetails(trip);
    document.getElementById('tripDetailsModal').style.display = 'block';
  };

  const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
  };

  const acceptTrip = () => {
    document.getElementById('acceptTripBtn').innerText = 'Accepted';
    document.getElementById('acceptTripBtn').disabled = true;
    closeModal('tripDetailsModal');
    document.getElementById('successModal').style.display = 'block';
  };

  return (
    <main id="bookings" className="main-Bookings">
      <div className="head-title">
        <div className="left">
          <h1>Bookings</h1>
          <ul className="breadcrumb">
            <li><a href="#">Dashboard</a></li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li><a className="active" href="#">Bookings</a></li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Refresh</span>
        </a>
      </div>
      <div className="manageusers-container">
        <div className="menu"></div>
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
              <tr>
                <td>D001</td>
                <td>R001</td>
                <td>Johannesburg</td>
                <td>Polokwane</td>
                <td>
                  <button
                    className="accept-drive-btn"
                    onClick={() => handleAcceptDrive({
                      tripId: 'D001',
                      routeId: 'R001',
                      pickup: 'Johannesburg',
                      dropoff: 'Polokwane',
                      seats: 5,
                      price: 1000
                    })}
                  >
                    Accept
                  </button>
                </td>
              </tr>
              <tr>
                <td>D002</td>
                <td>R002</td>
                <td>Durban</td>
                <td>Cape Town</td>
                <td>
                  <button
                    className="accept-drive-btn"
                    onClick={() => handleAcceptDrive({
                      tripId: 'D002',
                      routeId: 'R002',
                      pickup: 'Durban',
                      dropoff: 'Cape Town',
                      seats: 3,
                      price: 1200
                    })}
                  >
                    Accept
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trip Details Modal */}
      <div id="tripDetailsModal" className="modal">
        <div className="modal-content">
          <span className="close-trip-details-btn" onClick={() => closeModal('tripDetailsModal')}>&times;</span>
          <h3>Trip Details</h3>
          {tripDetails && (
            <div id="tripDetails">
              <p>Trip ID: {tripDetails.tripId}</p>
              <p>Route ID: {tripDetails.routeId}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Pickup Location: {tripDetails.pickup}</p>
              <p>Drop-off Location: {tripDetails.dropoff}</p>
              <p>Available Seats: {tripDetails.seats}</p>
              <p>Price: R{tripDetails.price}</p>
            </div>
          )}
          <button id="acceptTripBtn" className="btn btn-primary" onClick={acceptTrip}>Accept</button>
          <button id="quitTripDetailsBtn" className="btn btn-danger" onClick={() => closeModal('tripDetailsModal')}>Quit</button>
        </div>
      </div>

      {/* Success Modal */}
      <div id="successModal" className="modal">
        <div className="modal-content">
          <span className="close-btn" onClick={() => closeModal('successModal')}>&times;</span>
          <p>You have successfully accepted this drive!</p>
        </div>
      </div>
    </main>
  );
};

export default Bookings;
