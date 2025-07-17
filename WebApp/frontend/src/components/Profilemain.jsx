import React ,{useState, useEffect} from 'react';
import axios from 'axios';
import GlobalVariables from '../Javascript/GlobalVariables';

function Profilename() {
    const [userid,setuserid]=useState('');
    const [userdata, setuserdata]=useState([]);
    

    // Effect to set userid from global variables
    useEffect(() => {
        setuserid(GlobalVariables.userId);
    }, []);
   
    useEffect(() => {
    
        
        if(userid!='')
        {
            let id=userid;
            axios.get('http://localhost:8081/getuser',{ params: { id } })
            .then(res => {
                const {data} =res;
               
                setuserdata(data);
            })
            .catch(err => console.log(err));
        
        
        }
       

    }, [userid]);
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
                        <h1>My Account</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">My Account</a>
                        </li>
                        </ul>
                    </div>
                    </div>
                    <div className="account-container">
                    <div className="account-sidebar">
                        <img src="asserts/images/people.png" className="profile-picture" Id="profileImage" />
                        <input type="file" Id="profileImageInput" style={{display: 'none'}} />
                        {userdata ?(
                           <h3  Id="accountName">{userdata.TITLE} {userdata.U_FIRSTNAME} {userdata.SURNAME}</h3>
                        ):(
                            <h3  Id="accountName">{userdata.TITLE} {userdata.U_FIRSTNAME} {userdata.SURNAME}</h3>
                        )}
                        <ul>
                        
                        <li ><a href="#" data-section="personalInfo">Personal Information</a></li>
                       
                        </ul>
                    </div>
                    <div className="account-content">
                    {userdata.map((faq,index)=>(
                        <h2 key={index}>Welcome, <span Id="welcomeName">{faq.U_FIRSTNAME} {faq.U_SURNAME}</span></h2>
                    ))}
                        {/* Add the relevant content for each section */}
                        {userdata.map((faq,index)=>(
                        <div key={index} Id="accountDashboard" className="account-section">
                        <p>Details</p>
                        <p> Email: {faq.U_EMAIL}</p>
                        <p> Title: {faq.U_TITLE} </p>
                        <p> Registerd On: {formatDate(faq.U_REGDATE)}</p>
                        </div>
                    ))}
                        <div Id="personalInfo" className="account-section" style={{display: 'none'}}>
                       
                        {userdata.map((faq,index)=>(
                        <div key={index} className="personal-info-container">
                            <div className="profile-photo">
                            <img src="asserts/images/people.png" className="profile-picture" Id="profileImage" />
                            <input type="file" Id="profileImageInput" style={{display: 'none'}} />
                            <p><a href="#" Id="changeProfilePhoto">Add a profile photo</a></p>
                            </div>
                            <div className="personal-info-details">
                            <p><i className="bx bxs-user" /> <span Id="userName">{faq.U_TITLE} {faq.U_FIRSTNAME} {faq.U_SURNAME}</span> <a href="#" className="edit-btn" data-field="name"></a></p>
                            
                            </div>
                        </div>
                        ))}
                        </div>
                        <div Id="loginSecurity" className="account-section" style={{display: 'none'}}>
                        <h3>Login &amp; Security</h3>
                        <div className="login-security-container">
                            <h3>Passkeys</h3>
                            <a href="#" Id="setupPasskeys" className="link">Set up your Passkeys</a>
                            <p>Passkeys offer a seamless, highly-secure way to log in with just a touch or a glance.</p>
                            <hr />
                            <h3>Other login options</h3>
                            <div className="login-option">
                            <span><i className="fab fa-apple" /> Apple</span> <a href="#" className="link social-link" data-platform="Apple">Link</a>
                            </div>
                            <div className="login-option">
                            <span><i className="fab fa-google" /> Google</span> <a href="#" className="link social-link" data-platform="Google">Link</a>
                            </div>
                            <div className="login-option">
                            <span><i className="fab fa-facebook" /> Facebook</span> <a href="#" className="link social-link" data-platform="Facebook">Link</a>
                            </div>
                            <p>Linking a social account allows you to sign in without using a phone. We will not use your social account for anything else without your permission.</p>
                        </div>
                        </div>
                        <div Id="addresses" className="account-section" style={{display: 'none'}}>
                        <h3>Addresses</h3>
                        <p>Addresses content goes here...</p>
                        </div>
                        <div Id="addHomeAddress" className="account-section" style={{display: 'none'}}>
                        <h3>Add Home Address</h3>
                        <div className="search-location">
                            <input type="text" placeholder="Search location" className="search-input" Id="homeAddressInput" />
                            <i className="fas fa-map-marker-alt" Id="addHomeAddressBtn" />
                        </div>
                        <ul className="location-results" Id="homeAddressList">
                            {/* List of added home addresses will appear here */}
                        </ul>
                        </div>
                        <div Id="addWorkAddress" className="account-section" style={{display: 'none'}}>
                        <h3>Add Work Address</h3>
                        <div className="search-location">
                            <input type="text" placeholder="Search location" className="search-input" Id="workAddressInput" />
                            <i className="fas fa-map-marker-alt" Id="addWorkAddressBtn" />
                        </div>
                        <ul className="location-results" Id="workAddressList">
                            {/* List of added work addresses will appear here */}
                        </ul>
                        </div>
                        <div Id="addPlace" className="account-section" style={{display: 'none'}}>
                        <h3>Add a Place</h3>
                        <p>Add a place content goes here...</p>
                        </div>
                    </div>
                    </div>
    </div>
  )
}
export default Profilename;