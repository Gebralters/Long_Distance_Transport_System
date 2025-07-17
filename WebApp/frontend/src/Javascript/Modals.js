import React from 'react';

const Modals = () => {
  return (
    <>
      {/* Success Modal */}
      <div id="successModal" className="modal">
        <div className="modal-content">
          <span className="close-btn">&times;</span>
          <p>You have successfully accepted this drive!</p>
        </div>
      </div>

      {/* Incident Report Success Modal */}
      <div id="reportSuccessModal" className="modal">
        <div className="modal-content">
          <span className="close-report-btn">&times;</span>
          <p id="reportSuccessMessage">Incident report successfully sent!</p>
        </div>
      </div>

      {/* Reply Modal */}
      <div id="replyModal" className="modal">
        <div className="modal-content">
          <span className="close-reply-btn">&times;</span>
          <h3 id="replySenderName">Messaging Inbox</h3>
          <p id="originalMessage"></p>
          <textarea id="reply-text" placeholder="Type your message here..."></textarea>
          <button id="sendReplyBtn" className="btn btn-primary">Send</button>
          <button id="quitReplyBtn" className="btn btn-danger">Quit</button>
        </div>
      </div>

      {/* Trip Details Modal */}
      <div id="tripDetailsModal" className="modal">
        <div className="modal-content">
          <span className="close-trip-details-btn">&times;</span>
          <h3>Trip Details</h3>
          <p id="tripDetails"></p>
          <button id="acceptTripBtn" className="btn btn-primary">Accept</button>
          <button id="quitTripDetailsBtn" className="btn btn-danger">Quit</button>
        </div>
      </div>

      {/* Ride Details Modal */}
      <div id="rideDetailsModal" className="modal">
        <div className="modal-content">
          <span className="close-ride-details-btn">&times;</span>
          <h3>Passenger Ride Details</h3>
          <p id="rideDetails"></p>
          <button id="quitRideDetailsBtn" className="btn btn-danger">Quit</button>
        </div>
      </div>

      {/* Reply Sent Modal */}
      <div id="replySentModal" className="modal">
        <div className="modal-content">
          <span className="close-reply-sent-btn">&times;</span>
          <p>Message sent successfully!</p>
        </div>
      </div>

      {/* Setup Passkey Modal */}
      <div id="setupPasskeyModal" className="modal">
        <div className="modal-content">
          <span className="close-setup-passkey-btn">&times;</span>
          <h3>Set Up Passkey</h3>
          <form id="setupPasskeyForm">
            <label htmlFor="newPasskey">Enter New Passkey:</label>
            <input type="password" id="newPasskey" name="newPasskey" required />
            <button type="submit" className="btn btn-primary">Save Passkey</button>
          </form>
        </div>
      </div>

      {/* Link Social Account Modal */}
      <div id="linkSocialAccountModal" className="modal">
        <div className="modal-content">
          <span className="close-link-social-account-btn">&times;</span>
          <h3>Link Social Account</h3>
          <p id="linkSocialAccountText">Link your social account</p>
          <button className="btn btn-primary" id="linkAccountBtn">Link Account</button>
        </div>
      </div>
    </>
  );
};

export default Modals;
