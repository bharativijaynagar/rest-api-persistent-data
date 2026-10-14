# TaskFlow — REST API and Persistent Data

A full, beginner-friendly internship project demonstrating REST API development, CRUD operations, validation, and persistent database storage. It includes a responsive frontend and an Express.js backend with SQLite.

## Features

- Create, read, update, and delete tasks (CRUD)
- Mark tasks as completed/in progress
- Filter all, active, and completed tasks
- Dashboard summary counts
- SQLite database persists tasks after restarting the server
- Input validation and useful HTTP status codes
- Responsive mobile and desktop interface
- API health endpoint

## Requirements

- Node.js 18 or later
- npm (included with Node.js)

## Run locally

1. Extract the ZIP file.
2. Open the extracted `rest-api-persistent-data` folder in VS Code.
3. Open Terminal → New Terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open **http://localhost:3000** in Chrome.

The SQLite database file `tasks.db` is created automatically in the project folder. Do not delete it if you want to keep your saved tasks.

## REST API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace/update a task |
| PATCH | `/api/tasks/:id` | Partially update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example POST request

Send JSON to `POST /api/tasks`:

```json
{
  "title": "Finish internship project",
  "description": "Test the REST API and upload the project to GitHub",
  "completed": false
}
```

Example success response: HTTP `201 Created`, with the saved task object.

## Test the API

Open `http://localhost:3000/api/health` in your browser. You should see:

```json
{"status":"ok","message":"Task API is running"}
```

You can test CRUD endpoints using the frontend, Postman, or Thunder Client in VS Code. For POST/PUT/PATCH, set the request body type to JSON.

## Project structure

```text
rest-api-persistent-data/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── server.js
└── README.md
```

`tasks.db` is generated on first run and is intentionally not included in the ZIP.

## Suggested GitHub upload steps

1. Create a new **public** repository named `rest-api-persistent-data`.
2. Extract this ZIP on your computer.
3. Open the extracted folder and upload the project files/folder contents to the repository.
4. Make sure `README.md`, `server.js`, `package.json`, and `public/` are visible in the repository root.
5. Click **Commit changes**.
6. Copy the repository URL, for example `https://github.com/YOUR-USERNAME/rest-api-persistent-data`.
7. Paste that URL into the EdVyro Project URL field for **REST API and Persistent Data**, then click **Submit for review**.

## Important before submission

- Run the project locally and test add, edit, complete, delete, and refresh persistence.
- Read your EdVyro task's exact rubric and compare it with this project's features. Add any specifically required features before submitting.
- A GitHub repository link shows the source code; it does not automatically host the running application. If the task specifically asks for a deployed URL, deploy the backend and database to a compatible host with persistent storage.
