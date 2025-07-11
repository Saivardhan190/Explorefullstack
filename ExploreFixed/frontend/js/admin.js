// Admin panel JavaScript logic

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin panel JS loaded.");

  // --- Authentication --- 
  // Placeholder: In a real app, get this after admin login
  const adminToken = localStorage.getItem("adminToken") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ5MDE0MTMxLCJleHAiOjE3NTE2MDYxMzF9.qci6UuPn6L_mPcOWSD4PfzceIfDPaB6bNFDz1nU_s3k"; 
  // TODO: Implement proper admin login and token handling
  if (!adminToken || adminToken === "DUMMY_ADMIN_TOKEN_REPLACE_ME") {
      console.warn("Admin token not found or is a placeholder. API calls might fail.");
      // Optionally redirect to login or show a message
      // For testing, we might allow proceeding but expect 401/403 errors
  }

  const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}`
  };

  // --- Tab Switching Logic --- 
  const menuItems = document.querySelectorAll(".admin-menu-item");
  const tabs = document.querySelectorAll(".admin-tab");

  menuItems.forEach(item => {
    const tabId = item.getAttribute("data-tab");
    if (!tabId) return; // Skip items without data-tab (like logout)

    item.addEventListener("click", function () {
      menuItems.forEach(menuItem => menuItem.classList.remove("active"));
      tabs.forEach(tab => tab.classList.remove("active"));

      this.classList.add("active");
      const targetTab = document.getElementById(`${tabId}-tab`);
      if (targetTab) {
        targetTab.classList.add("active");
        loadTabData(tabId);
      } else {
        console.error(`Tab with ID ${tabId}-tab not found.`);
      }
    });
  });

  // --- Data Loading Function --- 
  async function loadTabData(tabId) {
    console.log(`Loading data for tab: ${tabId}`);
    switch (tabId) {
      case "dashboard":
        // TODO: Load dashboard stats dynamically
        break;
      case "packages":
        await loadPackages();
        break;
      case "bookings":
        await loadBookings();
        break;
      case "users":
        await loadUsers();
        break;
      // Add cases for other tabs like reviews, payments, settings if needed
      default:
        console.log(`No data loading logic for tab: ${tabId}`);
    }
  }

  // --- Package Management --- 
  const packagesTableBody = document.querySelector("#packages-tab table tbody");
  const addPackageButton = document.querySelector("#packages-tab .btn-primary"); // Add Package button

  async function loadPackages() {
    if (!packagesTableBody) {
      console.error("Packages table body not found.");
      return;
    }
    packagesTableBody.innerHTML = '<tr><td colspan="7">Loading packages...</td></tr>';
    try {
      const response = await fetch("/api/v1/packages", { headers }); // Use admin token
      const data = await response.json();

      if (data.success) {
        packagesTableBody.innerHTML = ""; // Clear loading/existing rows
        if (data.data.length === 0) {
             packagesTableBody.innerHTML = '<tr><td colspan="7">No packages found.</td></tr>';
             return;
        }
        data.data.forEach(pkg => {
          const row = document.createElement("tr");
          // Use placeholder image if none provided
          const imageUrl = pkg.image && pkg.image.startsWith("http") ? pkg.image : `../images/destinations/${pkg.image || 'placeholder.jpg'}`;
          row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>
              <div class="package-info">
                <img src="${imageUrl}" alt="${pkg.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div>
                  <h4>${pkg.name}</h4>
                  <p>ID: ${pkg._id}</p>
                </div>
              </div>
            </td>
            <td>${pkg.location || 'N/A'}</td>
            <td>${pkg.duration || 'N/A'}</td>
            <td>$${pkg.price ? pkg.price.toFixed(2) : 'N/A'}</td>
            <td><span class="status-badge ${pkg.status ? pkg.status.toLowerCase() : 'inactive'}">${pkg.status || 'Inactive'}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon edit" data-id="${pkg._id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete" data-id="${pkg._id}" title="Delete"><i class="fas fa-trash"></i></button>
                <button class="btn-icon view" data-id="${pkg._id}" title="View"><i class="fas fa-eye"></i></button>
              </div>
            </td>
          `;
          packagesTableBody.appendChild(row);
        });
        addPackageActionListeners();
      } else {
        packagesTableBody.innerHTML = `<tr><td colspan="7">Error loading packages: ${data.error || 'Unknown error'}</td></tr>`;
        console.error("Failed to load packages:", data.error);
      }
    } catch (error) {
      packagesTableBody.innerHTML = '<tr><td colspan="7">Error loading packages. Check network or server status.</td></tr>';
      console.error("Error fetching packages:", error);
    }
  }

  function addPackageActionListeners() {
    document.querySelectorAll("#packages-tab .edit").forEach(button => {
      button.addEventListener("click", (e) => handleEditPackage(e.currentTarget.dataset.id));
    });
    document.querySelectorAll("#packages-tab .delete").forEach(button => {
      button.addEventListener("click", (e) => handleDeletePackage(e.currentTarget.dataset.id));
    });
    document.querySelectorAll("#packages-tab .view").forEach(button => {
      button.addEventListener("click", (e) => handleViewPackage(e.currentTarget.dataset.id));
    });
  }

  function handleAddPackage() {
    console.log("Add package clicked");
    // TODO: Implement modal/form for adding a new package
    alert("Add package functionality not yet implemented.");
  }

  function handleEditPackage(packageId) {
    console.log(`Edit package clicked: ${packageId}`);
    // TODO: Implement modal/form for editing the package
    alert(`Edit package ${packageId} functionality not yet implemented.`);
  }

  async function handleDeletePackage(packageId) {
    console.log(`Delete package clicked: ${packageId}`);
    if (confirm(`Are you sure you want to delete package ${packageId}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/v1/packages/${packageId}`, { 
          method: 'DELETE', 
          headers: headers // Use admin token
        });
        const result = await response.json();
        
        if (result.success) {
          alert(`Package ${packageId} deleted successfully.`);
          loadPackages(); // Reload the package list
        } else {
          alert(`Failed to delete package ${packageId}: ${result.error || 'Unknown error'}`);
          console.error("Delete failed:", result.error);
        }
      } catch (error) {
        alert(`Error deleting package ${packageId}. Check network or server status.`);
        console.error("Error deleting package:", error);
      }
    }
  }

  function handleViewPackage(packageId) {
    console.log(`View package clicked: ${packageId}`);
    // TODO: Implement modal/view for package details
    alert(`View package ${packageId} functionality not yet implemented.`);
  }

  if (addPackageButton) {
      addPackageButton.addEventListener("click", handleAddPackage);
  }

  // --- User Management --- 
  const usersTableBody = document.querySelector("#users-tab table tbody"); 
  const addUserButton = document.querySelector("#users-tab .btn-primary"); // Add User button

  async function loadUsers() {
     if (!usersTableBody) {
       console.error("Users table body not found. Ensure the Users tab HTML exists and has the correct ID.");
       return;
     }
     usersTableBody.innerHTML = '<tr><td colspan="6">Loading users...</td></tr>'; // Added colspan="6"
     try {
       const response = await fetch("/api/v1/users", { headers }); // Use admin token
       const data = await response.json();

       if (data.success) {
         usersTableBody.innerHTML = ""; // Clear loading/existing rows
         if (data.data.length === 0) {
             usersTableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>'; // Added colspan="6"
             return;
         }
         data.data.forEach(user => {
           const row = document.createElement("tr");
           const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
           row.innerHTML = `
             <td><input type="checkbox"></td>
             <td>
               <div class="user-info">
                 <!-- Placeholder avatar -->
                 <img src="https://via.placeholder.com/30" alt="${user.name}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                 <span>${user.name}</span>
               </div>
             </td>
             <td>${user.email}</td>
             <td>${user.role}</td>
             <td>${joinedDate}</td>
             <td>
               <div class="action-buttons">
                 <button class="btn-icon edit" data-id="${user._id}" title="Edit"><i class="fas fa-edit"></i></button>
                 <button class="btn-icon delete" data-id="${user._id}" title="Delete"><i class="fas fa-trash"></i></button>
                 <button class="btn-icon view" data-id="${user._id}" title="View"><i class="fas fa-eye"></i></button>
               </div>
             </td>
           `;
           usersTableBody.appendChild(row);
         });
         addUserActionListeners();
       } else {
         usersTableBody.innerHTML = `<tr><td colspan="6">Error loading users: ${data.error || 'Unknown error'}</td></tr>`; // Added colspan="6"
         console.error("Failed to load users:", data.error);
       }
     } catch (error) {
       usersTableBody.innerHTML = '<tr><td colspan="6">Error loading users. Check network or server status.</td></tr>'; // Added colspan="6"
       console.error("Error fetching users:", error);
     }
  }

  function addUserActionListeners() {
    document.querySelectorAll("#users-tab .edit").forEach(button => {
      button.addEventListener("click", (e) => handleEditUser(e.currentTarget.dataset.id));
    });
    document.querySelectorAll("#users-tab .delete").forEach(button => {
      button.addEventListener("click", (e) => handleDeleteUser(e.currentTarget.dataset.id));
    });
    document.querySelectorAll("#users-tab .view").forEach(button => {
      button.addEventListener("click", (e) => handleViewUser(e.currentTarget.dataset.id));
    });
  }

  function handleAddUser() {
    console.log("Add user clicked");
    // TODO: Implement modal/form for adding a new user
    alert("Add user functionality not yet implemented.");
  }

  function handleEditUser(userId) {
    console.log(`Edit user clicked: ${userId}`);
    // TODO: Implement modal/form for editing the user
    alert(`Edit user ${userId} functionality not yet implemented.`);
  }

  async function handleDeleteUser(userId) {
    console.log(`Delete user clicked: ${userId}`);
    // TODO: Add check to prevent deleting the current admin user?
    if (confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/v1/users/${userId}`, { 
          method: 'DELETE', 
          headers: headers // Use admin token
        });
        const result = await response.json();
        
        if (result.success) {
          alert(`User ${userId} deleted successfully.`);
          loadUsers(); // Reload the user list
        } else {
          alert(`Failed to delete user ${userId}: ${result.error || 'Unknown error'}`);
          console.error("Delete failed:", result.error);
        }
      } catch (error) {
        alert(`Error deleting user ${userId}. Check network or server status.`);
        console.error("Error deleting user:", error);
      }
    }
  }

  function handleViewUser(userId) {
    console.log(`View user clicked: ${userId}`);
    // TODO: Implement modal/view for user details
    alert(`View user ${userId} functionality not yet implemented.`);
  }

  if (addUserButton) {
      addUserButton.addEventListener("click", handleAddUser);
  }

  // --- Booking Management --- 
  const bookingsTableBody = document.querySelector("#bookings-tab table tbody"); 

  async function loadBookings() {
    if (!bookingsTableBody) {
      console.error("Bookings table body not found. Ensure the Bookings tab HTML exists.");
      return;
    }
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>'; // Assuming 7 columns
    try {
      const response = await fetch("/api/v1/bookings", { headers }); // Use admin token
      const data = await response.json();

      if (data.success) {
        bookingsTableBody.innerHTML = ""; // Clear loading/existing rows
        if (data.data.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }
        // Need user and package details populated for a good display
        // Assuming backend populates user.name and package.name
        data.data.forEach(booking => {
          const row = document.createElement("tr");
          const bookingDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A';
          const status = booking.status || 'Pending'; // Default status
          const userName = booking.user ? (booking.user.name || booking.user) : 'N/A'; // Handle populated vs ID
          const packageName = booking.package ? (booking.package.name || booking.package) : 'N/A'; // Handle populated vs ID
          
          row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${booking._id}</td>
            <td>${userName}</td> 
            <td>${packageName}</td>
            <td>${bookingDate}</td>
            <td>$${booking.totalCost ? booking.totalCost.toFixed(2) : 'N/A'}</td>
            <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon edit" data-id="${booking._id}" title="Update Status"><i class="fas fa-pencil-alt"></i></button> 
                <button class="btn-icon delete" data-id="${booking._id}" title="Delete"><i class="fas fa-trash"></i></button>
                <button class="btn-icon view" data-id="${booking._id}" title="View"><i class="fas fa-eye"></i></button>
              </div>
            </td>
          `;
          bookingsTableBody.appendChild(row);
        });
        addBookingActionListeners();
      } else {
        bookingsTableBody.innerHTML = `<tr><td colspan="7">Error loading bookings: ${data.error || 'Unknown error'}</td></tr>`;
        console.error("Failed to load bookings:", data.error);
      }
    } catch (error) {
      bookingsTableBody.innerHTML = '<tr><td colspan="7">Error loading bookings. Check network or server status.</td></tr>';
      console.error("Error fetching bookings:", error);
    }
  }

  function addBookingActionListeners() {
    document.querySelectorAll("#bookings-tab .edit").forEach(button => {
      button.addEventListener("click", (e) => handleEditBookingStatus(e.currentTarget.dataset.id));
    });
    document.querySelectorAll("#bookings-tab .delete").forEach(button => {
      button.addEventListener("click", (e) => handleDeleteBooking(e.currentTarget.dataset.id));
    });
    document.querySelectorAll("#bookings-tab .view").forEach(button => {
      button.addEventListener("click", (e) => handleViewBooking(e.currentTarget.dataset.id));
    });
  }

  async function handleEditBookingStatus(bookingId) {
    console.log(`Edit booking status clicked: ${bookingId}`);
    const newStatus = prompt(`Enter new status for booking ${bookingId} (e.g., Confirmed, Cancelled, Pending):`);
    if (newStatus && ['Confirmed', 'Cancelled', 'Pending'].includes(newStatus)) { // Basic validation
         try {
            const response = await fetch(`/api/v1/bookings/${bookingId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();
            if (result.success) {
                alert(`Booking ${bookingId} status updated to ${newStatus}.`);
                loadBookings(); // Reload bookings
            } else {
                alert(`Failed to update booking status: ${result.error || 'Unknown error'}`);
                console.error("Update failed:", result.error);
            }
        } catch (error) {
            alert(`Error updating booking status ${bookingId}. Check network or server status.`);
            console.error("Error updating booking status:", error);
        }
    } else if (newStatus !== null) { // User entered something invalid
        alert("Invalid status. Please enter 'Confirmed', 'Cancelled', or 'Pending'.");
    }
  }

  async function handleDeleteBooking(bookingId) {
    console.log(`Delete booking clicked: ${bookingId}`);
    if (confirm(`Are you sure you want to delete booking ${bookingId}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/v1/bookings/${bookingId}`, { 
          method: 'DELETE', 
          headers: headers // Use admin token
        });
        const result = await response.json();
        
        if (result.success) {
          alert(`Booking ${bookingId} deleted successfully.`);
          loadBookings(); // Reload the booking list
        } else {
          alert(`Failed to delete booking ${bookingId}: ${result.error || 'Unknown error'}`);
          console.error("Delete failed:", result.error);
        }
      } catch (error) {
        alert(`Error deleting booking ${bookingId}. Check network or server status.`);
        console.error("Error deleting booking:", error);
      }
    }
  }

  function handleViewBooking(bookingId) {
    console.log(`View booking clicked: ${bookingId}`);
    // TODO: Implement modal/view for booking details
    alert(`View booking ${bookingId} functionality not yet implemented.`);
  }

  // --- Initial Load --- 
  const activeMenuItem = document.querySelector(".admin-menu-item.active");
  if (activeMenuItem) {
    const initialTabId = activeMenuItem.getAttribute("data-tab");
    if (initialTabId) {
      loadTabData(initialTabId);
    }
  } else {
      // If no tab is active by default, maybe load dashboard or packages
      console.log("No active tab found on load, loading dashboard.");
      loadTabData("dashboard"); 
      // Activate dashboard menu item visually
      const dashboardItem = document.querySelector('.admin-menu-item[data-tab="dashboard"]');
      if(dashboardItem) dashboardItem.classList.add('active');
  }

});

