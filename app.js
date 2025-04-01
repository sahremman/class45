// Data storage using localStorage
const STORAGE_KEYS = {
    STUDENTS: 'class_manager_students',
    ASSIGNMENTS: 'class_manager_assignments',
    ANNOUNCEMENTS: 'class_manager_announcements',
    RESOURCES: 'class_manager_resources',
    GROUPS: 'class_manager_groups',
    EVENTS: 'class_manager_events'
}

function showAddAssignmentModal(classType) {
    const modal = document.getElementById('add-assignment-modal');
    modal.style.display = 'block';
    
    // Set class type
    document.getElementById('assignment-class').value = classType;
    
    // Set up form submission
    const form = document.getElementById('add-assignment-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const title = document.getElementById('assignment-title').value;
        const dueDate = document.getElementById('assignment-due-date').value;
        const description = document.getElementById('assignment-description').value;
        const classType = document.getElementById('assignment-class').value;
        
        addAssignment(title, dueDate, description, classType);
        
        // Update UI
        renderAssignmentsList(classType);
        
        closeModal();
        form.reset();
    };
}

function showCreateGroupModal() {
    const modal = document.getElementById('create-group-modal');
    modal.style.display = 'block';
    
    // Populate students from sustainable development class
    const students = getData(STORAGE_KEYS.STUDENTS)
        .filter(student => student.classes.includes('sustainable-dev'));
    
    const selectionContainer = document.getElementById('group-members-selection');
    selectionContainer.innerHTML = '';
    
    students.forEach(student => {
        const checkbox = document.createElement('div');
        checkbox.className = 'checkbox-group';
        checkbox.innerHTML = `
            <input type="checkbox" id="student-${student.id}" value="${student.id}">
            <label for="student-${student.id}">${student.name}</label>
        `;
        selectionContainer.appendChild(checkbox);
    });
    
    // Set up form submission
    const form = document.getElementById('create-group-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const name = document.getElementById('group-name').value;
        const topic = document.getElementById('group-topic').value;
        const members = [];
        
        students.forEach(student => {
            const checkbox = document.getElementById(`student-${student.id}`);
            if (checkbox && checkbox.checked) {
                members.push(student.id);
            }
        });
        
        addGroup(name, topic, members);
        
        // Update UI
        renderProjectGroups();
        
        closeModal();
        form.reset();
    };
}

function showAddResourceModal() {
    const modal = document.getElementById('add-resource-modal');
    modal.style.display = 'block';
    
    // Set up form submission
    const form = document.getElementById('add-resource-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const title = document.getElementById('resource-title').value;
        const type = document.getElementById('resource-type').value;
        const link = document.getElementById('resource-link').value;
        const description = document.getElementById('resource-description').value;
        const classType = document.getElementById('resource-class').value;
        
        addResource(title, type, link, description, classType);
        
        // Update UI
        filterResources();
        
        closeModal();
        form.reset();
    };
}

function showAddEventModal() {
    const modal = document.getElementById('add-event-modal');
    modal.style.display = 'block';
    
    // Set up form submission
    const form = document.getElementById('add-event-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value;
        const classType = document.getElementById('event-class').value;
        
        addEvent(title, date, time, description, classType);
        
        // Update UI
        renderCalendar();
        
        closeModal();
        form.reset();
    };
}

function showEditStudentModal(studentId) {
    const students = getData(STORAGE_KEYS.STUDENTS);
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    const modal = document.getElementById('edit-student-modal');
    modal.style.display = 'block';
    
    // Populate form with student data
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = student.name;
    document.getElementById('edit-student-email').value = student.email;
    document.getElementById('edit-soil-class').checked = student.classes.includes('soil-chemistry');
    document.getElementById('edit-sust-class').checked = student.classes.includes('sustainable-dev');
    
    // Set up form submission
    const form = document.getElementById('edit-student-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('edit-student-id').value;
        const name = document.getElementById('edit-student-name').value;
        const email = document.getElementById('edit-student-email').value;
        const classes = [];
        
        if (document.getElementById('edit-soil-class').checked) {
            classes.push('soil-chemistry');
        }
        if (document.getElementById('edit-sust-class').checked) {
            classes.push('sustainable-dev');
        }
        
        // Update student
        const students = getData(STORAGE_KEYS.STUDENTS);
        const index = students.findIndex(s => s.id === studentId);
        
        if (index !== -1) {
            students[index].name = name;
            students[index].email = email;
            students[index].classes = classes;
            saveData(STORAGE_KEYS.STUDENTS, students);
            updateRecentActivity(`Student ${name} information updated.`);
        }
        
        // Update UI
        updateStudentCounts();
        
        if (document.getElementById('soil-students-list')) {
            filterStudents('soil-chemistry');
        }
        if (document.getElementById('sust-students-list')) {
            filterStudents('sustainable-dev');
        }
        if (document.getElementById('all-students-list')) {
            filterAllStudents();
        }
        if (document.getElementById('student-details')) {
            showStudentDetails(studentId);
        }
        
        closeModal();
    };
}

