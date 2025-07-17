import React, { useEffect } from 'react';

const Diverjs = ({ activeSubMenu }) => {
  useEffect(() => {
    const setupSideMenu = () => {
      const handleSideMenuClick = (event) => {
        const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
        const li = event.currentTarget.parentElement;

        allSideMenu.forEach(i => {
          i.parentElement.classList.remove('active');
        });

        li.classList.add('active');

        document.querySelectorAll('main').forEach(main => {
          main.style.display = 'none';
        });

        const id = li.getAttribute('data-section');
        const section = document.getElementById(id);
        if (section) {
          section.style.display = 'block';
        }

        if (id === 'messages') {
          filterMessages(activeSubMenu === 'adminMessagesSubMenu' ? 'admin' : 'passenger');
        }
      };

      const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
      allSideMenu.forEach(item => {
        item.addEventListener('click', handleSideMenuClick);
      });

      return () => {
        allSideMenu.forEach(item => {
          item.removeEventListener('click', handleSideMenuClick);
        });
      };
    };

    const setupProfileIcon = () => {
      const profileIcon = document.getElementById('profileIcon');
      const handleProfileIconClick = () => {
        document.querySelectorAll('main').forEach(main => {
          main.style.display = 'none';
        });

        const myAccount = document.getElementById('myAccount');
        if (myAccount) {
          myAccount.style.display = 'block';
        }
      };

      profileIcon?.addEventListener('click', handleProfileIconClick);

      return () => {
        profileIcon?.removeEventListener('click', handleProfileIconClick);
      };
    };

    const setupMenuBar = () => {
      const menuBar = document.querySelector('#content nav .bx.bx-menu');
      const sidebar = document.getElementById('sidebar');

      const handleMenuBarClick = () => {
        sidebar?.classList.toggle('hide');
      };

      menuBar?.addEventListener('click', handleMenuBarClick);

      return () => {
        menuBar?.removeEventListener('click', handleMenuBarClick);
      };
    };

    const setupInboxButtons = () => {
      const handleInboxBtnClick = (event) => {
        const btn = event.currentTarget;
        const senderName = btn.getAttribute('data-sender');
        const messageContent = btn.getAttribute('data-message');
        const replyModal = document.getElementById('replyModal');
        const replySenderName = document.getElementById('replySenderName');
        const originalMessage = document.getElementById('originalMessage');

        if (replySenderName && originalMessage) {
          replySenderName.textContent = `Messaging Inbox - Replying to ${senderName}`;
          originalMessage.textContent = `Original Message: ${messageContent}`;
        }
        if (replyModal) {
          replyModal.style.display = 'block';
        }
      };

      const inboxBtns = document.querySelectorAll('.inboxBtn');
      inboxBtns.forEach(btn => {
        btn.addEventListener('click', handleInboxBtnClick);
      });

      const closeReplyModal = () => {
        const replyModal = document.getElementById('replyModal');
        if (replyModal) {
          replyModal.style.display = 'none';
        }
      };

      const sendReply = () => {
        const replyText = document.getElementById('reply-text');
        const replyModal = document.getElementById('replyModal');
        const replySentModal = document.getElementById('replySentModal');

        if (replyText && replyText.value.trim() !== "") {
          if (replyModal) {
            replyModal.style.display = 'none';
          }
          if (replySentModal) {
            replySentModal.style.display = 'block';
          }
          replyText.value = '';
        } else {
          alert('Please type a message before sending.');
        }
      };

      const closeReplySentModal = () => {
        const replySentModal = document.getElementById('replySentModal');
        if (replySentModal) {
          replySentModal.style.display = 'none';
        }
      };

      document.querySelector('.close-reply-btn')?.addEventListener('click', closeReplyModal);
      document.getElementById('quitReplyBtn')?.addEventListener('click', closeReplyModal);
      document.getElementById('sendReplyBtn')?.addEventListener('click', sendReply);
      document.querySelector('.close-reply-sent-btn')?.addEventListener('click', closeReplySentModal);

      window.addEventListener('click', (event) => {
        const replyModal = document.getElementById('replyModal');
        const replySentModal = document.getElementById('replySentModal');

        if (event.target === replyModal) {
          replyModal.style.display = 'none';
        }
        if (event.target === replySentModal) {
          replySentModal.style.display = 'none';
        }
      });

      return () => {
        inboxBtns.forEach(btn => {
          btn.removeEventListener('click', handleInboxBtnClick);
        });
        document.querySelector('.close-reply-btn')?.removeEventListener('click', closeReplyModal);
        document.getElementById('quitReplyBtn')?.removeEventListener('click', closeReplyModal);
        document.getElementById('sendReplyBtn')?.removeEventListener('click', sendReply);
        document.querySelector('.close-reply-sent-btn')?.removeEventListener('click', closeReplySentModal);
        window.removeEventListener('click', (event) => {
          const replyModal = document.getElementById('replyModal');
          const replySentModal = document.getElementById('replySentModal');

          if (event.target === replyModal) {
            replyModal.style.display = 'none';
          }
          if (event.target === replySentModal) {
            replySentModal.style.display = 'none';
          }
        });
      };
    };

    const setupAcceptDriveButtons = () => {
      const handleAcceptDriveClick = (event) => {
        const btn = event.currentTarget;
        const tripDetailsModal = document.getElementById('tripDetailsModal');
        const tripDetails = document.getElementById('tripDetails');
        const tripId = btn.getAttribute('data-trip-id');
        const routeId = btn.getAttribute('data-route-id');
        const pickup = btn.getAttribute('data-pickup');
        const dropoff = btn.getAttribute('data-dropoff');
        const seats = btn.getAttribute('data-seats');
        const price = btn.getAttribute('data-price');

        if (tripDetails) {
          tripDetails.innerHTML = `
            <p>Trip ID: ${tripId}</p>
            <p>Route ID: ${routeId}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Pickup Location: ${pickup}</p>
            <p>Drop-off Location: ${dropoff}</p>
            <p>Available Seats: ${seats}</p>
            <p>Price: R${price}</p>
          `;
        }
        if (tripDetailsModal) {
          tripDetailsModal.style.display = 'block';
        }
      };

      const acceptDriveButtons = document.querySelectorAll('.accept-drive-btn');
      acceptDriveButtons.forEach(btn => {
        btn.addEventListener('click', handleAcceptDriveClick);
      });

      const closeTripDetailsModal = () => {
        const tripDetailsModal = document.getElementById('tripDetailsModal');
        if (tripDetailsModal) {
          tripDetailsModal.style.display = 'none';
        }
      };

      const acceptTrip = () => {
        const tripDetails = document.getElementById('tripDetails');
        const tripId = tripDetails.querySelector('p:nth-child(1)').textContent.split(': ')[1];
        const acceptButton = document.querySelector(`button[data-trip-id="${tripId}"]`);
        
        if (acceptButton) {
          acceptButton.textContent = 'Accepted';
          acceptButton.disabled = true;
        }

        closeTripDetailsModal();
      };

      document.querySelector('.close-trip-details-btn')?.addEventListener('click', closeTripDetailsModal);
      document.getElementById('quitTripDetailsBtn')?.addEventListener('click', closeTripDetailsModal);
      document.getElementById('acceptTripBtn')?.addEventListener('click', acceptTrip);

      window.addEventListener('click', (event) => {
        const tripDetailsModal = document.getElementById('tripDetailsModal');
        if (event.target === tripDetailsModal) {
          tripDetailsModal.style.display = 'none';
        }
      });

      return () => {
        acceptDriveButtons.forEach(btn => {
          btn.removeEventListener('click', handleAcceptDriveClick);
        });
        document.querySelector('.close-trip-details-btn')?.removeEventListener('click', closeTripDetailsModal);
        document.getElementById('quitTripDetailsBtn')?.removeEventListener('click', closeTripDetailsModal);
        document.getElementById('acceptTripBtn')?.removeEventListener('click', acceptTrip);
        window.removeEventListener('click', (event) => {
          const tripDetailsModal = document.getElementById('tripDetailsModal');
          if (event.target === tripDetailsModal) {
            tripDetailsModal.style.display = 'none';
          }
        });
      };
    };

    const setupRideRows = () => {
      const handleRideRowClick = (event) => {
        const row = event.currentTarget;
        const rideDetailsModal = document.getElementById('rideDetailsModal');
        const rideDetails = document.getElementById('rideDetails');
        const passenger = row.getAttribute('data-passenger');
        const date = row.getAttribute('data-date');
        const status = row.getAttribute('data-status');
        const pickup = row.getAttribute('data-pickup');
        const dropoff = row.getAttribute('data-dropoff');
        const price = row.getAttribute('data-price');
        const bookingId = row.getAttribute('data-booking-id');

        if (rideDetails) {
          rideDetails.innerHTML = `
            <p>Passenger Name: ${passenger}</p>
            <p>Date: ${date}</p>
            <p>Status: ${status}</p>
            <p>Pickup Location: ${pickup}</p>
            <p>Drop-off Location: ${dropoff}</p>
            <p>Price: R${price}</p>
            <p>Booking ID: ${bookingId}</p>
          `;
        }
        if (rideDetailsModal) {
          rideDetailsModal.style.display = 'block';
        }
      };

      const rideRows = document.querySelectorAll('.ride-row');
      rideRows.forEach(row => {
        row.addEventListener('click', handleRideRowClick);
      });

      const closeRideDetailsModal = () => {
        const rideDetailsModal = document.getElementById('rideDetailsModal');
        if (rideDetailsModal) {
          rideDetailsModal.style.display = 'none';
        }
      };

      document.querySelector('.close-ride-details-btn')?.addEventListener('click', closeRideDetailsModal);
      document.getElementById('quitRideDetailsBtn')?.addEventListener('click', closeRideDetailsModal);

      window.addEventListener('click', (event) => {
        const rideDetailsModal = document.getElementById('rideDetailsModal');
        if (event.target === rideDetailsModal) {
          rideDetailsModal.style.display = 'none';
        }
      });

      return () => {
        rideRows.forEach(row => {
          row.removeEventListener('click', handleRideRowClick);
        });
        document.querySelector('.close-ride-details-btn')?.removeEventListener('click', closeRideDetailsModal);
        document.getElementById('quitRideDetailsBtn')?.removeEventListener('click', closeRideDetailsModal);
        window.removeEventListener('click', (event) => {
          const rideDetailsModal = document.getElementById('rideDetailsModal');
          if (event.target === rideDetailsModal) {
            rideDetailsModal.style.display = 'none';
          }
        });
      };
    };

    const setupSearchForm = () => {
      const searchButton = document.querySelector('#content nav form .form-input button');
      const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
      const searchForm = document.querySelector('#content nav form');

      const handleSearchButtonClick = (e) => {
        if (window.innerWidth < 576) {
          e.preventDefault();
          searchForm?.classList.toggle('show');
          if (searchForm?.classList.contains('show')) {
            searchButtonIcon?.classList.replace('bx-search', 'bx-x');
          } else {
            searchButtonIcon?.classList.replace('bx-x', 'bx-search');
          }
        }
      };

      const handleWindowResize = () => {
        if (window.innerWidth > 576) {
          searchButtonIcon?.classList.replace('bx-x', 'bx-search');
          searchForm?.classList.remove('show');
        }
      };

      searchButton?.addEventListener('click', handleSearchButtonClick);
      window.addEventListener('resize', handleWindowResize);

      const handleSearchFormSubmit = (e) => {
        e.preventDefault();
        const query = document.getElementById('searchInput')?.value.toLowerCase().trim();
        if (!query) {
          alert('Please enter a search term');
          return;
        }
        let found = false;
        document.querySelectorAll('main').forEach(main => {
          if (main.textContent.toLowerCase().includes(query)) {
            main.style.display = 'block';
            found = true;
          } else {
            main.style.display = 'none';
          }
        });
        if (!found) {
          alert('Results not available. Try again.');
        }
      };

      document.getElementById('searchForm')?.addEventListener('submit', handleSearchFormSubmit);

      return () => {
        searchButton?.removeEventListener('click', handleSearchButtonClick);
        window.removeEventListener('resize', handleWindowResize);
        document.getElementById('searchForm')?.removeEventListener('submit', handleSearchFormSubmit);
      };
    };

    const setupSwitchMode = () => {
      const switchMode = document.getElementById('switch-mode');
      const handleSwitchModeChange = function () {
        if (this.checked) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      };

      switchMode?.addEventListener('change', handleSwitchModeChange);

      return () => {
        switchMode?.removeEventListener('change', handleSwitchModeChange);
      };
    };

    const setupIncidentForm = () => {
      const handleIncidentFormSubmit = (event) => {
        event.preventDefault();
        const reportSuccessModal = document.getElementById('reportSuccessModal');
        const routeId = document.getElementById('route-id')?.value;
        const reportSuccessMessage = document.getElementById('reportSuccessMessage');
        if (reportSuccessMessage && routeId) {
          reportSuccessMessage.textContent = `You have successfully reported the incident of route ID ${routeId}`;
          if (reportSuccessModal) {
            reportSuccessModal.style.display = 'block';
          }
          document.getElementById('route-id').value = '';
          document.getElementById('description').value = '';
        }
      };

      document.getElementById('incidentForm')?.addEventListener('submit', handleIncidentFormSubmit);

      const closeReportModal = () => {
        const reportSuccessModal = document.getElementById('reportSuccessModal');
        if (reportSuccessModal) {
          reportSuccessModal.style.display = 'none';
        }
      };

      document.getElementById('closeReportModalBtn')?.addEventListener('click', closeReportModal);

      return () => {
        document.getElementById('incidentForm')?.removeEventListener('submit', handleIncidentFormSubmit);
        document.getElementById('closeReportModalBtn')?.removeEventListener('click', closeReportModal);
      };
    };

    const setupNotification = () => {
      const notificationIcon = document.getElementById('notificationIcon');
      const notificationModal = document.getElementById('notificationModal');
      const closeNotificationBtn = document.querySelector('.close-btn');
      const notificationList = document.getElementById('notificationList');

      const notifications = [
        { sender: 'Driver(Letheba)', message: 'I got a tire puncture', timestamp: '2024-02-23 17:00' },
        { sender: 'Driver(Letheba Gebralters)', message: 'I got a tire puncture', timestamp: '2024-02-23 17:00' },
        { sender: 'Customer(Elisa Mphago)', message: 'Reported missing bag', timestamp: '2024-02-23 17:00' },
        { sender: 'Driver(Letheba)', message: 'I got a tire puncture', timestamp: '2024-02-23 17:00' },
      ];

      const displayNotifications = () => {
        if (notificationList) {
          notificationList.innerHTML = '';
          notifications.forEach(notification => {
            const li = document.createElement('li');
            li.classList.add('notification-item');
            li.innerHTML = `
              <div>
                <span><strong>${notification.sender}</strong></span>
                <span>${notification.message}</span>
              </div>
              <span>${notification.timestamp}</span>
            `;
            notificationList?.appendChild(li);
          });
        }
      };

      const handleNotificationClick = () => {
        if (notificationModal) {
          notificationModal.style.display = 'block';
        }
        displayNotifications();
      };

      notificationIcon?.addEventListener('click', handleNotificationClick);

      closeNotificationBtn?.addEventListener('click', () => {
        if (notificationModal) {
          notificationModal.style.display = 'none';
        }
      });

      return () => {
        notificationIcon?.removeEventListener('click', handleNotificationClick);
        closeNotificationBtn?.removeEventListener('click', () => {
          if (notificationModal) {
            notificationModal.style.display = 'none';
          }
        });
      };
    };

    const setupHomeAddress = () => {
      const handleHomeAddressAdd = () => {
        const homeAddressInput = document.getElementById('homeAddressInput');
        const homeAddressList = document.getElementById('homeAddressList');
        const address = homeAddressInput?.value.trim();

        if (address) {
          const li = document.createElement('li');
          li.innerHTML = `
            <i class="fas fa-clock"></i>
            <div>
              <span>${address}</span>
              <p>Auckland Park, Johannesburg</p>
            </div>
            <div>
              <span class="edit-btn" onclick="editAddress(this, 'home')">Edit</span>
              <span class="delete-btn" onclick="deleteAddress(this, 'home')">Delete</span>
            </div>
          `;
          homeAddressList?.appendChild(li);
          homeAddressInput.value = '';
        } else {
          alert('Please enter an address.');
        }
      };

      document.getElementById('addHomeAddressBtn')?.addEventListener('click', handleHomeAddressAdd);

      return () => {
        document.getElementById('addHomeAddressBtn')?.removeEventListener('click', handleHomeAddressAdd);
      };
    };

    const setupProfile = () => {
      const userName = "Mphaga Jr. Philelo";
      const accountName = document.getElementById('accountName');
      const welcomeName = document.getElementById('welcomeName');

      if (accountName && welcomeName) {
        accountName.textContent = userName;
        welcomeName.textContent = userName;
      }

      const profileImageInput = document.getElementById('profileImageInput');
      const profileImage = document.getElementById('profileImage');
      const personalProfileImage = document.getElementById('personalProfileImage');

      const handleProfileImageChange = function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            if (profileImage) {
              profileImage.src = e.target.result;
            }
            if (personalProfileImage) {
              personalProfileImage.src = e.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      };

      profileImageInput?.addEventListener('change', handleProfileImageChange);

      const handleProfileImageClick = (e) => {
        e.preventDefault();
        profileImageInput?.click();
      };

      profileImage?.addEventListener('click', handleProfileImageClick);
      personalProfileImage?.addEventListener('click', handleProfileImageClick);

      const handleChangeProfilePhotoClick = (e) => {
        e.preventDefault();
        profileImageInput?.click();
      };

      const changeProfilePhoto = document.getElementById('changeProfilePhoto');
      changeProfilePhoto?.addEventListener('click', handleChangeProfilePhotoClick);

      return () => {
        profileImageInput?.removeEventListener('change', handleProfileImageChange);
        profileImage?.removeEventListener('click', handleProfileImageClick);
        personalProfileImage?.removeEventListener('click', handleProfileImageClick);
        changeProfilePhoto?.removeEventListener('click', handleChangeProfilePhotoClick);
      };
    };

    const setupAccountSidebar = () => {
      const handleAccountSidebarClick = (event) => {
        event.preventDefault();
        document.querySelectorAll('.account-section').forEach((section) => {
          section.style.display = 'none';
        });
        document.querySelectorAll('.account-sidebar ul li').forEach((li) => {
          li.classList.remove('active');
        });
        const sectionId = event.currentTarget.getAttribute('data-section');
        document.getElementById(sectionId).style.display = 'block';
        event.currentTarget.parentElement.classList.add('active');
      };

      const accountSidebarLinks = document.querySelectorAll('.account-sidebar ul li a');
      accountSidebarLinks.forEach((link) => {
        link.addEventListener('click', handleAccountSidebarClick);
      });

      return () => {
        accountSidebarLinks.forEach((link) => {
          link.removeEventListener('click', handleAccountSidebarClick);
        });
      };
    };

    const filterMessages = (senderType) => {
      const adminMessagesSubMenu = document.getElementById('adminMessagesSubMenu');
      const passengerMessagesSubMenu = document.getElementById('passengerMessagesSubMenu');

      if (adminMessagesSubMenu && passengerMessagesSubMenu) {
        if (senderType === 'admin') {
          adminMessagesSubMenu.style.display = 'block';
          passengerMessagesSubMenu.style.display = 'none';
        } else if (senderType === 'passenger') {
          adminMessagesSubMenu.style.display = 'none';
          passengerMessagesSubMenu.style.display = 'block';
        }
      }
    };

    // Setup all functionality
    const cleanupSideMenu = setupSideMenu();
    const cleanupProfileIcon = setupProfileIcon();
    const cleanupMenuBar = setupMenuBar();
    const cleanupInboxButtons = setupInboxButtons();
    const cleanupAcceptDriveButtons = setupAcceptDriveButtons();
    const cleanupRideRows = setupRideRows();
    const cleanupSearchForm = setupSearchForm();
    const cleanupSwitchMode = setupSwitchMode();
    const cleanupIncidentForm = setupIncidentForm();
    const cleanupNotification = setupNotification();
    const cleanupHomeAddress = setupHomeAddress();
    const cleanupProfile = setupProfile();
    const cleanupAccountSidebar = setupAccountSidebar();

    return () => {
      cleanupSideMenu();
      cleanupProfileIcon();
      cleanupMenuBar();
      cleanupInboxButtons();
      cleanupAcceptDriveButtons();
      cleanupRideRows();
      cleanupSearchForm();
      cleanupSwitchMode();
      cleanupIncidentForm();
      cleanupNotification();
      cleanupHomeAddress();
      cleanupProfile();
      cleanupAccountSidebar();
    };
  }, [activeSubMenu]);

  return null;
};

export default Diverjs;
