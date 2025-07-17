import React, { useEffect, useState} from 'react';
import axios from 'axios';

function Inboxmain() {
    const overlay = document.getElementById('overlay');
    const inboxBtns = document.querySelectorAll('.inboxBtn');
    const messageTextarea = document.getElementById('message');
    const quitBtns = document.querySelectorAll('#quitBtn, #quitBtnFooter');
    // messageTextarea = document.getElementById('message');
   
    
    inboxBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            overlay.style.display = 'flex';
        });
    });
    
    quitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            overlay.style.display = 'none';
            messageTextarea.value = '';
        });
    });

    
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [users,setusers]=useState([]);
    const [user,setuser]=useState('');
    const [selectedType, setSelectedType] = useState('1');
    const [messagetext, setmessage] = useState('');


    function Sendmessage(e)
    {
        e.preventDefault(); 
        let mesg= messagetext;
        console.log('working');
        axios.post('http://localhost:8081/newmessage',{mesg,user})
        .then(res => {
            const {data} =res;
            console.log('Server response data Message:', data); // Log the data to check the structure
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
    const toggleInboxSubMenu = (subMenuId) => {
        setActiveSubMenu(subMenuId);
    };
    const handleAdditionalClick = (userType) => {
        setSelectedType(userType);
    };
    const handleClick = (subMenuId, userType) => {
        return () => {
            toggleInboxSubMenu(subMenuId, userType);
            handleAdditionalClick(userType);
        };
    };
    const filteredDriverData = users.filter(user => user.U_USERTYPE === 1);
    const filteredCustomerData =users.filter(user => user.U_USERTYPE === 2);
    const filteredAdminData = users.filter(user => user.U_USERTYPE === 3);

    
    const InboxAdmin = (id) => {
       
      setuser(id);
    };
    const InboxDriver = (id) => {
       
        setuser(id);
      };
      const InboxCustomer = (id) => {
       
        setuser(id);
      };
   
    useEffect(() => {
        
        axios.get('http://localhost:8081/getallusers')
        .then(res => {
            const {data} =res;
           
            setusers(data);
        })
        .catch(err => console.log(err));

    }, [users]);
  return (

    <div>
        <div className="head-title">
                    <div className="left">
                        <h1>Inbox</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Inbox</a>
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
                    
                    <button
                        className={`menuinbox-btn ${activeSubMenu === 'driversinboxSubMenu' ? 'active' : ''}`}
                        onClick={handleClick('driversinboxSubMenu', '1')}
                    >
                        Drivers
                    </button>
                    <button
                        className={`menuinbox-btn ${activeSubMenu === 'alternativeAdmininboxSubMenu' ? 'active' : ''}`}
                        onClick={handleClick('alternativeAdmininboxSubMenu', '3')}
                    >
                        Alternative Admin
                    </button>
                    <button
                        className={`menuinbox-btn ${activeSubMenu === 'customersinboxSubMenu' ? 'active' : ''}`}
                        onClick={handleClick('customersinboxSubMenu', '2')}
                    >
                     Customers
                    </button>

                        <div id="driversinboxSubMenu" className="submenu" style={{ display: activeSubMenu === 'driversinboxSubMenu' ? 'block' : 'none' }}>
                        <table className="Inbox-table">
                            <thead className="Vehicle-head">
                            <tr>
                                <th>Driver Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody className="Vehicle-body">
                            {filteredDriverData.map((faq, index) => (
                                <tr key={index}>
                                <td>{faq.U_FIRSTNAME}</td>
                                <td>{faq.U_SURNAME}</td>
                                <td>{faq.U_EMAIL}</td>
                                
                                <td><button onClick={() => InboxDriver(faq.U_ID)} className="inboxBtn">Inbox</button></td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        </div>
                        
                        <div id="alternativeAdmininboxSubMenu" className="submenu" style={{ display: activeSubMenu === 'alternativeAdmininboxSubMenu' ? 'block' : 'none' }}>
                        <table className="Inbox-table">
                            <thead className="Vehicle-head">
                            <tr>
                                <th>Admin Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody className="Vehicle-body">
                             {filteredAdminData.map((faq, index) => (
                            <tr key={index}>
                                <td>{faq.U_FIRSTNAME}</td>
                                <td>{faq.U_SURNAME}</td>
                                <td>{faq.U_EMAIL}</td>
                                
                                <td><button onClick={() => InboxAdmin(faq.U_ID)} className="inboxBtn">Inbox</button></td>
                            </tr>
                             ))}
                           
                            </tbody>
                        </table>
                        </div>
                        <div id="customersinboxSubMenu" className="submenu" style={{ display: activeSubMenu === 'customersinboxSubMenu' ? 'block' : 'none' }}>
                        <table className="Inbox-table">
                            <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCustomerData.map((faq, index) => (
                                <tr key={index}>
                                <td>{faq.U_FIRSTNAME}</td>
                                <td>{faq.U_SURNAME}</td>
                                <td>{faq.U_EMAIL}</td>
                                
                                <td><button onClick={() => InboxCustomer(faq.U_ID)} className="inboxBtn">Inbox</button></td>
                                </tr>
                            ))}
                            
                            </tbody>
                        </table>
                        </div>
                        <div className="overlay" id="overlay">
                            <div className="popup">
                                <div className="popup-header">
                                <h2>Messaging Inbox</h2>
                                </div>
                                <div className="popup-content">
                                <textarea onChange={(e) => setmessage(e.target.value)} id="message" placeholder="Type your message here..."/>
                                </div>
                                <div className="popup-footer">
                                <button className="quit-btn" id="quitBtn">Quit</button>
                                
                                <button onClick={Sendmessage} className="send-btn" id="sendBtn">Send</button>
                                </div>
                        </div>
                        </div>

                    </div>
                    </div>
    </div>
  )
  }

  export default Inboxmain;