function closeModal() {
    // Close all open modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Reset forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.reset();
    });
}

// Mark student attendance
function markAttendance(studentId, classType) {
    const students = getData(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === studentId);
    
    if (index === -1) return;
    
    const status = document.querySelector(`.attendance-select[data-student="${studentId}"][data-class="${classType}"]`).value;
    
    // Add attendance record
    const attendanceRecord = {
        date: new Date().toISOString(),
        status: status
    };
    
    if (!students[index].attendance[classType]) {
        students[index].attendance[classType] = [];
    }
    
    students[index].attendance[classType].push(attendanceRecord);
    saveData(STORAGE_KEYS.STUDENTS, students);
    
    updateRecentActivity(`Attendance marked for ${students[index].name}: ${status}`);
    
    // Update UI if needed
    if (document.getElementById('all-students-list')) {
        filterAllStudents();
    }
    if (document.getElementById('student-details') && document.getElementById('student-details').innerHTML.includes(students[index].name)) {
        showStudentDetails(studentId);
    }
}

// Remove student from class
function removeStudentFromClass(studentId, classType) {
    const students = getData(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === studentId);
    
    if (index === -1) return;
    
    // Remove class from student's classes
    const classIndex = students[index].classes.indexOf(classType);
    if (classIndex !== -1) {
        students[index].classes.splice(classIndex, 1);
        
        // If student is not in any class, remove them completely
        if (students[index].classes.length === 0) {
            students.splice(index, 1);
            updateRecentActivity(`Student ${students[index].name} removed from the system.`);
        } else {
            updateRecentActivity(`Student ${students[index].name} removed from ${classType === 'soil-chemistry' ? 'Environmental Soil Chemistry' : 'Sustainable Development'}.`);
        }
        
        saveData(STORAGE_KEYS.STUDENTS, students);
    }
    
    // Update UI
    updateStudentCounts();
    
    if (document.getElementById(`${classType}-students-list`)) {
        filterStudents(classType);
    }
    if (document.getElementById('all-students-list')) {
        filterAllStudents();
    }
}

// Delete student completely
function deleteStudent(studentId) {
    const students = getData(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === studentId);
    
    if (index === -1) return;
    
    const studentName = students[index].name;
    students.splice(index, 1);
    saveData(STORAGE_KEYS.STUDENTS, students);
    
    updateRecentActivity(`Student ${studentName} deleted from the system.`);
    
    // Update UI
    updateStudentCounts();
    
    if (document.getElementById('soil-students-list')) {
        filterStudents('soil-chemistry');
    }
    if (document.getElementById('sust-students-list')) {
        filterStudents('sustainable-dev');
    }
    if (document.getElementById('all-students-list')) {
        filterAllStudents();
    }
    if (document.getElementById('student-details')) {
        document.getElementById('student-details').innerHTML = '<h2>Student Details</h2><p>Select a student to view details</p>';
    }
}

// Delete assignment
function deleteAssignment(assignmentId) {
    const assignments = getData(STORAGE_KEYS.ASSIGNMENTS);
    const index = assignments.findIndex(a => a.id === assignmentId);
    
    if (index === -1) return;
    
    const classType = assignments[index].classType;
    const title = assignments[index].title;
    
    assignments.splice(index, 1);
    saveData(STORAGE_KEYS.ASSIGNMENTS, assignments);
    
    updateRecentActivity(`Assignment "${title}" deleted.`);
    
    // Update UI
    if (document.getElementById(`${classType}-assignments-list`)) {
        renderAssignmentsList(classType);
    }
}

