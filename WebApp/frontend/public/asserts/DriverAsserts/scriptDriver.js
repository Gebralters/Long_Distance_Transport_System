

const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
  const li = item.parentElement;

  item.addEventListener('click', function () {
    allSideMenu.forEach(i => {
      i.parentElement.classList.remove('active');
    })
    li.classList.add('active');
    
    // Hide all main sections
    document.querySelectorAll('main').forEach(main => {
      main.style.display = 'none';
    });
    
    // Show the corresponding main section
    const id = li.getAttribute('data-section');
    document.getElementById(id).style.display = 'block';

    // If the section is messages, show only admin messages initially
    if (id === 'messages') {
      filterMessages('admin');
    }
  });
});

// Event listener for profile icon
const profileIcon = document.getElementById('profileIcon');
profileIcon.addEventListener('click', function() {
  // Hide all main sections
  document.querySelectorAll('main').forEach(main => {
    main.style.display = 'none';
  });
  
  // Show My Account section
  document.getElementById('myAccount').style.display = 'block';
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
})

const inboxBtns = document.querySelectorAll('.inboxBtn');
const replyModal = document.getElementById('replyModal');
const closeReplyBtn = document.querySelector('.close-reply-btn');
const sendReplyBtn = document.getElementById('sendReplyBtn');
const quitReplyBtn = document.getElementById('quitReplyBtn');
const replySentModal = document.getElementById('replySentModal');
const closeReplySentBtn = document.querySelector('.close-reply-sent-btn');
const replySenderName = document.getElementById('replySenderName');
const originalMessage = document.getElementById('originalMessage');

inboxBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const senderName = btn.getAttribute('data-sender');
    const messageContent = btn.getAttribute('data-message');
    replySenderName.textContent = `Messaging Inbox - Replying to ${senderName}`;
    originalMessage.textContent = `Original Message: ${messageContent}`;
    replyModal.style.display = 'block';
  });
});

closeReplyBtn.addEventListener('click', () => {
  replyModal.style.display = 'none';
});

quitReplyBtn.addEventListener('click', () => {
  replyModal.style.display = 'none';
});

sendReplyBtn.addEventListener('click', () => {
  const replyText = document.getElementById('reply-text').value;
  if (replyText.trim() !== "") {
    replyModal.style.display = 'none';
    replySentModal.style.display = 'block';
    document.getElementById('reply-text').value = '';
  } else {
    alert('Please type a message before sending.');
  }
});

closeReplySentBtn.addEventListener('click', () => {
  replySentModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == replyModal) {
    replyModal.style.display = 'none';
  }
  if (event.target == replySentModal) {
    replySentModal.style.display = 'none';
  }
});

// Trip details modal functionality
const acceptDriveButtons = document.querySelectorAll(".accept-drive-btn");
const tripDetailsModal = document.getElementById('tripDetailsModal');
const closeTripDetailsBtn = document.querySelector('.close-trip-details-btn');
const acceptTripBtn = document.getElementById('acceptTripBtn');
const quitTripDetailsBtn = document.getElementById('quitTripDetailsBtn');
const tripDetails = document.getElementById('tripDetails');
let currentTripButton = null;

acceptDriveButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tripId = btn.getAttribute('data-trip-id');
    const routeId = btn.getAttribute('data-route-id');
    const pickup = btn.getAttribute('data-pickup');
    const dropoff = btn.getAttribute('data-dropoff');
    const seats = btn.getAttribute('data-seats');
    const price = btn.getAttribute('data-price');
    
    tripDetails.innerHTML = `
      <p>Trip ID: ${tripId}</p>
      <p>Route ID: ${routeId}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Pickup Location: ${pickup}</p>
      <p>Drop-off Location: ${dropoff}</p>
      <p>Available Seats: ${seats}</p>
      <p>Price: R${price}</p>
    `;
    tripDetailsModal.style.display = 'block';
    currentTripButton = btn;
  });
});

