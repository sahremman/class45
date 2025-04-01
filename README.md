# # Classroom Management System

A simple, lightweight web application for managing classroom information, students, assignments, and resources for environmental science courses.

## Features

- **Dashboard:** Quick overview of classes and recent activity
- **Class Management:** Separate pages for each class (Environmental Soil Chemistry and Sustainable Development)
- **Student Management:** Add, edit, and remove students from classes
- **Assignment Tracking:** Create and manage assignments for each class
- **Attendance Tracking:** Record and monitor student attendance
- **Resource Library:** Organize teaching materials and references by class
- **Project Groups:** Create and manage student project groups
- **Calendar:** Track important dates and events
- **Announcements:** Post class-specific announcements

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage for data persistence

## Setup and Deployment

1. Clone this repository
2. No build steps required - this is a static website
3. Deploy to GitHub Pages using the Settings tab in your repository

### GitHub Pages Deployment Steps

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "GitHub Pages" section
4. Select "main" or "master" branch as the source
5. Save the settings
6. Your site will be published at `https://yourusername.github.io/repository-name/`

## Data Storage

This application uses browser LocalStorage to save data. This means:
- Data persists between sessions on the same device and browser
- Data is not synchronized between devices
- Clearing browser data will erase all saved information

## Directory Structure

```
/
├── index.html           # Dashboard
├── soil-chemistry.html  # Environmental Soil Chemistry class page
├── sustainable-dev.html # Sustainable Development class page
├── students.html        # Student management page
├── resources.html       # Resources and calendar page
├── styles.css           # Stylesheet
├── app.js               # JavaScript functionality
└── README.md            # This file
```

## Usage Guide

### Adding Students

1. Click "Add Student" button from any page
2. Fill out the student information form
3. Select which class(es) to enroll the student in
4. Submit the form

### Recording Attendance

1. Navigate to the class page (Environmental Soil Chemistry or Sustainable Development)
2. Find the student in the enrolled students table
3. Select attendance status (Present, Absent, Late)
4. Click "Save" to record the attendance

### Creating Assignments

1. Navigate to the class page
2. Click "Add Assignment" button
3. Fill out the assignment details
4. Submit the form

### Managing Resources

1. Navigate to the Resources page
2. Click "Add Resource" button
3. Enter resource information and link
4. Select the related class
5. Submit the form

## Contributing

This is a simple classroom management tool designed for personal use. Feel free to fork and enhance it for your own needs.

## License

MIT License - feel free to use, modify, and distribute as needed.