// Delete announcement
function deleteAnnouncement(announcementId) {
    const announcements = getData(STORAGE_KEYS.ANNOUNCEMENTS);
    const index = announcements.findIndex(a => a.id === announcementId);
    
    if (index === -1) return;
    
    const classType = announcements[index].classType;
    
    announcements.splice(index, 1);
    saveData(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    
    updateRecentActivity(`Announcement deleted.`);
    
    // Update UI
    if (document.getElementById(`${classType}-announcements`)) {
        renderAnnouncements(classType);
    }
}

// Delete resource
function deleteResource(resourceId) {
    const resources = getData(STORAGE_KEYS.RESOURCES);
    const index = resources.findIndex(r => r.id === resourceId);
    
    if (index === -1) return;
    
    const title = resources[index].title;
    
    resources.splice(index, 1);
    saveData(STORAGE_KEYS.RESOURCES, resources);
    
    updateRecentActivity(`Resource "${title}" deleted.`);
    
    // Update UI
    filterResources();
}

// Delete group
function deleteGroup(groupId) {
    const groups = getData(STORAGE_KEYS.GROUPS);
    const index = groups.findIndex(g => g.id === groupId);
    
    if (index === -1) return;
    
    const name = groups[index].name;
    
    groups.splice(index, 1);
    saveData(STORAGE_KEYS.GROUPS, groups);
    
    updateRecentActivity(`Project group "${name}" deleted.`);
    
    // Update UI
    renderProjectGroups();
}

// Export student data
function exportStudentData() {
    const students = getData(STORAGE_KEYS.STUDENTS);
    
    // Create CSV content
    let csvContent = "Name,Email,Classes\n";
    
    students.forEach(student => {
        const classes = student.classes.map(cls => 
            cls === 'soil-chemistry' ? 'Environmental Soil Chemistry' : 'Sustainable Development'
        ).join('; ');
        
        csvContent += `${student.name},${student.email},"${classes}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import students
function importStudents() {
    const modal = document.getElementById('import-students-modal');
    modal.style.display = 'block';
    
    // Set up form submission
    const form = document.getElementById('import-students-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('students-csv');
        const file = fileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const content = e.target.result;
                const rows = content.split('\n');
                
                // Skip header row
                for (let i = 1; i < rows.length; i++) {
                    if (rows[i].trim() === '') continue;
                    
                    const columns = rows[i].split(',');
                    
                    // Basic validation
                    if (columns.length < 3) continue;
                    
                    const name = columns[0].trim();
                    const email = columns[1].trim();
                    const classesText = columns[2].replace(/"/g, '').trim();
                    
                    // Parse classes
                    const classes = [];
                    if (classesText.includes('Environmental Soil Chemistry')) {
                        classes.push('soil-chemistry');
                    }
                    if (classesText.includes('Sustainable Development')) {
                        classes.push('sustainable-dev');
                    }
                    
                    addStudent(name, email, classes);
                }
                
                updateRecentActivity(`Students imported from CSV file.`);
                
                // Update UI
                updateStudentCounts();
                
                if (document.getElementById('soil-students-list')) {
                    filterStudents('soil-chemistry');
                }
                if (document.getElementById('sust-students-list')) {
                    filterStudents('sustainable-dev');
                }
                if (document.getElementById('all-students-list')) {
                    filterAllStudents();
                }
                
                closeModal();
            };
            
            reader.readAsText(file);
        }
    };
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    initializeData();
    
    // Update student counts on dashboard
    updateStudentCounts();
    
    // Set up form event listeners
    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.onsubmit = function(e) {
            e.preventDefault();
            
            const name = document.getElementById('student-name').value;
            const email = document.getElementById('student-email').value;
            const classes = [];
            
            if (document.getElementById('soil-class').checked) {
                classes.push('soil-chemistry');
            }
            if (document.getElementById('sust-class').checked) {
                classes.push('sustainable-dev');
            }
            
            addStudent(name, email, classes);
            
            // Update UI
            if (document.getElementById('soil-students-list') && classes.includes('soil-chemistry')) {
                filterStudents('soil-chemistry');
            }
            if (document.getElementById('sust-students-list') && classes.includes('sustainable-dev')) {
                filterStudents('sustainable-dev');
            }
            if (document.getElementById('all-students-list')) {
                filterAllStudents();
            }
            
            closeModal();
            this.reset();
        };
    }
    
    // Render students lists
    if (document.getElementById('soil-students-list')) {
        filterStudents('soil-chemistry');
    }
    if (document.getElementById('sust-students-list')) {
        filterStudents('sustainable-dev');
    }
    if (document.getElementById('all-students-list')) {
        filterAllStudents();
    }
    
    // Render assignments lists
    if (document.getElementById('soil-assignments-list')) {
        renderAssignmentsList('soil-chemistry');
    }
    if (document.getElementById('sust-assignments-list')) {
        renderAssignmentsList('sustainable-dev');
    }
    
    // Render announcements
    if (document.getElementById('soil-announcements')) {
        renderAnnouncements('soil-chemistry');
    }
    if (document.getElementById('sust-announcements')) {
        renderAnnouncements('sustainable-dev');
    }
    
    // Render resources
    if (document.getElementById('soil-resources') || 
        document.getElementById('sust-resources') || 
        document.getElementById('general-resources')) {
        filterResources();
    }
    
    // Render project groups
    if (document.getElementById('project-groups')) {
        renderProjectGroups();
    }
    
    // Render calendar
    if (document.getElementById('calendar')) {
        renderCalendar();
    }
});;

// Initialize data if not exists
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
        localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    }
}

// Load data from storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Save data to storage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add Student
function addStudent(name, email, classes) {
    const students = getData(STORAGE_KEYS.STUDENTS);
    const newStudent = {
        id: generateId(),
        name,
        email,
        classes,
        attendance: {
            'soil-chemistry': [],
            'sustainable-dev': []
        }
    };
    students.push(newStudent);
    saveData(STORAGE_KEYS.STUDENTS, students);
    updateStudentCounts();
    updateRecentActivity(`Student ${name} added to the system.`);
    return newStudent;
}

// Add Assignment
function addAssignment(title, dueDate, description, classType) {
    const assignments = getData(STORAGE_KEYS.ASSIGNMENTS);
    const newAssignment = {
        id: generateId(),
        title,
        dueDate,
        description,
        classType
    };
    assignments.push(newAssignment);
    saveData(STORAGE_KEYS.ASSIGNMENTS, assignments);
    updateRecentActivity(`New assignment added: ${title}`);
    return newAssignment;
}

// Add Announcement
function addAnnouncement(classType, text) {
    const announcements = getData(STORAGE_KEYS.ANNOUNCEMENTS);
    const newAnnouncement = {
        id: generateId(),
        classType,
        text,
        date: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    saveData(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    updateRecentActivity(`New announcement posted for ${classType === 'soil-chemistry' ? 'Environmental Soil Chemistry' : 'Sustainable Development'}`);
    
    // Update announcements display
    if (document.getElementById(`${classType}-announcements`)) {
        renderAnnouncements(classType);
    }
    
    return newAnnouncement;
}

// Add Resource
function addResource(title, type, link, description, classType) {
    const resources = getData(STORAGE_KEYS.RESOURCES);
    const newResource = {
        id: generateId(),
        title,
        type,
        link,
        description,
        classType,
        dateAdded: new Date().toISOString()
    };
    resources.push(newResource);
    saveData(STORAGE_KEYS.RESOURCES, resources);
    updateRecentActivity(`New resource added: ${title}`);
    return newResource;
}

// Add Group
function addGroup(name, topic, members) {
    const groups = getData(STORAGE_KEYS.GROUPS);
    const newGroup = {
        id: generateId(),
        name,
        topic,
        members
    };
    groups.push(newGroup);
    saveData(STORAGE_KEYS.GROUPS, groups);
    updateRecentActivity(`New project group created: ${name}`);
    return newGroup;
}

// Add Event
function addEvent(title, date, time, description, classType) {
    const events = getData(STORAGE_KEYS.EVENTS);
    const newEvent = {
        id: generateId(),
        title,
        date,
        time,
        description,
        classType
    };
    events.push(newEvent);
    saveData(STORAGE_KEYS.EVENTS, events);
    updateRecentActivity(`New event added: ${title} on ${formatDate(date)}`);
    return newEvent;
}

// Delete data item
function deleteItem(key, id) {
    const items = getData(key);
    const updatedItems = items.filter(item => item.id !== id);
    saveData(key, updatedItems);
}

// Filter Students
function filterStudents(classType) {
    const searchTerm = document.getElementById(`${classType}-student-search`).value.toLowerCase();
    const students = getData(STORAGE_KEYS.STUDENTS);
    const filteredStudents = students.filter(student => 
        student.classes.includes(classType) && 
        (student.name.toLowerCase().includes(searchTerm) || 
         student.email.toLowerCase().includes(searchTerm))
    );
    
    renderStudentsList(classType, filteredStudents);
}

// Filter All Students
function filterAllStudents() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const filterSoil = document.getElementById('filter-soil').checked;
    const filterSust = document.getElementById('filter-sust').checked;
    
    const students = getData(STORAGE_KEYS.STUDENTS);
    const filteredStudents = students.filter(student => {
        // Filter by class type
        const classFilter = (filterSoil && student.classes.includes('soil-chemistry')) || 
                           (filterSust && student.classes.includes('sustainable-dev'));
                           
        // Filter by search term
        const searchFilter = student.name.toLowerCase().includes(searchTerm) || 
                            student.email.toLowerCase().includes(searchTerm);
                            
        return classFilter && searchFilter;
    });
    
    renderAllStudentsList(filteredStudents);
}

// Filter Resources
function filterResources() {
    const searchTerm = document.getElementById('resource-search').value.toLowerCase();
    const filterSoil = document.getElementById('filter-soil-resources').checked;
    const filterSust = document.getElementById('filter-sust-resources').checked;
    const filterGeneral = document.getElementById('filter-general-resources').checked;
    
    // Show/hide resource sections based on filters
    const soilSection = document.querySelector('.resource-section[data-class="soil-chemistry"]');
    const sustSection = document.querySelector('.resource-section[data-class="sustainable-dev"]');
    const generalSection = document.querySelector('.resource-section[data-class="general"]');
    
    soilSection.style.display = filterSoil ? 'block' : 'none';
    sustSection.style.display = filterSust ? 'block' : 'none';
    generalSection.style.display = filterGeneral ? 'block' : 'none';
    
    // Apply search filter within visible sections
    const resources = getData(STORAGE_KEYS.RESOURCES);
    
    if (filterSoil) {
        const soilResources = resources.filter(resource => 
            resource.classType === 'soil-chemistry' && 
            (resource.title.toLowerCase().includes(searchTerm) || 
             resource.description.toLowerCase().includes(searchTerm))
        );
        renderResourcesList('soil', soilResources);
    }
    
    if (filterSust) {
        const sustResources = resources.filter(resource => 
            resource.classType === 'sustainable-dev' && 
            (resource.title.toLowerCase().includes(searchTerm) || 
             resource.description.toLowerCase().includes(searchTerm))
        );
        renderResourcesList('sust', sustResources);
    }
    
    if (filterGeneral) {
        const generalResources = resources.filter(resource => 
            resource.classType === 'general' && 
            (resource.title.toLowerCase().includes(searchTerm) || 
             resource.description.toLowerCase().includes(searchTerm))
        );
        renderResourcesList('general', generalResources);
    }
}

// Render Students List
function renderStudentsList(classType, students) {
    const listElement = document.getElementById(`${classType}-students-list`);
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (students.length === 0) {
        listElement.innerHTML = `<tr><td colspan="4">No students found</td></tr>`;
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
                <select class="attendance-select" data-student="${student.id}" data-class="${classType}">
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                </select>
                <button class="btn" onclick="markAttendance('${student.id}', '${classType}')">Save</button>
            </td>
            <td>
                <button class="btn" onclick="showEditStudentModal('${student.id}')">Edit</button>
                <button class="btn" onclick="removeStudentFromClass('${student.id}', '${classType}')">Remove</button>
            </td>
        `;
        listElement.appendChild(row);
    });
}

// Render All Students List
function renderAllStudentsList(students) {
    const listElement = document.getElementById('all-students-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (students.length === 0) {
        listElement.innerHTML = `<tr><td colspan="5">No students found</td></tr>`;
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        const classesBadges = student.classes.map(cls => {
            const className = cls === 'soil-chemistry' ? 'Environmental Soil Chemistry' : 'Sustainable Development';
            return `<span class="badge badge-${cls === 'soil-chemistry' ? 'success' : 'warning'}">${className}</span>`;
        }).join(' ');
        
        row.innerHTML = `
            <td><a href="#" onclick="showStudentDetails('${student.id}'); return false;">${student.name}</a></td>
            <td>${student.email}</td>
            <td>${classesBadges}</td>
            <td>P: ${getAttendanceCount(student, 'present')}, A: ${getAttendanceCount(student, 'absent')}, L: ${getAttendanceCount(student, 'late')}</td>
            <td>
                <button class="btn" onclick="showEditStudentModal('${student.id}')">Edit</button>
                <button class="btn" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        listElement.appendChild(row);
    });
}

// Get attendance count
function getAttendanceCount(student, status) {
    let count = 0;
    for (const classType in student.attendance) {
        count += student.attendance[classType].filter(record => record.status === status).length;
    }
    return count;
}

// Render Assignments List
function renderAssignmentsList(classType) {
    const listElement = document.getElementById(`${classType}-assignments-list`);
    if (!listElement) return;
    
    const assignments = getData(STORAGE_KEYS.ASSIGNMENTS)
        .filter(assignment => assignment.classType === classType);
    
    listElement.innerHTML = '';
    
    if (assignments.length === 0) {
        listElement.innerHTML = `<tr><td colspan="4">No assignments found</td></tr>`;
        return;
    }
    
    assignments.forEach(assignment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${assignment.title}</td>
            <td>${formatDate(assignment.dueDate)}</td>
            <td>${assignment.description}</td>
            <td>
                <button class="btn" onclick="editAssignment('${assignment.id}')">Edit</button>
                <button class="btn" onclick="deleteAssignment('${assignment.id}')">Delete</button>
            </td>
        `;
        listElement.appendChild(row);
    });
}

