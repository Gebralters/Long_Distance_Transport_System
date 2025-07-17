import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Usersmain() {
    const [users,setusers]=useState([]);
    const [userid,setuserid]=useState('');
    const [userdata,setuserdata]=useState([]);
    const [selectedType, setSelectedType] = useState('1');
    const [cstatus, setcstatus] = useState('');

    const [fname, seteditfname] = useState('');
    const [surname, seteditsurname] = useState('');
    const [title, setedittitle] = useState('');
    const [constact, seteditcontacts] = useState('');
    const [email, seteditemail] = useState('');
    const [usertype, seteditusertype] = useState('');

    const handleAdditionalClick = (userType) => {
        setSelectedType(userType);
    };
    const handleClick = (subMenuId, userType) => {
        return () => {
            toggleInboxSubMenu(subMenuId, userType);
            handleAdditionalClick(userType);
        };
    };
    const filteredDriverData = selectedType 
        ? users.filter(user => user.U_USERTYPE === 1) 
        : users;
    const filteredCustomerData = selectedType 
    ? users.filter(user => user.U_USERTYPE === 2) 
    : users;
    const filteredAdminData = selectedType 
        ? users.filter(user => user.U_USERTYPE === 3) 
        : users;


        const ViewDetails = (id) => {
            console.log(id);
            axios.get('http://localhost:8081/getuser',{params:{id}})
            .then(res => {
                const {data} =res;
                if(data.length>0)
                {      
                    console.log(data);      
                    setuserdata(data);
                }
                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));
        };


        const Edituser = (id) => {
            axios.get('http://localhost:8081/getuser',{params:{id}})
            .then(res => {
                const {data} =res;
                const user=data[0];
                if(data.length>0)
                {      
                    setuserid(user.U_ID); 
                    setuserdata(data);
                    seteditcontacts(user.U_CONTACT);
                    seteditemail(user.U_EMAIL);
                    seteditfname(user.U_FIRSTNAME);
                    setedittitle(user.U_TITLE);
                    seteditusertype(user.U_USERTYPE);
                    seteditsurname(user.U_SURNAME);
                  
                }
                else
                {
                    console.log('failed');
                }
                
            })
            .catch(err => console.log(err));


        };


        const Removeuser = (id) => {
            axios.delete('http://localhost:8081/deleteuser',{data:{id}})
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
            setcstatus('changed');
        };
        function Saveuserdetails(e)
        {
            e.preventDefault(); 
            let id=userid;
            axios.put('http://localhost:8081/edituser',{fname,surname,email,title,constact,usertype,id})
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
        
        axios.get('http://localhost:8081/getallusers')
        .then(res => {
            const {data} =res;
           
            setusers(data);
        })
        .catch(err => console.log(err));

    }, [users]);
    useEffect(() => {
        
        const detailUMPopup = document.getElementById('details-UM-Popup');
        const editUMPopup = document.getElementById('edit-UM-Popup');
        

        const detailsUMButtons = document.querySelectorAll('.book-UM-details');
        const editUMButtons = document.querySelectorAll('.book-UM-edit');
        

        const closeButtons = document.querySelectorAll('.close');

        const handleCloseClick = () => {
            if (detailUMPopup) {
                detailUMPopup.style.display = 'none';
            }
            if (editUMPopup) {
                editUMPopup.style.display = 'none';
            }
           
        };

        const handleWindowClick = (event) => {
            if (event.target === detailUMPopup) {
                detailUMPopup.style.display = 'none';
            }
            if (event.target === editUMPopup) {
                editUMPopup.style.display = 'none';
            }
        };

        const handleEditClick = () => {
            if (editUMPopup) {
                editUMPopup.style.display = 'flex';
            }
        };
        const handleDetailsClick = () => {
            if (detailUMPopup) {
                detailUMPopup.style.display = 'flex';
            }
        };

        // Add event listeners
        closeButtons.forEach(button => {
            button.addEventListener('click', handleCloseClick);
        });

        detailsUMButtons.forEach(button => {
            button.addEventListener('click', handleDetailsClick);
        });

        editUMButtons.forEach(button => {
            button.addEventListener('click', handleEditClick);
        });

        window.addEventListener('click', handleWindowClick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            closeButtons.forEach(button => {
                button.removeEventListener('click', handleCloseClick);
            });

            detailsUMButtons.forEach(button => {
                button.removeEventListener('click', handleDetailsClick);
            });

            editUMButtons.forEach(button => {
                button.removeEventListener('click', handleEditClick);
            });

            window.removeEventListener('click', handleWindowClick);
        };
    }, [cstatus]);


    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const toggleInboxSubMenu = (subMenuId) => {
        setActiveSubMenu(subMenuId);
    };
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
    <div><div className="head-title">
    <div className="left">
        <h1>Manage Users</h1>
        <ul className="breadcrumb">
        <li>
            <a href="#">Dashboard</a>
        </li>
        <li><i className="bx bx-chevron-right" /></li>
        <li>
            <a className="active" href="#">Manage Users</a>
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
                    <button
                        className={`menuinbox-btn ${activeSubMenu === 'driversSubMenu' ? 'active' : ''}`}
                        onClick={handleClick('driversSubMenu', '1')}
                    >
                        Drivers
                    </button>
                    <button
                        className={`menuinbox-btn ${activeSubMenu === 'alternativeAdminSubMenu' ? 'active' : ''}`}
                        onClick={handleClick('alternativeAdminSubMenu', '3')}
                    >
                        Alternative Admin
                    </button>
                    <button
                        className={`menuinbox-btn ${activeSubMenu === 'customersSubMenu' ? 'active' : ''}`}
                        onClick={handleClick('customersSubMenu', '2')}
                    >
                     Customers
                    </button>


       


        <div id="driversSubMenu" className="submenu" style={{ display: activeSubMenu === 'driversSubMenu' ? 'block' : 'none' }}>
        <table className="Admin-table">
            <thead className="Vehicle-head">
            <tr>
                <th>Driver Name</th>
                <th>Driver ID</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody className="Vehicle-body">
            {filteredDriverData.map((faq, index) => (
            <tr key={index}>
          
                <td>{faq.U_FIRSTNAME} {" "+faq.U_SURNAME}</td>
                <td>{faq.U_ID}</td>
                <td><img src="asserts/images/nouser.png" alt="Driver A" /></td>
                <td>
                <button onClick={() => ViewDetails(faq.U_ID)} className="book-UM-details">View Details</button>
                <button onClick={() => Edituser(faq.U_ID)} className="book-UM-edit">Edit</button>
                <button onClick={() => Removeuser(faq.U_ID)} className="book-UM-remove">Remove</button>
                </td>
            </tr>
            ))}
            
            </tbody>
        </table>
        </div>
    </div>
    <div id="alternativeAdminSubMenu" className="submenu" style={{ display: activeSubMenu === 'alternativeAdminSubMenu' ? 'block' : 'none' }}>
        <table className="Admin-table">
        <thead className="Vehicle-head">
            <tr>
            <th>Admin Name</th>
            <th>ID</th>
            <th>Image</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody className="Vehicle-body">
        {filteredAdminData.map((faq, index) => (
            <tr key={index}>
            <td>{faq.U_FIRSTNAME} {" "+faq.U_SURNAME}</td>
            <td>{faq.U_ID}</td>
            <td><img src="asserts/images/nouser.png" alt="ADMIN A" /></td>
            <td>
                <button onClick={() => ViewDetails(faq.U_ID)} className="book-UM-details">View Details</button>
                <button onClick={() => Edituser(faq.U_ID)} className="book-UM-edit">Edit</button>
                <button onClick={() => Removeuser(faq.U_ID)} className="book-UM-remove">Remove</button>
            </td>
            </tr>
        ))}
           
        </tbody>
        </table>
    </div>
    <div id="customersSubMenu" className="submenu" style={{ display: activeSubMenu === 'customersSubMenu' ? 'block' : 'none' }}>
        <table className="Customer-table">
        <thead>
            <tr>
            <th>Customer Name</th>
            <th>ID</th>
            <th>Image</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {filteredCustomerData.map((faq, index) => (
            <tr key={index}>
            <td>{faq.U_FIRSTNAME} {" "+faq.U_SURNAME}</td>
            <td>{faq.U_ID}</td>
            <td><img src="asserts/images/nouser.png" alt="CUSTOMER A" /></td>
            <td>
                <button onClick={() => ViewDetails(faq.U_ID)} className="book-UM-details">View Details</button>
                <button onClick={() => Edituser(faq.U_ID)} className="book-UM-edit">Edit</button>
                <button onClick={() => Removeuser(faq.U_ID)} className="book-UM-remove">Remove</button>
            </td>
            </tr>
        ))}
           
        </tbody>
        </table>
    </div>
    </div>
    {/* usermanagement Details Popup */}
    <div id="details-UM-Popup" className="details-UM-Popup">
    {userdata.map((faq, index) => (
    <div key={index} className="popup-UMdetails-content">
        <span className="close">×</span>
        <h2>User Details</h2>
        <p>Firstname: {faq.U_FIRSTNAME}</p>
        <p>Surname: {faq.U_SURNAME}</p>
        <p>Email: {faq.U_EMAIL}</p>
        <p>Title: {faq.U_TITLE}</p>
        <p>Contacts: {faq.U_CONTACT}</p>
        <p>UserType: {faq.U_USERTYPE}</p>
        <p>Registration Date: {formatDate(faq.U_REGDATE)}</p>
       
    </div>
    ))}
    </div>
    {/* Edit usermanagement Popup */}
    <div id="edit-UM-Popup" className="edit-UM-Popup">
    <div className="popup-UMedit-content">
        <span className="close">×</span>
        <form >
        <h2>Edit User Details</h2>
        <div className="input-group">
            <input type="text"
             value={fname}
             onChange={(e) => seteditfname(e.target.value)}
            required />
            <label>Firstname</label>
        </div>
        <div className="input-group">
            <input type="text"
            value={surname}
            onChange={(e) => seteditsurname(e.target.value)}
            required />
            <label>Surname</label>
        </div>
        <div className="input-group">
            <input type="text"
            value={email}
            onChange={(e) => seteditemail(e.target.value)}
            required />
            <label htmlFor>Email</label>
        </div>
        <div className="input-group">
            <input type="text"
             value={title}
            onChange={(e) => setedittitle(e.target.value)}
            required />
            <label htmlFor>Title</label>
        </div>
        <div className="input-group">
            <input type="text"
             value={constact}
            onChange={(e) => seteditcontacts(e.target.value)}
            required />
            <label htmlFor>Contacts</label>
        </div>
        <div className="input-group">
            <input type="text"
             value={usertype}
            onChange={(e) => seteditusertype(e.target.value)}
            required />
            <label htmlFor>UserType</label>
        </div>
        <button onClick={Saveuserdetails}>Save</button>
        </form>
    </div>
    </div>
    </div>
  )
}

export default Usersmain;