closeTripDetailsBtn.addEventListener('click', () => {
  tripDetailsModal.style.display = 'none';
});

quitTripDetailsBtn.addEventListener('click', () => {
  tripDetailsModal.style.display = 'none';
});

acceptTripBtn.addEventListener('click', () => {
  if (currentTripButton) {
    currentTripButton.textContent = 'Accepted';
    currentTripButton.disabled = true;
    tripDetailsModal.style.display = 'none';
  }
});

window.addEventListener('click', (event) => {
  if (event.target == tripDetailsModal) {
    tripDetailsModal.style.display = 'none';
  }
});

// Ride details modal functionality
const rideRows = document.querySelectorAll(".ride-row");
const rideDetailsModal = document.getElementById('rideDetailsModal');
const closeRideDetailsBtn = document.querySelector('.close-ride-details-btn');
const quitRideDetailsBtn = document.getElementById('quitRideDetailsBtn');
const rideDetails = document.getElementById('rideDetails');

rideRows.forEach(row => {
  row.addEventListener('click', () => {
    const passenger = row.getAttribute('data-passenger');
    const date = row.getAttribute('data-date');
    const status = row.getAttribute('data-status');
    const pickup = row.getAttribute('data-pickup');
    const dropoff = row.getAttribute('data-dropoff');
    const price = row.getAttribute('data-price');
    const bookingId = row.getAttribute('data-booking-id');
    
    rideDetails.innerHTML = `
      <p>Passenger Name: ${passenger}</p>
      <p>Date: ${date}</p>
      <p>Status: ${status}</p>
      <p>Pickup Location: ${pickup}</p>
      <p>Drop-off Location: ${dropoff}</p>
      <p>Price: R${price}</p>
      <p>Booking ID: ${bookingId}</p>
    `;
    rideDetailsModal.style.display = 'block';
  });
});

closeRideDetailsBtn.addEventListener('click', () => {
  rideDetailsModal.style.display = 'none';
});

quitRideDetailsBtn.addEventListener('click', () => {
  rideDetailsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == rideDetailsModal) {
    rideDetailsModal.style.display = 'none';
  }
});

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle('show');
    if (searchForm.classList.contains('show')) {
      searchButtonIcon.classList.replace('bx-search', 'bx-x');
    } else {
      searchButtonIcon.classList.replace('bx-x', 'bx-search');
    }
  }
})

if (window.innerWidth < 768) {
  sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
  }
})

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
})

// Modal for accepting drive and showing success message
document.addEventListener("DOMContentLoaded", function () {
  const acceptDriveButtons = document.querySelectorAll(".accept-drive-btn");
  const successModal = document.getElementById("successModal");
  const closeSuccessBtn = document.querySelector(".close-btn");

  if (acceptDriveButtons.length > 0) {
    acceptDriveButtons.forEach(button => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        const statusCell = row.querySelector(".status");

        if (statusCell) {
          statusCell.textContent = "Accepted";
          statusCell.className = "status accepted";
        }

        this.textContent = "Accepted";
        this.disabled = true;

        // Show the success modal
        if (successModal) {
          successModal.style.display = "block";
        }
      });
    });
  } else {
    console.error("No elements with class 'accept-drive-btn' found.");
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", function () {
      successModal.style.display = "none";
    });
  } else {
    console.error("Element with class 'close-btn' not found.");
  }

  window.addEventListener("click", function (event) {
    if (event.target == successModal) {
      successModal.style.display = "none";
    }
  });

  // For incident report submission, pop-up message and refreshing the page
  const incidentForm = document.getElementById("incidentForm");
  const reportSuccessModal = document.getElementById("reportSuccessModal");
  const closeReportBtn = document.querySelector(".close-report-btn");

  if (incidentForm) {
    incidentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Show the report success modal
      if (reportSuccessModal) {
        const routeId = document.getElementById("route-id").value;
        document.getElementById("reportSuccessMessage").textContent = `You have successfully reported the incident of route ID ${routeId}`;
        reportSuccessModal.style.display = "block";

        // Clear the input fields
        document.getElementById("route-id").value = '';
        document.getElementById("description").value = '';
      }
    });
  } else {
    console.error("Element with ID 'incidentForm' not found.");
  }

  if (closeReportBtn) {
    closeReportBtn.addEventListener("click", function () {
      if (reportSuccessModal) {
        reportSuccessModal.style.display = "none";
      }
    });
  } else {
    console.error("Element with class 'close-report-btn' not found.");
  }

  window.addEventListener("click", function (event) {
    if (event.target == reportSuccessModal) {
      reportSuccessModal.style.display = "none";
    }
  });

  // For refreshing the page and navigating to the home page (dashboard)
  const refreshButton = document.getElementById("refreshButton");
  if (refreshButton) {
    refreshButton.addEventListener("click", function () {
      // Navigate to the home page (dashboard)
      window.location.hash = '#dashboard';
      // Reload the page
      location.reload();
    });
  } else {
    console.error("Element with ID 'refreshButton' not found.");
  }
});