// Render Announcements
function renderAnnouncements(classType) {
    const container = document.getElementById(`${classType}-announcements`);
    if (!container) return;
    
    const announcements = getData(STORAGE_KEYS.ANNOUNCEMENTS)
        .filter(announcement => announcement.classType === classType)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = '';
    
    if (announcements.length === 0) {
        container.innerHTML = '<p>No announcements yet</p>';
        return;
    }
    
    announcements.forEach(announcement => {
        const div = document.createElement('div');
        div.className = 'announcement';
        div.innerHTML = `
            <div class="announcement-date">${formatDate(announcement.date)}</div>
            <div class="announcement-text">${announcement.text}</div>
            <button class="btn" onclick="deleteAnnouncement('${announcement.id}')" style="margin-top: 10px;">Delete</button>
        `;
        container.appendChild(div);
    });
}

// Render Resources List
function renderResourcesList(prefix, resources) {
    const container = document.getElementById(`${prefix}-resources`);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (resources.length === 0) {
        container.innerHTML = '<p>No resources available</p>';
        return;
    }
    
    resources.forEach(resource => {
        const div = document.createElement('div');
        div.className = 'resource-card';
        div.innerHTML = `
            <span class="resource-type">${resource.type}</span>
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <a href="${resource.link}" target="_blank" class="btn">View Resource</a>
            <button class="btn" onclick="deleteResource('${resource.id}')" style="margin-top: 10px;">Delete</button>
        `;
        container.appendChild(div);
    });
}

