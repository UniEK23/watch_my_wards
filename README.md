# Student Record Management System

A responsive student management dashboard built with HTML, CSS, and JavaScript. The application connects to a REST API built with Node.js and Express.js to manage student records through a clean, interactive interface.

The project focuses on responsive UI development, REST API integration, and CRUD operations.

## Features

### Dashboard

- View the total number of registered students.
- See how many unique courses are represented.
- Calculate the average age of students.
- View statistics generated from actual API data.

### Student Management

- Retrieve and display student records from the API.
- Add new student records.
- Edit existing student information.
- Delete student records with confirmation.
- Search students by name, ID, or course.
- Filter students by course.

### Responsive Design

- Mobile-first interface.
- Dedicated mobile, tablet, and desktop layouts.
- Student cards on smaller screens.
- Table-style student records on desktop.
- Responsive navigation.

### User Experience

- Loading indicators.
- Empty states when no records are available.
- Success and error notifications.
- Form validation.
- Responsive add/edit forms.
- Error handling for unsuccessful API requests.

## Tech Stack

| Technology   | Purpose                                    |
| ------------ | ------------------------------------------ |
| HTML5        | Page structure                             |
| CSS3         | Styling and responsive layouts             |
| JavaScript   | Application logic and DOM manipulation     |
| Remix Icon   | Interface icons                            |
| Node.js      | Backend runtime                            |
| Express.js   | REST API                                   |
| Fetch API    | Communication between frontend and backend |
| Git & GitHub | Version control                            |

## Architecture

The application uses a frontend-backend architecture.

```text
┌──────────────────────────────┐
│       Frontend Interface     │
│                              │
│       HTML + CSS + JS        │
└──────────────┬───────────────┘
               │
               │ HTTP Requests
               │ Fetch API
               ▼
┌──────────────────────────────┐
│        Express API           │
│                              │
│       Node.js + Express      │
└──────────────┬───────────────┘
               │
               ▼
        Student Records
```

The frontend requests student data from the API and displays the returned records. When users add, update, or delete students, the frontend sends the appropriate HTTP request to the backend.

## Project Structure

```text
student-record-dashboard/
│
├── index.html
├── student_manager.css
├── student_manager.js
└── README.md
```

The backend API is maintained separately.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- A modern web browser
- Visual Studio Code (recommended)
- The Student Record API

### 1. Clone the Frontend Repository

```bash
git clone <your-frontend-repository-url>
```

Navigate into the downloaded project directory:

```bash
cd student-record-dashboard
```

Replace the repository URL and folder name with your actual values.

### 2. Set Up the Backend

Clone or open the Student Record API repository:

[Student Record API — GitHub](https://github.com/JasielKells/student-record-api-group2C/tree/ekan-anaikot%2Fstudent-api)

Open a terminal in the backend project directory and install its dependencies:

```bash
npm install
```

Start the server using the command configured in the backend's `package.json`.

For example:

```bash
npm start
```

Or, if a development script is configured:

```bash
npm run dev
```

Keep the backend server running.

### 3. Configure the API URL

Open `student_manager.js` and locate the API URL:

```javascript
const API_URL = "http://localhost:3000/students";
```

Make sure the URL matches the address and port on which your Express server is running.

### 4. Run the Frontend

Open the frontend folder in Visual Studio Code.

Using the Live Server extension:

1. Open `index.html`.
2. Right-click inside the editor.
3. Select **Open with Live Server**.
4. The dashboard will open in your browser.

The frontend and backend run separately, communicating through HTTP requests.

### 5. Test the Application

With both servers running, verify that you can:

- Load existing student records.
- Search for a student.
- Filter students by course.
- Add a student.
- Edit a student's information.
- Delete a student.
- See the dashboard statistics update.

## API Endpoints

The frontend communicates with the following API routes:

| Method | Endpoint        | Description                        |
| ------ | --------------- | ---------------------------------- |
| GET    | `/students`     | Retrieve all students              |
| GET    | `/students/:id` | Retrieve a specific student        |
| POST   | `/students`     | Create a student record            |
| PATCH  | `/students/:id` | Update selected student fields     |
| PUT    | `/students/:id` | Replace or update a student record |
| DELETE | `/students/:id` | Delete a student record            |

### Example Student Object

```json
{
  "id": 1,
  "name": "John Doe",
  "course": "Computer Science",
  "age": 21
}
```

## Responsive Design

The interface adapts to different screen sizes.

| Device  | Layout                                                                   |
| ------- | ------------------------------------------------------------------------ |
| Mobile  | Compact header, stacked statistics, student cards, bottom navigation     |
| Tablet  | Expanded content area, two-column statistics, responsive student cards   |
| Desktop | Sidebar navigation, three-column statistics, table-style student records |

## Future Improvements

Potential enhancements include:

- Database integration for persistent storage.
- Pagination for large student lists.
- Sorting by student name, age, or course.
- Student profile views.
- User authentication and authorization.
- Exporting student records to CSV.
- Improved accessibility and keyboard navigation.
- Automated frontend and API tests.
- Deployment with a hosted frontend and backend.

## About This Project

This project is an opportunity to practise building responsive interfaces and connecting a frontend to a REST API.

It demonstrates the use of JavaScript for DOM manipulation, asynchronous requests, event handling, form validation, and dynamic rendering.

It also explores the practical relationship between frontend interfaces and backend services.

---

**Built as a web development learning project.**
