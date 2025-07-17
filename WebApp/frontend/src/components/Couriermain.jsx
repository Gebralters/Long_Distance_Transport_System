import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Couriermain() {

    const [parceldata,setparceldata]=useState([]);
    const [parcelsdata,setparcelsdata]=useState([]);
    const [imagedata,setimagedata]=useState([]);
    const [pagerefresh,setrefresh]=useState('');
    const [selectedType, setSelectedType] = useState('');
    

    function refresh(e)
    {
        e.preventDefault(); 
        setrefresh('changed');
    }
    const filteredPendingData = parcelsdata.filter(pbooking => pbooking.P_STATUS === 'Pending') ;
        
    const filteredApprovedData =  parcelsdata.filter(pbooking => pbooking.P_STATUS === 'Approved') ;


    const  Viewimage= (id) => {
      
        axios.get('http://localhost:8081/getparcelimages',{params:{id}})
        .then(res => {
            const {data} =res;
           
            if(data.length>0)
            {
                console.log('Server response data:', data);
                setimagedata(data);
               
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));
    };
    const  Accept= (id) => {
        let status='Approved';
        axios.put('http://localhost:8081/acceptparcel',{status,id})
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
    const  Reject= (id) => {
        let status='Rejected'
        axios.put('http://localhost:8081/rejectparcel',{status,id})
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
        axios.get('http://localhost:8081/getparcelbookings')
        .then(res => {
            const {data} =res;
           
            setparcelsdata(data);
        })
        .catch(err => console.log(err));
    }, [parcelsdata]);
    useEffect(() => {
        const pimgPopup = document.getElementById('view-P-Popup');
        const pButton = document.querySelectorAll('.pimg-btn');

        const closeButtons = document.querySelectorAll('.close');

        const handleCloseClick = () => {
            if (pimgPopup) {
                pimgPopup.style.display = 'none';
            }
            
        };

        const handleWindowClick = (event) => {
            if (event.target === pimgPopup) {
                pimgPopup.style.display = 'none';
            }
            
        };

        const handleViewClick = () => {
            if (pimgPopup) {
                pimgPopup.style.display = 'flex';
            }
        };

        

        // Add event listeners
        pButton.forEach(button => {
            button.addEventListener('click', handleViewClick);
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', handleCloseClick);
        });

        
        window.addEventListener('click', handleWindowClick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            pButton.forEach(button => {
                button.removeEventListener('click', handleViewClick);
            });

            closeButtons.forEach(button => {
                button.removeEventListener('click', handleCloseClick);
            });

           
            window.removeEventListener('click', handleWindowClick);
        };
    }, [parcelsdata]);
  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Courier Services</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Courier Services</a>
                        </li>
                        </ul>
                    </div>
                    <a href="#" className="btn-download">
                        <i className="bx bxs-cloud-download" />
                        <span onClick={refresh} className="text">Refresh</span>
                    </a>
                    </div>
                    <div className="manageparcel-container">
                    <div className="pending-parcels">
                        <h2>Pending Parcels</h2>
                        <div className="parcel-contents">
                        <table className="pending-table">
                            <thead>
                            <tr>
                                <th>Parcel ID</th>
                                <th>Status</th>
                                <th>Category ID</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPendingData.map((faq, index) => (
                            <tr key={index}>
                                <td>{faq.P_ID}</td>
                                <td>{faq.P_STATUS}</td>
                                <td>{faq.P_CATID}</td>
                                <td><button onClick={() => Viewimage(faq.P_ID)} className="pimg-btn">View Image</button>
                                <button onClick={() => Accept(faq.P_ID)} className="accept-btn">Approve</button>
                                <button onClick={() => Reject(faq.P_ID)} className="reject-btn">Reject</button>
                                </td>
                            </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="approved-parcels">
                        <h2>Approved Parcels</h2>
                        <div className="parcel-contents">
                        <table className="approved-table">
                            <thead>
                            <tr>
                                <th>Parcel ID</th>
                                <th>Status</th>
                                <th>Category ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApprovedData.map((faq, index) => (
                            <tr key={index}>
                                <td>{faq.P_ID}</td>
                                <td>{faq.P_STATUS}</td>
                                <td>{faq.P_CATID}</td>
                            </tr>
                            ))}
                           
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                    
                   
                    {/* image view Popup */}
                    <div id="view-P-Popup" className="view-P-Popup">
                       
                    <div className="popup-Pview-content">
                        {imagedata.map((faq, index) => (
                       
                            <img key={index} src={faq.PIMG_URLIMG} />
                        
                        ))}
                    </div>
                   
                    </div>
    </div>
  )
}
export default Couriermain;