// Render Project Groups
function renderProjectGroups() {
    const container = document.getElementById('project-groups');
    if (!container) return;
    
    const groups = getData(STORAGE_KEYS.GROUPS);
    const students = getData(STORAGE_KEYS.STUDENTS);
    
    container.innerHTML = '';
    
    if (groups.length === 0) {
        container.innerHTML = '<p>No project groups created yet</p>';
        return;
    }
    
    groups.forEach(group => {
        const div = document.createElement('div');
        div.className = 'class-section';
        
        // Get student names from IDs
        const memberNames = group.members.map(memberId => {
            const student = students.find(s => s.id === memberId);
            return student ? student.name : 'Unknown Student';
        });
        
        div.innerHTML = `
            <h3>${group.name}</h3>
            <p><strong>Topic:</strong> ${group.topic}</p>
            <h4>Members:</h4>
            <ul>
                ${memberNames.map(name => `<li>${name}</li>`).join('')}
            </ul>
            <button class="btn" onclick="deleteGroup('${group.id}')">Delete Group</button>
        `;
        container.appendChild(div);
    });
}

// Render Calendar
function renderCalendar() {
    const container = document.getElementById('calendar');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create calendar based on current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get first day of month and last day
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Get events for this month
    const events = getData(STORAGE_KEYS.EVENTS).filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
    
    // Days of week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        container.appendChild(dayHeader);
    });
    
    // Add empty cells for days before first day of month
    const startingDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        container.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        // Highlight current day
        if (day === now.getDate()) {
            dayCell.style.backgroundColor = '#f0f8ff';
            dayCell.style.fontWeight = 'bold';
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        
        // Add events for this day
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day;
        });
        
        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `calendar-event ${event.classType === 'soil-chemistry' ? 'event-soil' : event.classType === 'sustainable-dev' ? 'event-sust' : 'event-general'}`;
            eventDiv.textContent = event.title;
            eventDiv.title = `${event.time ? event.time + ' - ' : ''}${event.description || ''}`;
            dayCell.appendChild(eventDiv);
        });
        
        container.appendChild(dayCell);
    }
}

