import React, { useState } from 'react';
import axios from 'axios';

const ReportIncident = () => {
  const [routeId, setRouteId] = useState('');
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState(1); // Default intensity value
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/reportIncident', {
        description,
        intensity,
      });
      console.log(response.data);
      setSuccessMessage('Incident reported successfully');
      setRouteId('');
      setDescription('');
    } catch (error) {
      console.error('Error reporting incident:', error);
      setSuccessMessage('Failed to report incident');
    }
  };

  return (
    <div className="report-incident-container">
      <form id="incidentForm" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="route-id"
            name="route-id"
            placeholder="Route ID"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="input-group">
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            required
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Submit Report</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default ReportIncident;
