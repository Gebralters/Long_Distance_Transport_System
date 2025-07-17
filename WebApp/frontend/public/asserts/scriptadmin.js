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



const inboxBtns = document.querySelectorAll('.inboxBtn');
const overlay = document.getElementById('overlay');
const overlay2 = document.getElementById('overlay');
const quitBtns = document.querySelectorAll('#quitBtn, #quitBtnFooter');
const sendBtn = document.getElementById('sendBtn');
const messageTextarea = document.getElementById('message');

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

sendBtn.addEventListener('click', () => {
	const message = messageTextarea.value.trim();
	if (message) {
		alert('Message sent: ' + message);
		messageTextarea.value = '';
		overlay.style.display = 'none';
	} else {
		alert('Please type a message before sending.');
	}
});






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


document.addEventListener('DOMContentLoaded', function() {
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const editRouteButtons = document.querySelectorAll('.edit-route');
	
    const detailsButtons = document.querySelectorAll('.book-details');
    const editButtons = document.querySelectorAll('.book-edit');
    const removeButtons = document.querySelectorAll('.book-remove');

    const detailsVButtons = document.querySelectorAll('.book-V-details');
    const editVButtons = document.querySelectorAll('.book-V-edit');
    const addVButtons = document.querySelectorAll('.add-v-btn');
    const removeVButtons = document.querySelectorAll('.book-V-remove');

    const detailsPopup = document.getElementById('details-booking-Popup');
    const editPopup = document.getElementById('edit-booking-Popup');
    const removePopup = document.getElementById('remove-booking-Popup');

    const acceptPopup = document.getElementById('accept-P-Popup');
    const rejectPopup = document.getElementById('remove-P-Popup');
    const acceptButton = document.querySelectorAll('.accept-btn');
    const rejectButton = document.querySelectorAll('.reject-btn');

    const pimgPopup = document.getElementById('view-P-Popup');
    const pButton = document.querySelectorAll('.pimg-btn');
    

    const assignPopup = document.getElementById('assignPopup');
    const assignButton = document.querySelectorAll('.assign-btn');

    const notPopup = document.getElementById('notPopup');
    const notButton = document.querySelectorAll('.num');

    const detailsVPopup = document.getElementById('details-vehicle-Popup');
    const editVPopup = document.getElementById('edit-vehicle-Popup');
    const addVPopup = document.getElementById('add-vehicle-Popup');
    const removeVPopup = document.getElementById('remove-vehicle-Popup');

    const detailUMPopup = document.getElementById('details-UM-Popup');
    const editUMPopup = document.getElementById('edit-UM-Popup');
    const removeUMPopup = document.getElementById('remove-UM-Popup');

    const detailsUMButtons = document.querySelectorAll('.book-UM-details');
    const editUMButtons = document.querySelectorAll('.book-UM-edit');
    const removeUMButtons = document.querySelectorAll('.book-UM-remove');

    const newslotPopup = document.getElementById('new-booking-Popup');
    const newslotButtons = document.querySelectorAll('.slot-new');

	const addRouteButtons = document.querySelectorAll('.addroute-btn');
    const viewDetailsPopup = document.getElementById('viewDetailsPopup');
    const removeroutePopup = document.getElementById('remove-route-Popup');
    const removeRouteButtons = document.querySelectorAll('.remroute-btn');
    const editRoutePopup = document.getElementById('editRoutePopup');
	const addRoutePopup = document.getElementById('addRoutePopup');
    const closeButtons = document.querySelectorAll('.close');

    // Function to fetch route details (mock function)
    function fetchRouteDetails(route) {
        // Replace with actual data fetching logic
        return {
            name: route,
            distance: '10km',
            numStops: 5,
            startLoc: 'Location A',
            endLoc: 'Location B',
            additionalInfo: 'No additional info',
            checkpoints: ['Checkpoint 1', 'Checkpoint 2']
        };
    }

    // Function to show the view details popup
    function showViewDetails(route) {
        const details = fetchRouteDetails(route);
        document.getElementById('routeDetails').innerText = `
            Name: ${details.name}
            Distance: ${details.distance}
            Number of Stops: ${details.numStops}
            Start Location: ${details.startLoc}
            End Location: ${details.endLoc}
            Additional Info: ${details.additionalInfo}
        `;
        const checkpointList = document.getElementById('checkpointList');
        checkpointList.innerHTML = '';
        details.checkpoints.forEach(checkpoint => {
            const li = document.createElement('li');
            li.innerText = checkpoint;
            checkpointList.appendChild(li);
        });
        viewDetailsPopup.style.display = 'flex';
    }
    newslotButtons.forEach(button => {
        button.addEventListener('click', function() {
            newslotPopup.style.display = 'flex';
        });
    });
    // Function to show the edit route popup
    function showEditRoute(route) {
        // Set up form with route details (mock setup)
        editRoutePopup.style.display = 'flex';
    }
	function showaddRoute(route) {
        // Set up form with route details (mock setup)
        addRoutePopup.style.display = 'flex';
    }
    removeRouteButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeroutePopup.style.display = 'flex';
        });
    });
    detailsUMButtons.forEach(button => {
        button.addEventListener('click', function() {
            detailUMPopup.style.display = 'flex';
        });
    });
    editUMButtons.forEach(button => {
        button.addEventListener('click', function() {
            editUMPopup.style.display = 'flex';
        });
    });
    removeUMButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeUMPopup.style.display = 'flex';
        });
    });

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const route = this.getAttribute('data-route');
            showViewDetails(route);
        });
    });

    editRouteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const route = this.getAttribute('data-route');
            showEditRoute(route);
        });
    });
    assignButton.forEach(button => {
        button.addEventListener('click', function() {
            assignPopup.style.display = 'flex';
        });
    });
	addRouteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const route = this.getAttribute('data-route');
            showaddRoute(route);
        });
    });
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            detailsPopup.style.display = 'flex';
        });
    });
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            editPopup.style.display = 'flex';
        });
    });
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            removePopup.style.display = 'flex';
        });
    });
    detailsVButtons.forEach(button => {
        button.addEventListener('click', function() {
            detailsVPopup.style.display = 'flex';
        });
    });
    editVButtons.forEach(button => {
        button.addEventListener('click', function() {
            editVPopup.style.display = 'flex';
        });
    });
    addVButtons.forEach(button => {
      button.addEventListener('click', function() {
          addVPopup.style.display = 'flex';
      });
  });
    removeVButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeVPopup.style.display = 'flex';
        });
    });
    notButton.forEach(button => {
        button.addEventListener('click', function() {
            notPopup.style.display = 'flex';
        });
    });
    rejectButton.forEach(button => {
        button.addEventListener('click', function() {
            rejectPopup.style.display = 'flex';
        });
    });
    acceptButton.forEach(button => {
        button.addEventListener('click', function() {
            acceptPopup.style.display = 'flex';
        });
    });
    pButton.forEach(button => {
        button.addEventListener('click', function() {
            pimgPopup.style.display = 'flex';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewDetailsPopup.style.display = 'none';
            editRoutePopup.style.display = 'none';
			addRoutePopup.style.display = 'none';
            detailsPopup.style.display = 'none';
            removePopup.style.display = 'none';
            editPopup.style.display = 'none';
            removeVPopup.style.display = 'none';
            editVPopup.style.display = 'none';
            detailsVPopup.style.display = 'none';
            assignPopup.style.display = 'none';
            notPopup.style.display = 'none';
            acceptPopup.style.display = 'none';
            rejectPopup.style.display = 'none';
            pimgPopup.style.display = 'none';
            removeUMPopup.style.display = 'none';
            editUMPopup.style.display = 'none';
            detailUMPopup.style.display = 'none';
            removeroutePopup.style.display = 'none';
            newslotPopup.style.display = 'none';
            addVPopup.style.display = 'none';
        });
    });

    // Close the popup if the user clicks outside of the content
    window.addEventListener('click', function(event) {
        if (event.target === viewDetailsPopup) {
            viewDetailsPopup.style.display = 'none';
        }
        if (event.target === editRoutePopup) {
            editRoutePopup.style.display = 'none';
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
        if (event.target === removeVPopup) {
            removeVPopup.style.display = 'none';
        }
        if (event.target === editVPopup) {
            editVPopup.style.display = 'none';
        }
        if (event.target === detailsVPopup) {
            detailsVPopup.style.display = 'none';
        }
        if (event.target === assignPopup) {
            assignPopup.style.display = 'none';
        }
        if (event.target === notPopup) {
            notPopup.style.display = 'none';
        }
        if (event.target === acceptPopup) {
            acceptPopup.style.display = 'none';
        }
        if (event.target === rejectPopup) {
            rejectPopup.style.display = 'none';
        }
        if (event.target === pimgPopup) {
            pimgPopup.style.display = 'none';
        }
        if (event.target === detailUMPopup) {
            detailUMPopup.style.display = 'none';
        }
        if (event.target === editUMPopup) {
            editUMPopup.style.display = 'none';
        }
        if (event.target === removeUMPopup) {
            removeUMPopup.style.display = 'none';
        }
        if (event.target === removeroutePopup) {
            removeroutePopup.style.display = 'none';
        }
        if (event.target === newslotPopup) {
            newslotPopup.style.display = 'none';
        }
        if (event.target === addVPopup) {
          addVPopup.style.display = 'none';
      }
        
    });
});



