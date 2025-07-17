import React, { useEffect,useState } from 'react';
import axios from 'axios';

function Routemain() {
   
    const [routedata,setroutedata]=useState([]);
    const [rdata,setrdata]=useState([]);
    const [cdata,setcdata]=useState([]);
    const [checkdata,setcheckdata]=useState([]);
    const [rid,setrid]=useState('');

    const [newname,setnewname]=useState('');
    const [newdistance,setnewdistance]=useState('');
    const [newnumstops,setnewnumstops]=useState('');
    const [newstartloc,setnewstartloc]=useState('');
    const [newendloc,setnewendloc]=useState('');
    const [newadditionalinfo,setaddinfo]=useState('');

    const [editname,seteditname]=useState('');
    const [editdistance,seteditdistance]=useState('');
    const [editnumstops,seteditnumstops]=useState('');
    const [editstartloc,seteditstartloc]=useState('');
    const [editendloc,seteditendloc]=useState('');
    const [editadditionalinfo,seteditaddinfo]=useState('');

    const [checkloc,setcheckloc]=useState('');


   const [pagerefresh,setrefresh]=useState('');
    function refresh(e)
    {
        e.preventDefault(); 
        setrefresh('changed');
    }
    function AddRoute(e)
    {
        e.preventDefault(); 
        axios.post('http://localhost:8081/newroute',{newname,newdistance,newnumstops,newstartloc,newendloc,newadditionalinfo})
        .then(res => {
            const {data} =res;
            console.log('Server response data:', data); // Log the data to check the structure
            const {use}=data;
            if(use.status==='Updated')
            {
               console.log('Success');
            }
            else{
                console.log('Failed ');
            }
        })
        .catch(err => console.log(err));
    }
    useEffect(() => {

        axios.get('http://localhost:8081/getroutes')
        .then(res => {
            const {data} =res;
           
            setroutedata(data);
        })
        .catch(err => console.log(err));
    }, [routedata]);
    const ViewDetails = (id) => {
        axios.get('http://localhost:8081/getroutebyid',{params:{id}})
        .then(res => {
            const {data} =res;
            const {use}=data;
            if(data.length>0)
            {      
                    
                setrdata(data);
                setrid(id);
            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));

        axios.get('http://localhost:8081/getcheckpoint',{params:{id}})
            .then(res => {
                const {data} =res;
                const {use}=data;
                if(data.length>0)
                {      
                        
                    setcheckdata(data);
                    
                }
                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));

    };
    const EditRoute = (id) => {
        axios.get('http://localhost:8081/getroutebyid',{params:{id}})
        .then(res => {
            const {data} =res;
            const use=data[0];
            if(data.length>0)
            {      
                    
                setrdata(data);
                setrid(id);
                seteditname(use.RO_NAME);
                seteditdistance(use.RO_DISTANCE);
                seteditendloc(use.RO_ENDLOC);
                seteditnumstops(use.RO_NUMSTOPS);
                seteditstartloc(use.RO_STARTLOC);
                seteditaddinfo(use.RO_ADDITIONALINFO);


            }
            else
            {
                console.log('failed');
            }
            
        })
        .catch(err => console.log(err));




    };

    const RemoveRoute = (id) => {
        axios.delete('http://localhost:8081/deleteroute',{data:{id}})
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

    const  AddCheck= (id) => {
        console.log(id);
            axios.get('http://localhost:8081/getroutebyid',{params:{id}})
            .then(res => {
                const {data} =res;
                const {use}=data;
                if(data.length>0)
                {      
                        
                    setrdata(data);
                    setrid(id);
                }
                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));
    };
    function Savecheck(e)
    {
        e.preventDefault(); 
        let status='Active';
        axios.post('http://localhost:8081/savecheckpoint',{checkloc,status,rid})
        .then(res => {
            const {data} =res;
            console.log('Server response data:', data); // Log the data to check the structure
            const {use}=data;
            if(use.status==='Updated')
            {
               console.log('Success');
            }
            else{
                console.log('Failed ');
            }
        })
        .catch(err => console.log(err));
    }
    function SaveEdit(e)
    {
        e.preventDefault(); 
        axios.put('http://localhost:8081/editroute',{editname,editdistance,editnumstops,editstartloc,editendloc,editadditionalinfo,rid})
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

    useEffect(() => {
        const editRoutePopup = document.getElementById('editRoutePopup');
        const addRoutePopup = document.getElementById('addRoutePopup');
        const addCheckPopup = document.getElementById('addcheckPopup');
        const viewDetailsPopup = document.getElementById('viewDetailsPopup');
    
        const viewDetailsButtons = document.querySelectorAll('.view-details');
        const editRouteButtons = document.querySelectorAll('.edit-route');
        const checkRouteButtons = document.querySelectorAll('.checkroute-btn');
        const addRouteButtons = document.querySelectorAll('.addroute-btn');
        const closeButtons = document.querySelectorAll('.close');
        
        const handleCloseClick = () => {
            if (editRoutePopup) {
                editRoutePopup.style.display = 'none';
            }
            if (addRoutePopup) {
                addRoutePopup.style.display = 'none';
            }
            if (viewDetailsPopup) {
                viewDetailsPopup.style.display = 'none';
            }
            if (addCheckPopup) {
                addCheckPopup.style.display = 'none';
            }
        };
    
        const handleWindowClick = (event) => {
            if (event.target === editRoutePopup) {
                editRoutePopup.style.display = 'none';
            }
            if (event.target === addRoutePopup) {
                addRoutePopup.style.display = 'none';
            }
            if (event.target === viewDetailsPopup) {
                viewDetailsPopup.style.display = 'none';
            }
            if (event.target === addCheckPopup) {
                addCheckPopup.style.display = 'none';
            }
        };
    
        const handleEditClick = () => {
            if (editRoutePopup) {
                editRoutePopup.style.display = 'flex';
            }
        };
        const handleCheckClick = () => {
            if (addCheckPopup) {
                addCheckPopup.style.display = 'flex';
            }
        };
    
        const handleAddClick = () => {
            if (addRoutePopup) {
                addRoutePopup.style.display = 'flex';
            }
        };
    
        const handleDetailsClick = () => {
            if (viewDetailsPopup) {
                viewDetailsPopup.style.display = 'flex';
            }
        };
    
        // Add event listeners
        addRouteButtons.forEach(button => {
            button.addEventListener('click', handleAddClick);
        });
        checkRouteButtons.forEach(button => {
            button.addEventListener('click', handleCheckClick);
        });
    
        closeButtons.forEach(button => {
            button.addEventListener('click', handleCloseClick);
        });
    
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', handleDetailsClick);
        });
    
        editRouteButtons.forEach(button => {
            button.addEventListener('click', handleEditClick);
        });
    
        window.addEventListener('click', handleWindowClick);
    
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            addRouteButtons.forEach(button => {
                button.removeEventListener('click', handleAddClick);
            });
            checkRouteButtons.forEach(button => {
                button.removeEventListener('click', handleCheckClick);
            });
    
            closeButtons.forEach(button => {
                button.removeEventListener('click', handleCloseClick);
            });
    
            viewDetailsButtons.forEach(button => {
                button.removeEventListener('click', handleDetailsClick);
            });
    
            editRouteButtons.forEach(button => {
                button.removeEventListener('click', handleEditClick);
            });
    
            window.removeEventListener('click', handleWindowClick);
        };
    
    }, [pagerefresh]);
  return (
    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Set-Up Routes</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Routes</a>
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
                        <button  className="addroute-btn">Add Route</button>
                        <table className="Route-table">
                        <thead className="Route-head">
                            <tr>
                            <th>Route Name</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="Vehicle-body">

                        {routedata.map((faq, index) => (
                            <tr key={index}>
                            <td>{faq.RO_NAME}</td>
                            <td>
                                <button onClick={() => ViewDetails(faq.RO_ID)} className="view-details" data-route="A">View Details</button>
                                <button onClick={() => EditRoute(faq.RO_ID)} className="edit-route" data-route="A">Edit</button>
                                <button onClick={() => RemoveRoute(faq.RO_ID)} className="remroute-btn">Remove Route</button>
                                <button onClick={() => AddCheck(faq.RO_ID)} className="checkroute-btn">Add Checkpoint</button>
                            </td>
                            </tr>
                        ))}
                           
                        </tbody>
                        </table>
                    </div>
                    </div>
                    {/* View Details Popup */}
                    <div id="viewDetailsPopup" className="popuproute">
                    {rdata.map((faq, index) => (
                    <div key={index} className="popuproute-content">
                        <span className="close">×</span>
                        <h2>Route Details</h2>
                        <p>Route Name: {faq.RO_NAME}</p>
                        <p>Route Distance: {faq.RO_DISTANCE}</p>
                        <p>Number Of Stops: {faq.RO_NUMSTOPS}</p>
                        <p>Start Location: {faq.RO_STARTLOC}</p>
                        <p>End Location: {faq.RO_ENDLOC}</p>

                        <h3>Checkpoints</h3>
                        {checkdata.filter(faq1 => faq1.RO_ID === faq.RO_ID).map((faq1, index) => (
                          <p key={index}>Location: {faq1.RC_LOCATION}</p>
                        ))}
                        
                    </div>
                    ))}
                    </div>
                    {/* Edit Route Popup */}
                    <div id="editRoutePopup" className="popuproute">
                    <div className="popuprouteedit-content">
                        <span className="close">×</span>
                        <form>
                        <h2>Edit Route</h2>
                        <div className="input-group">
                            
                            <input
                            value={editname}
                            onChange={(e) => seteditname(e.target.value)}
                            placeholder='Route Name:' type="text" id="routeName" name="routeName" required />
                        </div>
                        <div className="input-group">
                            
                            <input 
                             value={editdistance}
                            onChange={(e) => seteditdistance(e.target.value)}
                            placeholder='Route Distance:' type="text" id="routeDistance" name="routeDistance" required />
                        </div>
                        <div className="input-group">
                            
                            <input
                             value={editnumstops}
                            onChange={(e) => seteditnumstops(e.target.value)}
                            placeholder='Number of Stops:' type="number" id="routeNumStops" name="routeNumStops" required />
                        </div>
                        <div className="input-group">
                           
                            <input 
                             value={editstartloc}
                            onChange={(e) => seteditstartloc(e.target.value)}
                            placeholder='Start Radius:' type="text" id="routeStartLoc" name="routeStartLoc" required />
                        </div>
                        <div className="input-group">
                            
                            <input
                             value={editendloc}
                            onChange={(e) => seteditendloc(e.target.value)}
                            placeholder='End Radius:' type="text" id="routeEndLoc" name="routeEndLoc" required />
                        </div>
                        <div className="input-group">
                            
                            <input 
                             value={editadditionalinfo}
                            onChange={(e) => seteditaddinfo(e.target.value)}
                            placeholder='Additional Info:' type="text" id="routeAdditionalInfo" name="routeAdditionalInfo" />
                        </div>
                        <button onClick={SaveEdit}>Save</button>
                        </form>
                    </div>
                    </div>
                    {/* Add Route Popup */}
                    <div id="addRoutePopup" className="popuproute">
                    <div className="popuproutadd-content">
                        <span className="close">×</span>
                        <form>
                        <h2>Add Route</h2>
                        <div className="input-group">
                            
                            <input
                             onChange={(e) => setnewname(e.target.value)}
                             placeholder='Route Name:' type="text" id="routeName" name="routeName" required />
                        </div>
                        <div className="input-group">
                            
                            <input
                            onChange={(e) => setnewdistance(e.target.value)}
                            placeholder='Route Distance:' type="text" id="routeDistance" name="routeDistance" required />
                        </div>
                        <div className="input-group">
                            
                            <input
                            onChange={(e) => setnewnumstops(e.target.value)}
                            placeholder='Number of Stops:' type="number" id="routeNumStops" name="routeNumStops" required />
                        </div>
                        <div className="input-group">
                           
                            <input 
                            onChange={(e) => setnewstartloc(e.target.value)}
                            placeholder='Start Radius:' type="text" id="routeStartLoc" name="routeStartLoc" required />
                        </div>
                        <div className="input-group">
                            
                            <input
                            onChange={(e) => setnewendloc(e.target.value)}
                            placeholder='End Radius:' type="text" id="routeEndLoc" name="routeEndLoc" required />
                        </div>
                        <div className="input-group">
                            
                            <input
                            onChange={(e) => setaddinfo(e.target.value)}
                            placeholder='Additional Info:' type="text" id="routeAdditionalInfo" name="routeAdditionalInfo" />
                        </div>
                        <button onClick={AddRoute} >Save</button>
                        </form>
                    </div>
                    </div>
                    {/* Add Checkpoint Popup */}
                    <div id="addcheckPopup" className="popuproute">
                    <div className="popupcheckadd-content">
                        <span className="close">×</span>
                        <form>
                        <h2>Add Checkpoint</h2>
                        <div className="input-group">
                            {/*<label htmlFor="routeName">Location</label>*/}
                            <input 
                            onChange={(e) => setcheckloc(e.target.value)}
                            placeholder="Location" type="text" id="routeName" name="routeName" required/>
                        </div>
                        
                        <button onClick={Savecheck} >Save</button>
                        </form>
                    </div>
                    </div>
                    
    </div>
  )
}
export default Routemain;