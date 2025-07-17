import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashmain() {
    const [alluserdata, setalluserdata]=useState([]);
    const [ridesdata, setridedata]=useState([]);
    const [driversdata, setdriversdata]=useState([]);
    const [paydata, setpaydata]=useState([]);


   function calcrevenue()
   {
       if(paydata.length>0)
       {
        let revenue=0;
        console.log(revenue);
          for (let i = 0; i < paydata.length; i++) {
             revenue+=paydata[i].PAY_AMOUNT;
          }
          console.log(revenue);
          return revenue;
       }
       else
       {
          return 0;
       }
   }
    useEffect(() => {
        axios.get('http://localhost:8081/getallusers')
        .then(res => {
            const {data} =res;
            console.log('Server response data:', data); // Log the data to check the structure
            setalluserdata(data);
        })
        .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8081/getcompleterides')
        .then(res => {
            const {data} =res;
            console.log('Server response data dashboard:', data); // Log the data to check the structure
            setridedata(data);
        })
        .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8081/getactivedriver')
        .then(res => {
            const {data} =res;
            console.log('Server response data dashboard:', data); // Log the data to check the structure
            setdriversdata(data);
        })
        .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8081/getpaydata')
        .then(res => {
            const {data} =res;
            
            setpaydata(data);
        })
        .catch(err => console.log(err));
    }, []);
    


  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Dashboard</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Home</a>
                        </li>
                        </ul>
                    </div>
                    <a href="#" className="btn-download">
                        <i className="bx bxs-cloud-download" />
                        <span className="text">Refresh</span>
                    </a>
                    </div>
                    <ul className="box-info">
                    <li>
                        <i className="bx bxs-calendar-check" />
                        <span className="text">
                       
                        <h3>{ridesdata.length}</h3>
                        
                        <p>Complete Rides</p>
                        </span>
                    </li>
                    <li>
                        <i className="bx bxs-group" />
                        <span className="text">
                        <h3>{alluserdata.length}</h3>
                        <p>Users</p>
                        </span>
                    </li>
                    <li>
                        <i className="bx bxs-dollar-circle" />
                        <span className="text">
                        <h3>R{calcrevenue()}</h3>
                        <p>Total Revenue</p>
                        </span>
                    </li>
                    </ul>
                    <div className="table-data">
                    <div className="order">
                        <div className="head">
                        <h3>Recent Rides</h3>
                        <i className="bx bx-search" />
                        <i className="bx bx-filter" />
                        </div>
                        <table>
                        <thead>
                            <tr>
                            <th>Ride ID</th>
                            
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {ridesdata.map((faq, index) => (
                            <tr key={index}>
                                <td>
                                    <p>#{faq.R_ID}</p>
                                </td>
                               
                                <td><span className="status completed">{faq.R_STATUS}</span></td>
                            </tr>
                        ))}
                            
                        </tbody>
                        </table>
                    </div>
                    <div className="todo">
                        <div className="head">
                        <h3>Active Drivers</h3>
                        <i className="bx bx-plus" />
                        <i className="bx bx-filter" />
                        </div>
                        <ul className="todo-list">
                        {driversdata.map((faq, index) => (
                            <li key={index} className="completed">
                                <img src={faq.DP_PICURL} />
                                <p>{faq.U_FIRSTNAME} {faq.U_SURNAME}</p>
                                <i className="bx bx-dots-vertical-rounded" />
                            </li>
                        ))}
                       
                        </ul>
                    </div>
                    </div>
    </div>
  )
}
export default Dashmain;