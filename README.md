# Event Management System

## Overview
The Event Management System is a web application designed to simplify event organization and management. It uses Flask for the backend and React for the frontend to provide a seamless user experience.

## Features
- Create, edit, view, and delete events with details like name, location, date, and description
- Manage attendees and track event participation
- User authentication and authorization
- Responsive design for various devices

## Getting Started

### Prerequisites
- Python 3.x
- Node.js
- A web browser (e.g., Chrome, Firefox)

### Installation
1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/y-singh09/Event-Management-System.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Event-Management-System
    ```
3. Install backend dependencies:
    ```sh
    pip install -r requirements.txt
    ```
4. Install frontend dependencies:
    ```sh
    cd frontend
    npm install
    ```

### ScreenShots
![Event Management Screenshot](ScreenShot/Screenshot1.png)
![Event Management Screenshot](ScreenShot/Screenshot2.png)
![Event Management Screenshot](ScreenShot/Screenshot3.png)


### Running the Application
1. Start the backend server:
    ```sh
    flask run
    ```
2. Note: The frontend is already deployed, so you only need to run the backend locally.
3. Open `http://localhost:3000` in your web browser to access the application.

## How to Use
1. Log in or create an account to start managing events.
2. Create a new event by providing details such as name, location, date, and description.
3. View the list of upcoming events and click on an event to see more details.
4. Edit or delete events as needed.
5. Manage attendees by adding or removing participants from events.
