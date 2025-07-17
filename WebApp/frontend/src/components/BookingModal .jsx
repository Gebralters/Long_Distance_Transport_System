import React from 'react';

const BookingModal = ({ booking, isOpen, onClose }) => {
  const handleAcceptBooking = () => {
    // Add logic to accept booking
    console.log('Booking accepted:', booking);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h3>Booking Details</h3>
        <p>Trip ID: {booking.tripId}</p>
        <p>Route ID: {booking.routeId}</p>
        <p>Pickup Location: {booking.pickupLocation}</p>
        <p>Drop-off Location: {booking.dropoffLocation}</p>
        <p>Seats: {booking.seats}</p>
        <p>Status: {booking.status}</p>
        <p>Price: {booking.price}</p>
        <button onClick={handleAcceptBooking} className="btn btn-primary">Accept Booking</button>
        <button onClick={onClose} className="btn btn-danger">Close</button>
      </div>
    </div>
  );
};

export default BookingModal;
