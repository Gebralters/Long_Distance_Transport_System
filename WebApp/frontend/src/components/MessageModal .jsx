import React, { useState } from 'react';

const MessageModal = ({ message, isOpen, onClose, onSendReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    // Add logic to send reply
    onSendReply(message.M_ID, replyText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h3>Reply to Message</h3>
        <p>Sender: {message.M_SENDER}</p>
        <p>Message: {message.M_CONTENT}</p>
        <textarea 
          value={replyText} 
          onChange={(e) => setReplyText(e.target.value)} 
          placeholder="Type your reply here..." 
        />
        <button onClick={handleSendReply} className="btn btn-primary">Send Reply</button>
        <button onClick={onClose} className="btn btn-danger">Close</button>
      </div>
    </div>
  );
};

export default MessageModal;


