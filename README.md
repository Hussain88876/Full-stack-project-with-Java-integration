# Full Stack Social Platform with Java Integration

> **Prerequisite:** This project utilises Node v20.

This was a collaborative project developed over a two-week sprint, after which I have continued to make individual improvements.. It is a full-stack blogging and social media system that utilises RESTful APIs and a SQLite database to handle **Data Persistence** (permanent local changes) regarding account creation, content management, and administrative controls.

Uniquely, this project integrates a **Java Swing GUI** as a dedicated backend administration tool, demonstrating cross-application communication.

## Core Technologies
This project incorporates essential and intermediate programming principles, including secure authentication and database management.

* **Frontend:** Svelte, JavaScript
* **Backend:** Node.js, Express
* **Database:** SQLite
* **Desktop Admin:** Java (Swing)
* **Security:** bcrypt (Password hashing/salting)

## Features

### User Platform (Svelte/Node.js)
* **Secure Authentication:** User registration and login flows.
* **Security:** Implementation of password hashing and salting.
* **CRUD Operations:** Permanent creation, editing, and deletion of user profiles.
* **Content Management:** Permanent uploading of pictures, blogs, and comments.
* **Interactivity:** Ability to like and unlike articles.

### Admin Dashboard (Java Swing)
* **Cross-Platform Integration:** A Java desktop application integrated directly with the backend.
* **Admin Authentication:** Secure, admin-only login gate.
* **User Management:** Visualise all users in a data table.
* **Administrative Control:** Select specific users to permanently delete them from the database.

## Installation & Setup

### 1. Backend Setup
Navigate to the server directory to install dependencies and start the API.

```bash
npm install
npm run dev
```

### 2. Frontend Setup
Navigate to the client directory to launch the Svelte application.

```bash
npm install
npm run dev
```

### 3. Java Admin Integration
The Java GUI allows for administrative control over the backend data.

1.  Ensure the Backend server (Step 1) is running.
2.  Launch the Java application.
3.  **Log in using the Admin Credentials:**
    * **Username:** `johndoe`
    * **Password:** `password123`
4.  **Usage:** The Admin will see all users populated in a table. By selecting a row, you will be taken to a management panel where you can permanently delete the selected user.

## Future Roadmap
* **UI Modernisation:** Overhaul the user interface to a more modern standard (Pending availability between current SaaS projects).
