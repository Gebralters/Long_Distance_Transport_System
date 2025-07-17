import React, { useState } from 'react';

const Messages = () => {
  const [replyDetails, setReplyDetails] = useState(null);
  const [adminMessages, setAdminMessages] = useState([
    { name: 'Simon Maputla', message: 'Do not forget to take the car to service on Thursday' },
    { name: 'Phil Foden', message: 'Today you will be communicating with me' }
  ]);
  const [passengerMessages, setPassengerMessages] = useState([
    { name: 'Mphaga Philelo', message: 'When you arrive, please park on the sideway of the road' },
    { name: 'Ndou Mpho', message: 'Please wait 5 minutes for me, I have a toilet emergency' }
  ]);
  const [showAdminMessages, setShowAdminMessages] = useState(true);

  const handleReplyClick = (sender, message) => {
    setReplyDetails({ sender, message });
    document.getElementById('replyModal').style.display = 'block';
  };

  const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
  };

  const filterMessages = (senderType) => {
    setShowAdminMessages(senderType === 'admin');
  };

  return (
    <main id="messages" className="main-Messages">
      <div className="head-title">
        <div className="left">
          <h1>Messages</h1>
          <ul className="breadcrumb">
            <li><a href="#">Dashboard</a></li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li><a className="active" href="#">Messages</a></li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Refresh</span>
        </a>
      </div>
      <div className="messages-container">
        <div className="menu">
          <button className="menuinbox-btn" onClick={() => filterMessages('admin')}>Admin</button>
          <button className="menuinbox-btn" onClick={() => filterMessages('passenger')}>Passengers</button>
        </div>
        <div id="adminMessagesSubMenu" className="submenu" style={{ display: showAdminMessages ? 'block' : 'none' }}>
          <table className="Inbox-table">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminMessages.map((msg, index) => (
                <tr key={index}>
                  <td>{msg.name}</td>
                  <td>{msg.message}</td>
                  <td>
                    <button
                      className="inboxBtn"
                      onClick={() => handleReplyClick(msg.name, msg.message)}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="passengerMessagesSubMenu" className="submenu" style={{ display: showAdminMessages ? 'none' : 'block' }}>
          <table className="Inbox-table">
            <thead>
              <tr>
                <th>Passenger Name</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengerMessages.map((msg, index) => (
                <tr key={index}>
                  <td>{msg.name}</td>
                  <td>{msg.message}</td>
                  <td>
                    <button
                      className="inboxBtn"
                      onClick={() => handleReplyClick(msg.name, msg.message)}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      <div id="replyModal" className="modal">
        <div className="modal-content">
          <span className="close-reply-btn" onClick={() => closeModal('replyModal')}>&times;</span>
          <h3 id="replySenderName">Messaging Inbox</h3>
          {replyDetails && (
            <div>
              <p id="originalMessage">Original Message: {replyDetails.message}</p>
              <textarea id="reply-text" placeholder="Type your message here..."></textarea>
              <button id="sendReplyBtn" className="btn btn-primary">Send</button>
              <button id="quitReplyBtn" className="btn btn-danger" onClick={() => closeModal('replyModal')}>Quit</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Messages;