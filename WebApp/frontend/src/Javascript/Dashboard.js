import React from 'react';

const Dashboard = () => {
  return (
    <main id="dashboard" className="main-dashboard">
      <div className="head-title">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li><a href="#">Dashboard</a></li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li><a className="active" href="#">Home</a></li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Refresh</span>
        </a>
      </div>
      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Upcoming Rides</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
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
              <tr>
                <td><img src="image/people.png" alt="Passenger" /><p>Ndou Mpho</p></td>
                <td>05-21-2023</td>
                <td><span className="status pending">Pending</span></td>
              </tr>
              <tr>
                <td><img src="image/people.png" alt="Passenger" /><p>Ragophala Pascal</p></td>
                <td>05-21-2023</td>
                <td><span className="status process">Process</span></td>
              </tr>
              <tr>
                <td><img src="image/people.png" alt="Passenger" /><p>Jane Doe</p></td>
                <td>05-21-2023</td>
                <td><span className="status completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="todo">
          <div className="head">
            <h3>Messages</h3>
            <i className='bx bx-plus'></i>
            <i className='bx bx-filter'></i>
          </div>
          <ul className="todo-list">
            <li className="not-completed">
              <p>Message from Admin</p>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
            <li className="completed">
              <p>Message from Passenger</p>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