// Update Student Counts
function updateStudentCounts() {
    const students = getData(STORAGE_KEYS.STUDENTS);
    
    // Count students in each class
    const soilCount = students.filter(student => student.classes.includes('soil-chemistry')).length;
    const sustCount = students.filter(student => student.classes.includes('sustainable-dev')).length;
    
    // Update dashboard counters
    const soilCountElement = document.getElementById('soil-students-count');
    const sustCountElement = document.getElementById('sust-students-count');
    
    if (soilCountElement) soilCountElement.textContent = soilCount;
    if (sustCountElement) sustCountElement.textContent = sustCount;
}

// Update Recent Activity
function updateRecentActivity(activity) {
    const recentActivityElement = document.getElementById('recent-activity');
    if (!recentActivityElement) return;
    
    const activityItem = document.createElement('li');
    activityItem.textContent = activity;
    
    // Keep only the last 5 activities
    if (recentActivityElement.children.length >= 5) {
        recentActivityElement.removeChild(recentActivityElement.lastChild);
    }
    
    // Add new activity at the top
    recentActivityElement.insertBefore(activityItem, recentActivityElement.firstChild);
}

// Show Student Details
function showStudentDetails(studentId) {
    const students = getData(STORAGE_KEYS.STUDENTS);
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    const detailsContainer = document.getElementById('student-details');
    if (!detailsContainer) return;
    
    const classesList = student.classes.map(cls => 
        cls === 'soil-chemistry' ? 'Environmental Soil Chemistry' : 'Sustainable Development'
    ).join(', ');
    
    detailsContainer.innerHTML = `
        <h2>${student.name}</h2>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Classes:</strong> ${classesList}</p>
        
        <h3>Attendance Record</h3>
        <div class="attendance-summary">
            <p>Present: ${getAttendanceCount(student, 'present')}</p>
            <p>Absent: ${getAttendanceCount(student, 'absent')}</p>
            <p>Late: ${getAttendanceCount(student, 'late')}</p>
        </div>
        
        <button class="btn" onclick="showEditStudentModal('${student.id}')">Edit Student</button>
        <button class="btn" onclick="deleteStudent('${student.id}')">Delete Student</button>
    `;
}

