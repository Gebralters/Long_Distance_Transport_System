import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Homejs from '../Javascript/Homejs';
import Inboxmain from '../components/Inboxmain';
import Analyticsmain from '../components/Analyticsmain';
import Faqmain from '../components/Faqmain';
import Bookingslot from '../components/Bookingslot';
import Vehiclemain from '../components/Vehiclemain';
import Routemain from '../components/Routemain';
import Couriermain from '../components/Couriermain';
import Drivermain from '../components/Drivermain';
import Profilemain from '../components/Profilemain';
import Usersmain from '../components/Usersmain';
import Dashmain from '../components/Dashmain';
import CurveChart from '../Javascript/CurveChart';
import BarChart from '../Javascript/BarChart';
import PieChart from '../Javascript/PieChart';
import { useLocation } from 'react-router-dom';
import GlobalVariables from '../Javascript/GlobalVariables';



const HomePage = ()=> {
    const [userid,setuserid]=useState('');
    const [userdata, setuserdata]=useState([]);
    
    const [notifidata, setnotifidata]=useState([]);
    const [loginstatus, setloginstatus]=useState('Login');

    // Effect to set userid from global variables
    useEffect(() => {
        setuserid(GlobalVariables.userId);
    }, []);
   
    useEffect(() => {
    
        console.log(userid);
        if(userid!='')
        {
            setloginstatus('Logout');

            console.log('running');
           console.log('user '+userid);
            axios.get('http://localhost:8081/getnotification',{ params: { userid } })
            .then(res => {
                const {data} =res;
                console.log('Server response data:', data); // Log the data to check the structure
                setnotifidata(data);
            })
            .catch(err => console.log(err));

            axios.get('http://localhost:8081/getuser',{ params: { userid } })
            .then(res => {
                const {data} =res;
                console.log('Server response data:', data); // Log the data to check the structure
                setuserdata(data);
            })
            .catch(err => console.log(err));
        
        
        }
        else{
            setloginstatus('Login');
        }
       

    }, [userid]);
    useEffect(() => {
      /* booking popups */
            // Event listener for profile icon
            const profileIcon = document.getElementById('profileIcon');
            if (profileIcon) {
                profileIcon.addEventListener('click', function() {
                // Hide all main sections
                document.querySelectorAll('main').forEach(main => {
                    main.style.display = 'none';
                });
                
                // Show My Account section
                document.getElementById('myAccount').style.display = 'block';
                });
            }

            const profileImage = document.getElementById("profileImage");
            if (profileImage) {
                profileImage.addEventListener("click", function(e) {
                e.preventDefault();
                document.getElementById("profileImageInput").click();
                });
            }

            const changeProfilePhoto = document.getElementById("changeProfilePhoto");
            if (changeProfilePhoto) {
                changeProfilePhoto.addEventListener("click", function(e) {
                e.preventDefault();
                document.getElementById("profileImageInput").click();
                });
            }

            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", function(e) {
                e.preventDefault();
                const field = this.getAttribute("data-field");
                let newValue = prompt(`Enter new value for ${field}:`);
                if (newValue) {
                    document.getElementById(`user${capitalizeFirstLetter(field)}`).textContent = newValue;
                }
                });
            });

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
    }, []);
    
    useEffect(() => {
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
      
        searchForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const query = searchInput.value.toLowerCase().trim();
          if (!query) {
            alert('Please enter a search term');
            return;
          }
          let found = false;
          document.querySelectorAll('main').forEach(main => {
            if (main.id.toLowerCase().includes(query)) {
              main.style.display = 'block';
              found = true;
            } else {
              main.style.display = 'none';
            }
          });
          if (!found) {
            alert('Results not available, try again.');
          }
        });
    
       
    
       
    }, []);
    useEffect(() => {
        const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

        allSideMenu.forEach(item=> {
            const li = item.parentElement;
        
            item.addEventListener('click', function () {
                allSideMenu.forEach(i=> {
                    i.parentElement.classList.remove('active');
                })
                li.classList.add('active');
            })
        });
        
        
        // Get sidebar menu items
        const menuItems = document.querySelectorAll('.side-menu li');
        
        // Add click event listener to each menu item
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Get the ID of the clicked menu item
                const id = item.getAttribute('data-section');
        
                // Hide all main sections
                document.querySelectorAll('main').forEach(main => {
                    main.style.display = 'none';
                });
        
                // Show the corresponding main section
                document.getElementById(id).style.display = 'block';
            });
        });
        
        // TOGGLE SIDEBAR
        const menuBar = document.querySelector('#content nav .bx.bx-menu');
        const sidebar = document.getElementById('sidebar');
        
        menuBar.addEventListener('click', function () {
            sidebar.classList.toggle('hide');
        })
        
        function filteranalytics(SubSection)
        {
           var subsection=document.getElementById(SubSection);
           var buttons = document.getElementsByClassName("ana-btn");
        
           for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
           }
        
           document.querySelector('.ana-btn[onclick*="' + SubSection + '"]').classList.add("active");
        
           var subMenus = document.getElementsByClassName("subsection");
             
            for (var i = 0; i < subMenus.length; i++) {
                
                subMenus[i].style.display = "none";
            }
        
           subsection.style.display = "block";
        }
        
        function toggleSubMenu(subMenuId) {
            var subMenu = document.getElementById(subMenuId + "SubMenu");
            var buttons = document.getElementsByClassName("menu-btn");
        
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("active");
            }
        
            document.querySelector('.menu-btn[onclick*="' + subMenuId + '"]').classList.add("active");
        
            var subMenus = document.getElementsByClassName("submenu");
            for (var i = 0; i < subMenus.length; i++) {
                subMenus[i].style.display = "none";
            }
        
            subMenu.style.display = "block";
        }
        
        
        function toggleinboxSubMenu(subMenuId) {
            var subMenu = document.getElementById(subMenuId + "SubMenu");
            var buttons = document.getElementsByClassName("menuinbox-btn");
        
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("active");
            }
        
            document.querySelector('.menuinbox-btn[onclick*="' + subMenuId + '"]').classList.add("active");
        
            var subMenus = document.getElementsByClassName("submenu");
            for (var i = 0; i < subMenus.length; i++) {
                subMenus[i].style.display = "none";
            }
        
            subMenu.style.display = "block";
        }
        
        
        const searchButton = document.querySelector('#content nav form .form-input button');
        const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
        const searchForm = document.querySelector('#content nav form');
        
        searchButton.addEventListener('click', function (e) {
            if(window.innerWidth < 576) {
                e.preventDefault();
                searchForm.classList.toggle('show');
                if(searchForm.classList.contains('show')) {
                    searchButtonIcon.classList.replace('bx-search', 'bx-x');
                } else {
                    searchButtonIcon.classList.replace('bx-x', 'bx-search');
                }
            }
        })
        
        
        
        
        
        if(window.innerWidth < 768) {
            sidebar.classList.add('hide');
        } else if(window.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
        
        
        window.addEventListener('resize', function () {
            if(this.innerWidth > 576) {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
                searchForm.classList.remove('show');
            }
        })
        
        
        
        const switchMode = document.getElementById('switch-mode');
        
        switchMode.addEventListener('change', function () {
            if(this.checked) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        })
        
        
     
    }, []);
    useEffect(() => {
        const searchForm = document.getElementById('searchForm');
            const searchInput = document.getElementById('searchInput');
          
            searchForm.addEventListener('submit', function(e) {
              e.preventDefault();
              const query = searchInput.value.toLowerCase().trim();
              if (!query) {
                alert('Please enter a search term');
                return;
              }
              let found = false;
              document.querySelectorAll('main').forEach(main => {
                if (main.id.toLowerCase().includes(query)) {
                  main.style.display = 'block';
                  found = true;
                } else {
                  main.style.display = 'none';
                }
              });
              if (!found) {
                alert('Results not available, try again.');
              }
            });
        // Select the elements from the DOM
        const notPopup = document.getElementById('notPopup');
        const notButton = document.querySelectorAll('.num');
        

        const handleNotSlotClick = () => {
            if (notPopup) {
                notPopup.style.display = 'flex';
            }
        };

        const handleCloseClick = () => {
            if (notPopup) {
                notPopup.style.display = 'none';
            } 
        };

        const handleWindowClick = (event) => {
            if (event.target === notPopup) {
                notPopup.style.display = 'none';
            }
            
        };
        // Add event listeners
        notButton.forEach(button => {
            button.addEventListener('click', handleNotSlotClick);
        });
        window.addEventListener('click', handleWindowClick);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            notButton.forEach(button => {
                button.removeEventListener('click', handleNotSlotClick);
            });

            
            window.removeEventListener('click', handleWindowClick);
        };
    }, []);
  return (
    <div className='Bodycss'>   
            <div className="admin-page">
            <div className="container-navbar">
                <div className="layer-1">
                <header>
                    <h2 className="Logo"><span className="dark-text">Comfort</span>Cruize</h2>
                    <nav className="navigation">
                    <a href="#">Home</a>
                    <a href="/">{loginstatus}</a>
                    </nav>
                </header>
                </div>
            </div>
            <div className="container-navbar2">
                {/* SIDEBAR */}
                <section Id="sidebar">
                <a href="#" className="brand">
                    <i className="bx bxs-smile" />
                    <span className="text">Admin</span>
                </a>
                <ul className="side-menu top">
                    <li className="active" data-section="dashboard">
                    <a href="#">
                        <i className="bx bxs-dashboard" />
                        <span className="text">Dashboard</span>
                    </a>
                    </li>
                    <li data-section="bookingslot">
                    <a href="#">
                        <i className="bx bxs-shopping-bag-alt" />
                        <span className="text">Manage Booking Slots</span>
                    </a>
                    </li>
                    <li data-section="courier">
                    <a href="#">
                        <i className="bx bxs-shopping-bag-alt" />
                        <span className="text">Courier Services</span>
                    </a>
                    </li>
                    <li data-section="analytics">
                    <a href="#">
                        <i className="bx bxs-doughnut-chart" />
                        <span className="text">Analytics</span>
                    </a>
                    </li>
                    <li data-section="inbox">
                    <a href="#">
                        <i className="bx bxs-message-dots" />
                        <span className="text">Messages</span>
                    </a>
                    </li>
                    <li data-section="drivers">
                    <a href="#">
                        <i className="bx bxs-group" />
                        <span className="text">View Drivers</span>
                    </a>
                    </li>
                    <li data-section="routes">
                    <a href="#">
                        <i className="bx bxs-group" />
                        <span className="text">Manage Routes</span>
                    </a>
                    </li>
                    <li data-section="manageusers">
                    <a href="#">
                        <i className="bx bxs-group" />
                        <span className="text">Manage Users</span>
                    </a>
                    </li>
                    <li data-section="managevehicles">
                    <a href="#">
                        <i className="bx bxs-group" />
                        <span className="text">Manage Vehicles</span>
                    </a>
                    </li>
                    <li data-section="manageFAQ">
                    <a href="#">
                        <i className="bx bxs-group" />
                        <span className="text">FAQ Setup</span>
                    </a>
                    </li>
                </ul>
                </section>
                {/* SIDEBAR */}
                {/* CONTENT */}
                <section Id="content">
                {/* NAVBAR */}
                <nav>
                    <i className="bx bx-menu" />
                    <a href="#" className="nav-link" />
                    <form Id="searchForm">
                    <div className="form-input">
                        <input type="search" placeholder="Search..." Id="searchInput" />
                        <button type="submit" className="search-btn"><i className="bx bx-search" /></button>
                    </div>
                    </form>
                    <input type="checkbox" Id="switch-mode" hidden />
                    <label htmlFor="switch-mode" className="switch-mode" />
                    <div className="notification">          
                    <button Id="noti-span" className="num">{notifidata.length}</button>
                    </div>
                    <a href="#" className="profile" Id="profileIcon">
                    <img src="asserts/images/people.png" />
                    </a>
                    {/* View Details Popup */}
                    <div Id="notPopup" className="popupnot">
                    <div className="popupnot-content">
                        <span className="close">×</span>
                        <h2>Notifications</h2>
                        <div className="not-contents">
                        {notifidata.map((faq,index)=>(
                        <div key={index} className="not-contents-single">
                            <p>{faq.NOT_STATUS}</p>
                            <p>{faq.NOT_CONTENT}</p>
                            <p>{faq.NOT_TIMESTAMP}</p>
                        </div>
                        
                        ))}
                        </div>
                    </div>
                    </div>
                </nav>
                {/* NAVBAR */}
                {/* MAIN */}
                <main className="main-dashboard" Id="dashboard">
                    <Dashmain/>
                </main>
                <main Id="myAccount" className="main-MyAccount" style={{display: 'none'}}>
                    <Profilemain/>
                </main>
                <main Id="courier" className="main-Courier">
                    <Couriermain/>
                </main>
                <main Id="analytics" className="main-Analytics">
                    <Analyticsmain/>
                </main>
                <main Id="inbox" className="main-Inbox">
                    <Inboxmain/>
                </main>
                <main Id="drivers" className="main-Drivers">
                    <Drivermain/>
                </main>
                <main Id="routes" className="main-Drivers">
                    <Routemain/>
                </main>
                <main Id="managevehicles" className="manage-vehicles">
                    <Vehiclemain/>
                </main>
                <main Id="bookingslot" className="booking-slot">
                    <Bookingslot/>
                </main>
                <main Id="manageusers" className="main-ManageUsers">
                    <Usersmain/>
                </main>
                <main Id="manageFAQ" className="main-Managefaq">
                    <Faqmain/>
                </main>
                {/* MAIN */}
                </section>
                {/* CONTENT */}
            </div>
            </div>


    <Homejs/> 
    </div>
   
  )
}

export default HomePage;
