import React, { useState } from 'react';

const Reports = () => {
  const [reportDetails, setReportDetails] = useState({ routeId: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById('reportSuccessModal').style.display = 'block';
    document.getElementById('reportSuccessMessage').textContent = `You have successfully reported the incident of route ID ${reportDetails.routeId}`;
    setReportDetails({ routeId: '', description: '' });
  };

  const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
  };

  return (
    <main id="reports" className="main-Reports">
      <div className="head-title">
        <div className="left">
          <h1>Report Incident</h1>
          <ul className="breadcrumb">
            <li><a href="#">Dashboard</a></li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li><a className="active" href="#">Report Incident</a></li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Refresh</span>
        </a>
      </div>
      <div className="report-container">
        <form id="incidentForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="route-id">Route ID:</label>
            <input
              type="text"
              id="route-id"
              name="route-id"
              value={reportDetails.routeId}
              onChange={(e) => setReportDetails({ ...reportDetails, routeId: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={reportDetails.description}
              onChange={(e) => setReportDetails({ ...reportDetails, description: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn">Submit Report</button>
        </form>
      </div>

      {/* Report Success Modal */}
      <div id="reportSuccessModal" className="modal">
        <div className="modal-content">
          <span className="close-report-btn" onClick={() => closeModal('reportSuccessModal')}>&times;</span>
          <p id="reportSuccessMessage">Incident report successfully sent!</p>
        </div>
      </div>
    </main>
  );
};

export default Reports;