// Modal Control Functions
function showAddStudentModal(classType = null) {
    const modal = document.getElementById('add-student-modal');
    modal.style.display = 'block';
    
    // Pre-select class if provided
    if (classType) {
        if (classType === 'soil-chemistry') {
            document.getElementById('soil-class').checked = true;
            document.getElementById('sust-class').checked = false;
        } else if (classType === 'sustainable-dev') {
            document.getElementById('soil-class').checked = false;
            document.getElementById('sust-class').checked = true;
        }
    }
    
    // Set up form submission
    const form = document.getElementById('add-student-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const name = document.getElementById('student-name').value;
        const email = document.getElementById('student-email').value;
        const classes = [];
        
        if (document.getElementById('soil-class').checked) {
            classes.push('soil-chemistry');
        }
        if (document.getElementById('sust-class').checked) {
            classes.push('sustainable-dev');
        }
        
        addStudent(name, email, classes);
        
        // Update UI
        if (document.getElementById('soil-students-list') && classes.includes('soil-chemistry')) {
            filterStudents('soil-chemistry');
        }
        if (document.getElementById('sust-students-list') && classes.includes('sustainable-dev')) {
            filterStudents('sustainable-dev');
        }
        if (document.getElementById('all-students-list')) {
            filterAllStudents();
        }
        
        closeModal();
        form.reset();
    };
