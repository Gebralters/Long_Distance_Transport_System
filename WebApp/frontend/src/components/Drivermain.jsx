import React, { useEffect,useState } from 'react';
import axios from 'axios';

function Drivermain({ faq }) {
     const [assignid,setassignid]=useState('');
     const [pagerefresh,setrefresh]=useState('');

     const [profiledata,setprofiledata]=useState([]);
     const [driversdata,setdriversdata]=useState([]);
     const [usertypedata,setusertypedata]=useState([]);
     const [ddata,setddata]=useState([]);
     const [did,setdid]=useState('');

     
    function Assign(e)
    {
        e.preventDefault(); 
       let id=did;
        axios.put('http://localhost:8081/editvid',{assignid,id})
        .then(res => {
            const {data} =res;
            console.log('Server response data:', data); // Log the data to check the structure
            const {use}=data;
            if(use.status==='Updated')
            {
            console.log('Success');
            }
            else{
                console.log('Failed');
            }
        })
        .catch(err => console.log(err));

    }
    function refresh(e)
    {
        e.preventDefault(); 
        setrefresh('changed');
    }
    const  Assignvehicle= (id) => {
        axios.get('http://localhost:8081/getdriverbyid',{params:{id}})
        .then(res => {
            const {data} =res;
            const use=data[0];
            if(data.length>0)
            {
                
                setddata(data);
                setdid(use.D_ID)
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));
       

    };
    const downloadImage = (url, filename) => {
        // Create an anchor element
        const link = document.createElement('a');
        // Set the href attribute to the image URL
        link.href = url;
        // Set the download attribute with a default file name
        link.download = filename || 'downloaded-image';
        // Append the anchor to the body
        document.body.appendChild(link);
        // Programmatically click the anchor
        link.click();
        // Remove the anchor from the document
        document.body.removeChild(link);
      };
    
      const Viewid = (url) => {
        
        downloadImage(url, 'ID-image');
      };
      const ViewLic = (url) => {
        downloadImage(url, 'License-image');
      };
    const  Verify= (id) => {
       
        let status='Verified'
        axios.put('http://localhost:8081/editverify',{status,did})
        .then(res => {
            const {data} =res;
            console.log('Server response data:', data); // Log the data to check the structure
            const {use}=data;
            if(use.status==='Updated')
            {
            console.log('Success');
            }
            else{
                console.log('Failed');
            }
        })
        .catch(err => console.log(err));


    };
   useEffect(() => {
       let id=1;
        axios.get('http://localhost:8081/getdriverbytype',{params:{id}})
            .then(res => {
                const {data} =res;
                if(data.length>0)
                {
                    console.log('Server response data what is wanna:', data);
                    setusertypedata(data);
                }
                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));
    }, [pagerefresh]);
    useEffect(() => {
        axios.get('http://localhost:8081/getdriverprofile')
        .then(res => {
            const {data} =res;
            if(data.length>0)
            {
                setprofiledata(data)
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));
    }, [pagerefresh]);
    useEffect(() => {
        axios.get('http://localhost:8081/getdriverprofileinfo')
        .then(res => {
            const {data} =res;
            if(data.length>0)
            {
                console.log('Server response data what is wanna driver:', data);
                setprofiledata(data);
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));
    }, [pagerefresh]);
    
    useEffect(() => {

        // Select the elements from the DOM
        const assignPopup = document.getElementById('assignPopup');
        const assignButton = document.querySelectorAll('.assign-btn');
        

        const handleAssSlotClick = () => {
            if (assignPopup) {
                assignPopup.style.display = 'flex';
            }
        };

        const handleCloseClick = () => {
            if (assignPopup) {
                assignPopup.style.display = 'none';
            } 
        };

        const handleWindowClick = (event) => {
            if (event.target === assignPopup) {
                assignPopup.style.display = 'none';
            }
            
        };
        // Add event listeners
        assignButton.forEach(button => {
            button.addEventListener('click', handleAssSlotClick);
        });
        window.addEventListener('click', handleWindowClick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            assignButton.forEach(button => {
                button.removeEventListener('click', handleAssSlotClick);
            });

            
            window.removeEventListener('click', handleWindowClick);
        };

    }, [pagerefresh]);
    function formatDate(dateString) {
        // Create a new Date object from the dateString
        const date = new Date(dateString);
    
        // Get the individual components of the date
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        // Format the date without the 'T', milliseconds, and 'Z'
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
        return formattedDate;
    }
  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Drivers</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Drivers</a>
                        </li>
                        </ul>
                    </div>
                    <a href="#" className="btn-download">
                        <i className="bx bxs-cloud-download" />
                        <span onClick={refresh} className="text">Refresh</span>
                    </a>
                    </div>
                    <div className="managedrivers-container">
                   
                    <div  className="menu">
                    {profiledata.map((faq, index) => (
                        <div key={index} className="driver-container">
                            <div  className="d-image">
                                <img src={faq.DP_PICURL} />
                            </div>
                            <div className="d-info">
                                <p>Full Names: <span>{faq.U_FIRSTNAME} </span></p>
                                <p>Surname:          <span>{faq.U_SURNAME}</span></p>
                                <p>Email:            <span>{faq.U_EMAIL}</span></p>
                                <p>Registration Date: <span>{formatDate(faq.U_REGDATE)}</span></p>
                            
                                <p>Verification Status:<span>{faq.D_STATUS}</span></p>
                            

                                {driversdata.filter(faq1 => faq1.U_ID === faq.U_ID).map((faq2, index) => (
                                <p key={index}>Vehicle ID:       <span>{faq2.V_ID}</span></p>
                                ))}
                            </div>
                            <div className="d-btn">
                                <button onClick={() => Viewid(faq.D_URLID)} className="viewid-btn">View ID</button>
                                <button onClick={() => ViewLic(faq.D_LICID)} className="viewlic-btn">View License</button>
                                <button onClick={() => Assignvehicle(faq.U_ID)} className="assign-btn">Assign Vehicle</button>
                                <button onClick={() => Verify(faq.U_ID)} className="verify-btn">Verify</button>
                            </div>
                        </div> 
                    ))}
                        
                       
                    </div>
                    </div>
                    {/* View Details Popup */}
                    <div id="assignPopup" className="popupassign">
                    <div className="popupassign-content">
                        
                        <h2>Assign Vehicle</h2>
                        <div className="assign-controls">
                        <input 
                        onChange={(e) => setassignid(e.target.value)}
                        placeholder="Vehicle ID" />
                        <button onClick={Assign}>Assign</button>
                        </div>
                    </div>
                    </div>
    </div>
  )
}
export default Drivermain;