document.addEventListener('DOMContentLoaded', () => {
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

    const metricsData = {
        deliveryTimeAccuracy: [
            { estimated: '2:00 PM', actual: '2:05 PM', accuracy: '98%' },
            { estimated: '3:00 PM', actual: '3:10 PM', accuracy: '96%' }
        ],
        customerFeedback: [
            { customer: 'John Doe', rating: 5, comments: 'Excellent service!' },
            { customer: 'Jane Smith', rating: 4, comments: 'Very good, but a bit late.' }
        ],
        complaintResolution: [
            { id: 1, status: 'Resolved', resolutionTime: '2 hours' },
            { id: 2, status: 'Pending', resolutionTime: 'N/A' }
        ],
        revenuePerTrip: [
            { tripId: 101, revenue: 'R2500' },
            { tripId: 102, revenue: 'R4000' }
        ],
        costPerMile: [
            { miles: 300, cost: 'R500' },
            { miles: 400, cost: 'R650' }
        ],
        profitMargins: [
            { revenue: 'R5000', cost: 'R3000', profitMargin: '40%' }
        ],
        accidentReports: [
            { id: 1, date: '2024-05-10', description: 'Minor accident, no injuries.' },
            { id: 2, date: '2024-05-12', description: 'Major accident, injuries reported.' }
        ],
        regulatoryCompliance: [
            { area: 'Vehicle Inspection', status: 'Compliant' },
            { area: 'Driver Training', status: 'Non-Compliant' }
        ]
    };

    for (const [metric, data] of Object.entries(metricsData)) {
        const tbody = document.querySelector(`.analytics-dashboard #${metric} tbody`);
        data.forEach(item => {
            const row = document.createElement('tr');
            for (const value of Object.values(item)) {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.manageusers-container');

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.height > 900) {
                container.style.height = 'auto';
                container.style.overflowY = 'scroll';
            } else {
                container.style.height = '900px';
                container.style.overflowY = 'auto';
            }
        }
    });

    resizeObserver.observe(container);
});

/* booking popups*/
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


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById('profileIcon').addEventListener('click', function() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('bookingslot').style.display = 'none';
  document.getElementById('courier').style.display = 'none';
  document.getElementById('analytics').style.display = 'none';
  document.getElementById('inbox').style.display = 'block';
  document.getElementById('drivers').style.display = 'block';
  document.getElementById('routes').style.display = 'block';
  document.getElementById('manageusers').style.display = 'block';
  document.getElementById('managevehicles').style.display = 'block';
  document.getElementById('manageFAQ').style.display = 'block';
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


