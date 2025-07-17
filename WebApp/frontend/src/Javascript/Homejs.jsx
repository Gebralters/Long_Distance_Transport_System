import { useEffect } from 'react';

const Homejs = () => {
    useEffect(() => {
       
        
        
        
     
        
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
               /* filterMessages('admin');*/
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
    
        
      }, []);
}

export default Homejs;