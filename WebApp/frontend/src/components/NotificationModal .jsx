import React from 'react';

const NotificationModal = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h3>Notifications</h3>
        <ul className="notification-list">
          {notifications.map((notification, index) => (
            <li key={index} className="notification-item">
              <div>
                <span><strong>{notification.NOT_TYPE}</strong></span>
                <span>{notification.NOT_CONTENT}</span>
              </div>
              <span>{new Date(notification.NOT_TIMESTAMP).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationModal;
