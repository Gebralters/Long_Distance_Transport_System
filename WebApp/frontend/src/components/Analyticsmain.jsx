import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CurveChart from '../Javascript/CurveChart';
import BarChart from '../Javascript/BarChart';
import PieChart from '../Javascript/PieChart';

function Analyticsmain() {
    // State to keep track of the current section to display
    const [currentSection, setCurrentSection] = useState('ana-activity');
    const [drating, setdrating] = useState([]);
    const [feeddata, setfeeddata] = useState([]);

    // Handler to change the current section
    const filterAnalytics = (sectionId) => {
        setCurrentSection(sectionId);
    };
    useEffect(() => {

        axios.get('http://localhost:8081/drating')
        .then(res => {
            const {data} =res;
            if(data.length>0)
            {
                setdrating(data);
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));
    }, []);


    useEffect(() => {

        axios.get('http://localhost:8081/getfeed')
        .then(res => {
            const {data} =res;
            if(data.length>0)
            {
                setfeeddata(data);
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));
    }, [feeddata]);
  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Analytics</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Analytics</a>
                        </li>
                        </ul>
                    </div>
                    <a href="#" className="btn-download">
                        <i className="bx bxs-cloud-download" />
                        <span className="text">Refresh</span>
                    </a>
                    </div>
                    <div className="manageusers-container">
                    <div className="menu">
                        <div className="analytics-dashboard">
                        <h1>Analytics Dashboard</h1>
                        <div className="analytics-opt">
                        <button
                                className={`ana-btn ${currentSection === 'ana-activity' ? 'active' : ''}`}
                                onClick={() => filterAnalytics('ana-activity')}
                            >
                                Activity
                            </button>
                            <button
                                className={`ana-btn ${currentSection === 'ana-feedback' ? 'active' : ''}`}
                                onClick={() => filterAnalytics('ana-feedback')}
                            >
                                Feedback
                            </button>
                            <button
                                className={`ana-btn ${currentSection === 'ana-revenue' ? 'active' : ''}`}
                                onClick={() => filterAnalytics('ana-revenue')}
                            >
                                Revenue
                            </button>
                            <button
                                className={`ana-btn ${currentSection === 'ana-accident' ? 'active' : ''}`}
                                onClick={() => filterAnalytics('ana-accident')}
                            >
                                Accident Reports
                            </button>
                        </div>
                        <div>
                        </div>
                        <div className="subsection" id="ana-activity" style={{ display: currentSection === 'ana-activity' ? 'block' : 'none' }}>
                            <CurveChart/>
                            <PieChart/>
                        </div>
                        <div className="subsection" id="ana-feedback" style={{ display: currentSection === 'ana-feedback' ? 'block' : 'none' }}>
                            <div class="metric" id="customerFeedback" >
                                <h2>Customer Feedback</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ride ID</th>
                                            <th>Date</th>
                                            <th>Rating</th>
                                            <th>Comments</th>
                                            <th>Customer ID</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    
                                        {feeddata.map((faq, index) => (
                                        <tr key={index}>
                                            <td>{faq.R_ID}</td>
                                            <td>{faq.RF_DATE}</td>
                                            <td>{faq.RF_RATING}</td>
                                            <td>{faq.RF_COMMENTS}</td>
                                            <td>{faq.C_ID}</td>
                                            
                                        </tr>
                                        ))}
                                    
                                    </tbody>
                                </table>
                            </div>
                            <div className="metric" id="accidentReports">
                            <h2>Driver Rating</h2>
                            <table>
                                <thead>
                                <tr>
                                   
                                    <th>Date</th>
                                    <th>Rating</th>
                                    <th>Comments</th>
                                    <th>Customer ID</th>
                                    <th>Driver ID</th>
                                </tr>
                                </thead>
                                <tbody>
                                {drating.map((faq, index) => (
                                  <tr key={index}>
                                    <td>{faq.DR_DATE}</td>
                                    <td>{faq.DR_RATING}</td>
                                    <td>{faq.DR_COMMENTS}</td>
                                    <td>{faq.C_ID}</td>
                                    <td>{faq.D_ID}</td>
                                  </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        <div className="subsection" id="ana-revenue" style={{ display: currentSection === 'ana-revenue' ? 'block' : 'none' }}>
                            <BarChart/>
                        </div>
                        <div className="subsection" id="ana-accident" style={{ display: currentSection === 'ana-accident' ? 'block' : 'none' }}>
                            <div className="metric" id="accidentReports">
                            <h2>Incident Reports</h2>
                            <table>
                                <thead>
                                <tr>
                                    <th>Incident ID</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Data will be inserted here by JavaScript */}
                                </tbody>
                            </table>
                            </div>
                            
                        </div>
                        </div>
                    </div>
                    </div>
    </div>
  )
}
export default Analyticsmain;