function filterMessages(senderType) {
  const adminMessagesSubMenu = document.getElementById('adminMessagesSubMenu');
  const passengerMessagesSubMenu = document.getElementById('passengerMessagesSubMenu');

  if (senderType === 'admin') {
    adminMessagesSubMenu.style.display = 'block';
    passengerMessagesSubMenu.style.display = 'none';
  } else if (senderType === 'passenger') {
    adminMessagesSubMenu.style.display = 'none';
    passengerMessagesSubMenu.style.display = 'block';
  }
}

// Initialize the page to show admin messages by default
filterMessages('admin');

document.addEventListener("DOMContentLoaded", function () {
  const userName = "Mphaga Jr. Philelo"; // Replace with the actual user name
  document.getElementById("accountName").textContent = userName;
  document.getElementById("welcomeName").textContent = userName;

  document.getElementById("profileImageInput").addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("profileImage").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("profileImage").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("profileImageInput").click();
  });

  document.getElementById("changeProfilePhoto").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("profileImageInput").click();
  });

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
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById('profileIcon').addEventListener('click', function() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('bookings').style.display = 'none';
  document.getElementById('reports').style.display = 'none';
  document.getElementById('messages').style.display = 'none';
  document.getElementById('myAccount').style.display = 'block';
});

document.querySelectorAll('.account-sidebar ul li a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.account-section').forEach(function(section) {
      section.style.display = 'none';
    });
    document.querySelectorAll('.account-sidebar ul li').forEach(function(li) {
      li.classList.remove('active');
    });
    const sectionId = link.getAttribute('data-section');
    document.getElementById(sectionId).style.display = 'block';
    link.parentElement.classList.add('active');
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
  allSideMenu.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', function () {
      allSideMenu.forEach(i => {
        i.parentElement.classList.remove('active');
      });
      li.classList.add('active');
      document.querySelectorAll('main').forEach(main => {
        main.style.display = 'none';
      });
      const id = li.getAttribute('data-section');
      document.getElementById(id).style.display = 'block';
      if (id === 'messages') {
        filterMessages('admin');
      }
    });
  });

  const profileIcon = document.getElementById('profileIcon');
  profileIcon.addEventListener('click', function() {
    document.querySelectorAll('main').forEach(main => {
      main.style.display = 'none';
    });
    document.getElementById('myAccount').style.display = 'block';
  });

  const setupPasskeysLink = document.getElementById('setupPasskeys');
  const setupPasskeyModal = document.getElementById('setupPasskeyModal');
  const closeSetupPasskeyBtn = document.querySelector('.close-setup-passkey-btn');
  const setupPasskeyForm = document.getElementById('setupPasskeyForm');

  setupPasskeysLink.addEventListener('click', function (e) {
    e.preventDefault();
    setupPasskeyModal.style.display = 'block';
  });

  closeSetupPasskeyBtn.addEventListener('click', function () {
    setupPasskeyModal.style.display = 'none';
  });

  setupPasskeyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newPasskey = document.getElementById('newPasskey').value;
    // Save the new passkey (implement the saving logic here)
    alert('Passkey set successfully!');
    setupPasskeyModal.style.display = 'none';
  });

  const socialLinks = document.querySelectorAll('.social-link');
  const linkSocialAccountModal = document.getElementById('linkSocialAccountModal');
  const closeLinkSocialAccountBtn = document.querySelector('.close-link-social-account-btn');
  const linkSocialAccountText = document.getElementById('linkSocialAccountText');
  const linkAccountBtn = document.getElementById('linkAccountBtn');

  socialLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const platform = link.getAttribute('data-platform');
      linkSocialAccountText.textContent = `Link your ${platform} account`;
      linkSocialAccountModal.style.display = 'block';
    });
  });

  closeLinkSocialAccountBtn.addEventListener('click', function () {
    linkSocialAccountModal.style.display = 'none';
  });

  linkAccountBtn.addEventListener('click', function () {
    // Implement the social account linking logic here
    alert('Social account linked successfully!');
    linkSocialAccountModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == setupPasskeyModal) {
      setupPasskeyModal.style.display = 'none';
    }
    if (event.target == linkSocialAccountModal) {
      linkSocialAccountModal.style.display = 'none';
    }
  });

  // Adding and editing home addresses
  const homeAddressInput = document.getElementById('homeAddressInput');
  const addHomeAddressBtn = document.getElementById('addHomeAddressBtn');
  const homeAddressList = document.getElementById('homeAddressList');

  addHomeAddressBtn.addEventListener('click', function () {
    const address = homeAddressInput.value.trim();
    if (address) {
      addAddressToList(address, 'home');
      homeAddressInput.value = '';
    } else {
      alert('Please enter an address.');
    }
  });

  function addAddressToList(address, type) {
    const li = document.createElement('li');
    li.innerHTML = `
      <i class="fas fa-clock"></i>
      <div>
        <span>${address}</span>
        <p>Auckland Park, Johannesburg</p>
      </div>
      <div>
        <span class="edit-btn" onclick="editAddress(this, '${type}')">Edit</span>
        <span class="delete-btn" onclick="deleteAddress(this, '${type}')">Delete</span>
      </div>
    `;
    homeAddressList.appendChild(li);
  }

  window.editAddress = function (element, type) {
    const addressElement = element.parentElement.previousElementSibling.querySelector('span');
    const newAddress = prompt('Edit Address:', addressElement.textContent);
    if (newAddress) {
      addressElement.textContent = newAddress;
    }
  };

  window.deleteAddress = function (element, type) {
    if (confirm('Are you sure you want to delete this address?')) {
      const li = element.closest('li');
      li.remove();
    }
  };

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
      if (main.textContent.toLowerCase().includes(query)) {
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
});

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
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

  function displayNotifications() {
    notificationList.innerHTML = '';
    notifications.forEach(notification => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${notification.sender}</strong>: ${notification.message} <span>${notification.timestamp}</span>`;
      notificationList.appendChild(li);
    });
  }

  notificationIcon.addEventListener('click', () => {
    notificationModal.style.display = 'block';
    displayNotifications();
  });

  closeNotificationBtn.addEventListener('click', () => {
    notificationModal.style.display = 'none';
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase();

    const elements = document.querySelectorAll('.ride-row, .todo-list li, .Booking-table tr, .Inbox-table tr');
    let found = false;

    elements.forEach(element => {
      if (element.innerText.toLowerCase().includes(query)) {
        element.style.display = '';
        found = true;
      } else {
        element.style.display = 'none';
      }
    });

    if (!found) {
      alert('Results not available. Try again.');
    }
  });
});


const acceptDriveBtn = document.getElementById('acceptDriveBtn');
  
acceptDriveBtn.addEventListener('click', () => {
  alert('Drive Accepted!');
});