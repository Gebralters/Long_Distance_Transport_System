import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Bookingjs from '../Javascript/Bookingjs';
import GlobalVariables from '../Javascript/GlobalVariables';

function Bookingslot() {
    const [userid,setuserid]=useState('');
    const [bsid,setbsid]=useState('');
    const [changestate,setchangestate]=useState('');
    const [userdata, setuserdata]=useState([]);
    const [bsdata, setbsdata]=useState([]);
    const [bsdetaildata, setbsdetaildata]=useState([]);

    const [passprice, setnewpassprice]=useState('');
    const [parcelprice, setnewparcelprice]=useState('');
    const [newdate, setnewdate]=useState('');
    const [newpickradius, setnewpickradius]=useState('');
    const [newdestradius, setnewdestradius]=useState('');
    const [newarrivaltime, setnewarrivaltime]=useState('');
    const [newpicktime, setnewpicktime]=useState('');
    const [newseats, setnewseats]=useState('');

    const [edditpassprice, setedditpassprice]=useState('');
    const [edditparcelprice, setedditparcelprice]=useState('');
    const [edditnewdate, setedditdate]=useState('');
    const [edditpickradius, setedditpickradius]=useState('');
    const [edditdestradius, setedditdestradius]=useState('');
    const [edditarrivaltime, setedditarrivaltime]=useState('');
    const [edditpicktime, setedditpicktime]=useState('');
    const [edditseats, setedditseats]=useState('');
    
    

    // Effect to set userid from global variables
    useEffect(() => {
        setuserid(GlobalVariables.userId);
    }, []);
   
    useEffect(() => {
    
        console.log(userid);
        if(userid!='')
        {
            axios.get('http://localhost:8081/getuser',{ params: { userid } })
            .then(res => {
                const {data} =res;
               
                setuserdata(data);
            })
            .catch(err => console.log(err));
        }
       

    }, [userid]);
    useEffect(() => {
    
        
            axios.get('http://localhost:8081/getbookingslot')
            .then(res => {
                const {data} =res;
               
                setbsdata(data);
            })
            .catch(err => console.log(err));
       

    }, [bsdata]);
    useEffect(() => {
        // Select the elements from the DOM
        const closeButtons = document.querySelectorAll('.close');
        const newslotPopup = document.getElementById('new-booking-Popup');
        const newslotButtons = document.querySelectorAll('.slot-new');
        
        const detailsButtons = document.querySelectorAll('.book-details');
        const editButtons = document.querySelectorAll('.book-edit');
       

        const detailsPopup = document.getElementById('details-booking-Popup');
        const editPopup = document.getElementById('edit-booking-Popup');
        const removePopup = document.getElementById('remove-booking-Popup');
        

        const handleNewSlotClick = () => {
            if (newslotPopup) {
                newslotPopup.style.display = 'flex';
            }
        };

        const handleCloseClick = () => {
            if (newslotPopup) {
                newslotPopup.style.display = 'none';
            }
            if (detailsPopup) {
                detailsPopup.style.display = 'none';
            }
            if (editPopup) {
                editPopup.style.display = 'none';
            }
            
        };

        const handleWindowClick = (event) => {
            if (event.target === newslotPopup) {
                newslotPopup.style.display = 'none';
            }
            if (event.target === detailsPopup) {
                detailsPopup.style.display = 'none';
            }
            if (event.target === editPopup) {
                editPopup.style.display = 'none';
            }
            if (event.target === removePopup) {
                removePopup.style.display = 'none';
            }
        };
        const handleDetailsClick = () => {
            if (detailsPopup) {
                detailsPopup.style.display = 'flex';
            }
        };
        const handleEditClick = () => {
            if (editPopup) {
                editPopup.style.display = 'flex';
            }
        };
        
        
        // Add event listeners
        newslotButtons.forEach(button => {
            button.addEventListener('click', handleNewSlotClick);
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', handleCloseClick);
        });
        detailsButtons.forEach(button => {
            button.addEventListener('click', handleDetailsClick);
        });

        editButtons.forEach(button => {
            button.addEventListener('click', handleEditClick);
        });

        

        window.addEventListener('click', handleWindowClick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            newslotButtons.forEach(button => {
                button.removeEventListener('click', handleNewSlotClick);
            });

            closeButtons.forEach(button => {
                button.removeEventListener('click', handleCloseClick);
            });
            detailsButtons.forEach(button => {
                button.removeEventListener('click', handleDetailsClick);
            });
            editButtons.forEach(button => {
                button.removeEventListener('click', handleEditClick);
            });

            
            

            window.removeEventListener('click', handleWindowClick);
        };
    }, [changestate]);


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
    
   function Handlesaveslot(e)
   {
    e.preventDefault(); 
     setchangestate('changed');
        // Get the current time
        let currentTime = new Date();
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();

        // Combine date and time into a single string in ISO format
        let dateTimeString = `${newdate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.000Z`;

        // Create a new Date object
        let dateTime = new Date(dateTimeString);
      
        const status='Available';
        axios.post('http://localhost:8081/newbookingslot',{newdate,newpickradius,newdestradius,newseats,newarrivaltime,newpicktime,parcelprice,passprice,status})
        .then(res => {
            const {data} =res;
            console.log('Server response data:', data); // Log the data to check the structure
            const {use}=data;
            if(use.status==='Updated')
            {
               console.log('Success booking slot');
            }
            else{
                console.log('Failed booking slot');
            }
        })
        .catch(err => console.log(err));
    
   }
   function Saveedit(e)
   {
    e.preventDefault(); 
      let id=bsid;
        setchangestate('changed');
        const status='Available';
            axios.put('http://localhost:8081/updatebookingslot',{edditpickradius,edditdestradius,edditseats,edditarrivaltime,edditpicktime,edditparcelprice,edditpassprice,status,id})
            .then(res => {
                const {data} =res;
                console.log('Server response data:', data); // Log the data to check the structure
                const {use}=data;
                if(use.status==='Updated')
                {
                console.log('Success booking slot');
                }
                else{
                    console.log('Failed booking slot');
                }
            })
            .catch(err => console.log(err));
   }
   
   const Slotmoredetails = (id) => {
        // Remove the booking slot with the given id
        setchangestate('changed');
        axios.get('http://localhost:8081/getbookingbyid',{params:{id}})
            .then(res => {
                const {data} =res;
                if(data.length>0)
                {
                    console.log('Server response data what is wanna:', data);
                     setbsdetaildata(data);
                     console.log(bsdetaildata);

                }

                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));


   };

   const Slotedit = (id) => {
             console.log(id);
            setchangestate('changed');
            axios.get('http://localhost:8081/getbookingbyid',{params:{id}})
            .then(res => {
                const {data} =res;
                const user=data[0];
              
                if(data.length>0)
                {
                    setbsid(user.BS_ID);
                    console.log('populated')
                   setedditpassprice(user.BS_PASSPRICE);
                   setedditparcelprice(user.BS_PARCELPRICE);
                  
                   setedditpickradius(user.BS_PICKUPRADIUS);
                   setedditdestradius(user.BS_DESTRADIUS);
                   setedditarrivaltime(user.BS_ARRIVALTIME);
                   setedditpicktime(user.BS_PICKUPTIME);
                   setedditseats(user.BS_AVAILSEATS);
                }
                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));


            
            
   };

   
   const Slotremove = (id) => {
    setchangestate('changed');
    console.log(id);
    // Remove the booking slot with the given id
        axios.delete('http://localhost:8081/deletebookingslot',{data:{id}})
            .then(res => {
                const {data} =res;
                const {use}=data;
               
                if(data.status==='Deleted')
                {
                  console.log('Removed');
                }
                else{
                    console.log('Failed');
                }
            })
            .catch(err => console.log(err));
   };

function refresh(e)
{
    e.preventDefault(); 
    setchangestate('changed');
}
  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Set-Up Bookings</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Bookings</a>
                        </li>
                        </ul>
                    </div>
                    <a href="#" className="btn-download">
                        <i className="bx bxs-cloud-download" />
                        <span onClick={refresh} className="text">Refresh</span>
                    </a>
                    </div>
                    <div className="manageusers-container">
                    <div className="menu">
                        <button  className="slot-new">New Slot</button>
                        <table className="Booking-table">
                        <thead className="Booking-head">
                            <tr>
                            <th>Booking Slot ID</th>
                            <th>Date</th>
                            <th>Pick-Up Radius</th>
                            <th>Destination Radius</th>
                            <th>Available Seats</th>
                            <th>Status</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="Vehicle-body">
                        {bsdata.map((faq,index)=>(
                            <tr key={index}>
                                <td>{faq.BS_ID}</td>
                                <td>{formatDate(faq.BS_DATETIME)}</td>
                                <td>{faq.BS_PICKUPRADIUS}</td>
                                <td>{faq.BS_DESTRADIUS}</td>
                                <td>{faq.BS_AVAILSEATS}</td>
                                <td>{faq.BS_STATUS}</td>
                                <td>
                                    <button onClick={() => Slotmoredetails(faq.BS_ID)}  className="book-details">More Details</button>
                                    <button onClick={() => Slotedit(faq.BS_ID)} className="book-edit">Edit</button>
                                    <button onClick={() => Slotremove(faq.BS_ID)} className="book-remove">Remove Slot</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                    {/* View Details Popup */}
                    <div id="details-booking-Popup" className="details-booking-Popup">
                    {bsdetaildata.map((faq,index)=>(
                        <div key={index} className="popup-BSdetails-content">
                            <span className="close">×</span>
                            <h2>Slot Details</h2>
                            <p>Pick-Up Time:{faq.BS_PICKUPTIME}</p>
                            <p>Arrival Time: {faq.BS_ARRIVALTIME}</p>
                            <p>Passenger Price: {faq.BS_PASSPRICE}</p>
                            <p>Parcel Price: {faq.BS_PARCELPRICE}</p>
                            <p>Booking Slot Status: {faq.BS_STATUS}</p>
                        </div>
                      ))}
                    </div>
                   
                    {/* Edit booking slot Popup */}
                    <div id="edit-booking-Popup" className="edit-booking-Popup">
                    <div className="popup-BSedit-content">
                        <span className="close">×</span>
                        <form >
                        <h2>Edit Booking Slot</h2>
                        <div className="input-group">
                            <input type="text"
                            value={edditpickradius}
                            onChange={(e) => setedditpickradius(e.target.value)}
                            required />
                            <label>Pick-Up Radius:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={edditdestradius}
                            onChange={(e) => setedditdestradius(e.target.value)}
                            required />
                            <label>Destination Radius:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={edditseats}
                            onChange={(e) => setedditseats(e.target.value)}
                            required />
                            <label>Available Seats</label>
                        </div>
                        <div className="input-group">
                            <input type="time"
                            value={edditpicktime}
                            onChange={(e) => setedditpicktime(e.target.value)}
                            required />
                            <label>Pick-Up Time:</label>
                        </div>
                        <div className="input-group">
                            <input type="time"
                            value={edditarrivaltime}
                            onChange={(e) => setedditarrivaltime(e.target.value)}
                            required />
                            <label>Arrival Time:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={edditpassprice}
                            onChange={(e) => setedditpassprice(e.target.value)}
                            required />
                            <label>Passenger Price:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={edditparcelprice}
                            onChange={(e) => setedditparcelprice(e.target.value)}
                            required />
                            <label>Parcel Price:</label>
                        </div>
                        <button onClick={Saveedit}>Save Slot</button>
                        </form>
                    </div>
                    </div>
                    {/* new booking slot Popup */}
                    <div id="new-booking-Popup" className="new-booking-Popup">
                    <div className="popup-BSnew-content">
                        <span className="close">×</span>
                        <form >
                        <h2>New Booking Slot</h2>
                        <div className="input-group">
                            <input type="date"
                             onChange={(e) => setnewdate(e.target.value)} />
                            <label>Date:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                             onChange={(e) => setnewpickradius(e.target.value)}
                            required />
                            <label>Pick-Up Radius:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                             onChange={(e) => setnewdestradius(e.target.value)}
                            required />
                            <label htmlFor>Destination Radius:</label>
                        </div>
                        <div className="input-group">
                            <input type="text" 
                             onChange={(e) => setnewseats(e.target.value)}
                            required />
                            <label htmlFor>Available Seats</label>
                        </div>
                        <div className="input-group">
                            <input type="time" 
                             onChange={(e) => setnewpicktime(e.target.value)}
                            required />
                            <label htmlFor>Pick-Up Time:</label>
                        </div>
                        <div className="input-group">
                            <input type="time" 
                            onChange={(e) => setnewarrivaltime(e.target.value)}
                            required />
                            <label htmlFor>Arrival Time:</label>
                        </div>
                        <div className="input-group">
                            <input type="text" 
                            onChange={(e) => setnewpassprice(e.target.value)}
                            required />
                            <label htmlFor>Passenger Price:</label>
                        </div>
                        <div className="input-group">
                            <input type="text" 
                            onChange={(e) => setnewparcelprice(e.target.value)}
                            required />
                            <label htmlFor>Parcel Price:</label>
                        </div>
                        <button onClick={Handlesaveslot} >Save</button>
                        </form>
                    </div>
                    </div>
                   
    </div>
  )
}
export default Bookingslot