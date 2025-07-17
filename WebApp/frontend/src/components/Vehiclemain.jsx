import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Vehiclemain() {
    const [editcolor,seteditcolor]=useState('');
    const [editmodel,seteditmodel]=useState('');
    const [editlicnum,seteditlicnum]=useState('');
    const [editnumseats,seteditnumseats]=useState('');
    const [edittype,setedittype]=useState('');
    const [editimgurl,seteditimgurl]=useState('');


    const [newcolor,setnewcolor]=useState('');
    const [newmodel,setnewmodel]=useState('');
    const [newlicnum,setnewlicnum]=useState('');
    const [newnumseats,setnewnumseats]=useState('');
    const [newtype,setnewtype]=useState('');
    const [newimgurl,setnewimgurl]=useState('');


    const [vdata,setvdata]=useState([]);
    const [changestatus,setchangestatus]=useState([]);
    const [vsdata,setvsdata]=useState([]);

    function refresh(e)
    {
        e.preventDefault(); 
        setchangestatus('cahnged');
    }
    useEffect(() => {
        setchangestatus('changed');
        axios.get('http://localhost:8081/getvehicle')
        .then(res => {
            const {data} =res;
           
            setvsdata(data);
        })
        .catch(err => console.log(err));

    }, [vsdata]);

    function Savenewvehicle(e)
    {
        e.preventDefault(); 
        setchangestatus('changed');
        let status='Unassigned';
        axios.post('http://localhost:8081/newvehicle',{newnumseats,newtype,newlicnum,newmodel,newcolor,status,newimgurl})
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
    
    const RemoveVehicle = (id) => {
        setchangestatus('changed');
        axios.delete('http://localhost:8081/deletevehicle',{data:{id}})
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
    const ViewDetails = (id) => {
        setchangestatus('changed');
        axios.get('http://localhost:8081/getvehiclebyid',{params:{id}})
        .then(res => {
            const {data} =res;
            if(data.length>0)
            {            
                setvdata(data);
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));

    };
    const EditVehicle = (id) => {
        setchangestatus('changed');
        axios.get('http://localhost:8081/getvehiclebyid',{params:{id}})
        .then(res => {
            const {data} =res;
            const user=data[0];
            if(data.length>0)
            {            

                setvdata(data);
                setedittype(user.V_TYPE);
                seteditmodel(user.V_MODEL);
                seteditcolor(user.V_COLOR);
                seteditlicnum(user.V_LICNUMBER);
                seteditnumseats(user.V_CAPACITY);
                seteditimgurl(user.V_IMGURL);

            }
            else
            {
                console.log('failed');
            } 
        })
        .catch(err => console.log(err));

        
        
        axios.put('http://localhost:8081/editvehicle',{editnumseats,edittype,editlicnum,editmodel,editcolor,editimgurl,id})
        .then(res => {
            const {data} =res;
           
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
            const detailsVPopup = document.getElementById('details-vehicle-Popup');
            const editVPopup = document.getElementById('edit-vehicle-Popup');
            const addVPopup = document.getElementById('add-vehicle-Popup');
    
            const detailsVButtons = document.querySelectorAll('.book-V-details');
            const editVButtons = document.querySelectorAll('.book-V-edit');
            const addVButtons = document.querySelectorAll('.add-v-btn');
    
            const closeButtons = document.querySelectorAll('.close');
    
            const handleCloseClick = () => {
                if (detailsVPopup) {
                    detailsVPopup.style.display = 'none';
                }
                if (editVPopup) {
                    editVPopup.style.display = 'none';
                }
                if (addVPopup) {
                    addVPopup.style.display = 'none';
                }
            };
    
            const handleWindowClick = (event) => {
                if (event.target === detailsVPopup) {
                    detailsVPopup.style.display = 'none';
                }
                if (event.target === editVPopup) {
                    editVPopup.style.display = 'none';
                }
                if (event.target === addVPopup) {
                    addVPopup.style.display = 'none';
                }
            };
    
            const handleEditClick = () => {
                if (editVPopup) {
                    editVPopup.style.display = 'flex';
                }
            };
    
            const handleAddClick = () => {
                if (addVPopup) {
                    addVPopup.style.display = 'flex';
                }
            };
    
            const handleDetailsClick = () => {
                if (detailsVPopup) {
                    detailsVPopup.style.display = 'flex';
                }
            };
    
            // Add event listeners
            addVButtons.forEach(button => {
                button.addEventListener('click', handleAddClick);
            });
    
            closeButtons.forEach(button => {
                button.addEventListener('click', handleCloseClick);
            });
    
            detailsVButtons.forEach(button => {
                button.addEventListener('click', handleDetailsClick);
            });
    
            editVButtons.forEach(button => {
                button.addEventListener('click', handleEditClick);
            });
    
            window.addEventListener('click', handleWindowClick);
    
            // Cleanup function to remove event listeners when the component unmounts
            return () => {
                addVButtons.forEach(button => {
                    button.removeEventListener('click', handleAddClick);
                });
    
                closeButtons.forEach(button => {
                    button.removeEventListener('click', handleCloseClick);
                });
    
                detailsVButtons.forEach(button => {
                    button.removeEventListener('click', handleDetailsClick);
                });
    
                editVButtons.forEach(button => {
                    button.removeEventListener('click', handleEditClick);
                });
    
                window.removeEventListener('click', handleWindowClick);
            };
        }, [changestatus]);
  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Vehicle Management</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Vehicles</a>
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
                        <button className="add-v-btn">New Vehicle</button>
                        <table className="Vehicle-table">
                        <thead className="Vehicle-head">
                            <tr>
                            <th>Vehicle Name</th>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="Vehicle-body">
                        {vsdata.map((faq,index)=>(
                            <tr key={index}>
                            <td>{faq.V_TYPE}</td>
                            <td>{faq.V_ID}</td>
                            <td><img src={faq.V_IMGURL} alt="Vehicle A" /></td>
                            <td>
                                <button onClick={() => ViewDetails(faq.V_ID)} className="book-V-details">View Details</button>
                                <button onClick={() => EditVehicle(faq.V_ID)} className="book-V-edit" >Edit</button>
                                <button onClick={() => RemoveVehicle(faq.V_ID)} className="book-V-remove" >Remove</button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                    {/* Vehicle Details Popup */}
                    <div id="details-vehicle-Popup" className="details-vehicle-Popup">
                    {vdata.map((faq,index)=>(
                    <div key={index} className="popup-Vdetails-content">
                        <span className="close">×</span>
                        <h2>Vehicle Details</h2>
                        <p>Capacity: {faq.V_CAPACITY}</p>
                        <p>Status: {faq.V_STATUS}</p>
                        <p>Model: {faq.V_MODEL}</p>
                        <p>License Number: {faq.V_LICNUMBER}</p>
                        <p>Color: {faq.V_COLOR}</p>
                    </div>
                    ))}
                    </div>
                    {/* Edit Vehicle Popup */}
                    <div id="edit-vehicle-Popup" className="edit-vehicle-Popup">
                    <div className="popup-Vedit-content">
                        <span className="close">×</span>
                        <form >
                        <h2>Edit Vehicle Details</h2>
                        <div className="input-group">
                            <input type="text"
                            value={editnumseats}
                            onChange={(e) => seteditnumseats(e.target.value)}
                            required />
                            <label>Number of Seats:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={edittype}
                            onChange={(e) => setedittype(e.target.value)}
                            required />
                            <label>Vehicle Type</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={editimgurl}
                            onChange={(e) => seteditimgurl(e.target.value)}
                            required />
                            <label>Image URL</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                             value={editlicnum}
                            onChange={(e) => seteditlicnum(e.target.value)}
                             required />
                            <label htmlFor>License Number</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            value={editmodel}
                            onChange={(e) => seteditmodel(e.target.value)}
                            required />
                            <label htmlFor>Model</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                             value={editcolor}
                            onChange={(e) => seteditcolor(e.target.value)}
                            required />
                            <label htmlFor>Color</label>
                        </div>
                        <button type="submit">Save</button>
                        </form>
                    </div>
                    </div>
                    {/* Add Vehicle Popup */}
                    <div id="add-vehicle-Popup" className="add-vehicle-Popup">
                    <div className="popup-Vadd-content">
                        <span className="close">×</span>
                        <form >
                        <h2>Add Vehicle Details</h2>
                        <div className="input-group">
                            <input type="text"
                            onChange={(e) => setnewnumseats(e.target.value)}
                            required />
                            <label>Number of Seats:</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                             onChange={(e) => setnewtype(e.target.value)}
                            required />
                            <label>Vehicle Type</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            onChange={(e) => setnewimgurl(e.target.value)}
                            required />
                            <label>Image URL</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            onChange={(e) => setnewlicnum(e.target.value)}
                            required />
                            <label htmlFor>License Number</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            onChange={(e) => setnewmodel(e.target.value)}
                            required />
                            <label htmlFor>Model</label>
                        </div>
                        <div className="input-group">
                            <input type="text"
                            onChange={(e) => setnewcolor(e.target.value)}
                            required />
                            <label htmlFor>Color</label>
                        </div>
                        <button onClick={Savenewvehicle}>Save</button>
                        </form>
                    </div>
                    </div>
                    
    </div>
  )
}
export default Vehiclemain;