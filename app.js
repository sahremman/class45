// Add this function at the very end of your app.js file, after the DOMContentLoaded event

// Handle all modal buttons
function setupModalButtons() {
    // Add Student Modal Buttons
    const addStudentButtons = document.querySelectorAll('button[onclick="showAddStudentModal()"], button[onclick^="showAddStudentModal("]');
    addStudentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classType = this.getAttribute('onclick').includes('(') ? 
                this.getAttribute('onclick').replace('showAddStudentModal(\'', '').replace('\')', '') : null;
            showAddStudentModal(classType);
        });
    });

    // Add Assignment Modal Buttons
    const addAssignmentButtons = document.querySelectorAll('button[onclick^="showAddAssignmentModal"]');
    addAssignmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classType = this.getAttribute('onclick').replace('showAddAssignmentModal(\'', '').replace('\')', '');
            showAddAssignmentModal(classType);
        });
    });

    // Create Group Modal Button
    const createGroupButton = document.querySelector('button[onclick="showCreateGroupModal()"]');
    if (createGroupButton) {
        createGroupButton.addEventListener('click', showCreateGroupModal);
    }

    // Add Resource Modal Button
    const addResourceButton = document.querySelector('button[onclick="showAddResourceModal()"]');
    if (addResourceButton) {
        addResourceButton.addEventListener('click', showAddResourceModal);
    }

    // Add Event Modal Button
    const addEventButton = document.querySelector('button[onclick="showAddEventModal()"]');
    if (addEventButton) {
        addEventButton.addEventListener('click', showAddEventModal);
    }

    // Import Students Button
    const importStudentsButton = document.querySelector('button[onclick="importStudents()"]');
    if (importStudentsButton) {
        importStudentsButton.addEventListener('click', importStudents);
    }

    // Export Data Buttons
    const exportDataButtons = document.querySelectorAll('button[onclick="exportStudentData()"]');
    exportDataButtons.forEach(button => {
        button.addEventListener('click', exportStudentData);
    });

    // Announcement Buttons
    const announcementButtons = document.querySelectorAll('button[onclick^="addAnnouncement"]');
    announcementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classType = this.getAttribute('onclick').replace('addAnnouncement(\'', '').replace('\')', '');
            const textareaId = `${classType}-announcement-text`;
            const text = document.getElementById(textareaId).value;
            if (text.trim()) {
                addAnnouncement(classType, text);
                document.getElementById(textareaId).value = '';
            }
        });
    });

    // Close Modal Buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
}

// Call this in your DOMContentLoaded event handler
// Add this line to the end of your existing DOMContentLoaded function
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Setup modal buttons
    setupModalButtons();
    
    // Handle modal closing when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
});
