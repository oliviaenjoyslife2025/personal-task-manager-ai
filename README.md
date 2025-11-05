
<img width="1316" height="678" alt="image" src="https://github.com/user-attachments/assets/6ae027f3-653a-4874-acfa-2ecb0283572c" />

# Personal Task Manager AI

### A full-stack Personal Task Manager built with Django and React, featuring PostgreSQL data storage, and integrated AI-based analysis to provide user behavioral insights.

## Overview

This project is a modernized task management system designed to help users go beyond simple to-do lists. It combines robust CRUD functionality with a powerful **AI-driven analysis engine** to offer personalized insights into task habits, productivity, and time allocation.

## Key Features

* **Full CRUD:** Complete functionality for creating, viewing, updating, and deleting tasks.
* **Advanced Scheduling:** Support for task priority (High, Medium, Low) and configuration of recurring tasks.
* **AI Behavioral Insights:** Analyzes the past three days of user tasks (volume, completion rate, timing) to generate actionable insights into work habits.
* **Email Reminders:** Automated email notifications for approaching task deadlines.
* **Modern Interface:** Built with React and Material UI for a responsive, accessible, and user-friendly experience.

## Technology Stack

| Role | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | **Django** (Python) + **DRF** (Django REST Framework) | Rapid API development, business logic, and ORM handling. |
| **Database** | **PostgreSQL** | Reliable and scalable relational data storage. |
| **Frontend** | **React.js** + **Material-UI** | Building a modern Single Page Application (SPA) interface. |
| **Data Analysis** | **Pandas** / **NumPy** | High-performance extraction and feature engineering from task data. |
| **AI/ML** | Rule-Based Engine (Initial) / Scikit-learn (Future) | Generating data-backed behavioral insights. |
| **Asynchronous Tasks** | Django-Q / Celery (Planned) | Handling email reminders and heavy analysis tasks. |

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Python 3.9+
* Node.js and npm (or yarn)
* A running **PostgreSQL** database service.

### 1. Repository Setup & Clone

```bash
# Clone the repository
git clone [https://github.com/oliviaenjoyslife2025/personal-task-manager-ai.git](https://github.com/oliviaenjoyslife2025/personal-task-manager-ai.git)
cd personal-task-manager-ai
```

### 2. Backend Setup & Startup

#### 2.1 Database Configuration

First, ensure PostgreSQL is installed and running. Then create a database and user:

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE db_name;
CREATE USER user_name WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE db_name TO user_name;
```

#### 2.2 Install Dependencies

```bash
# Navigate to backend directory
cd taskmanager_backend

# Install Python dependencies
pip install -r requirements.txt
```

#### 2.3 Database Migrations

```bash
# Run migrations to create database tables
python manage.py migrate

# (Optional) Create a superuser for Django admin
python manage.py createsuperuser
```

#### 2.4 Start Backend Server

```bash
# Start Django development server
python manage.py runserver
```

The backend API will be available at: **http://127.0.0.1:8000/**

### 3. Frontend Setup & Startup

#### 3.1 Install Dependencies

Open a new terminal window and navigate to the frontend directory:

```bash
# Navigate to frontend directory
cd taskmanager_frontend

# Install Node.js dependencies
npm install
```

#### 3.2 Start Frontend Development Server

```bash
# Start Vite development server
npm run dev
```

The frontend application will be available at: **http://localhost:3000/**

The Vite dev server is configured with a proxy that forwards `/v1/*` requests to the Django backend at `http://localhost:8000`.

### 4. API Endpoints & URLs

#### 4.1 Base URLs

- **Backend API**: `http://127.0.0.1:8000/`
- **Frontend**: `http://localhost:3000/`

#### 4.2 API Endpoints

All API endpoints are prefixed with `/v1/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/tasks/` | Get all tasks (list) |
| `POST` | `/v1/tasks/` | Create a new task |
| `GET` | `/v1/tasks/{id}/` | Get a specific task (detail) |
| `PUT` | `/v1/tasks/{id}/` | Update a task (full update) |
| `PATCH` | `/v1/tasks/{id}/` | Update a task (partial update) |
| `DELETE` | `/v1/tasks/{id}/` | Delete a task |

#### 4.3 URL Structure

**Backend URL Configuration:**
- Main URL config: `taskmanager_backend/config/urls.py`
  - `/admin/` → Django admin interface
  - `/v1/` → Includes task API routes
- Task API routes: `taskmanager_backend/tasks/urls.py`
  - Uses Django REST Framework's `DefaultRouter`
  - Automatically generates RESTful endpoints for Task model

**Frontend URL Configuration:**
- Vite proxy config: `taskmanager_frontend/vite.config.js`
  - All `/v1/*` requests are proxied to `http://localhost:8000`
  - Frontend runs on port 3000

#### 4.4 Example API Usage

**Create a new task:**
```bash
curl -X POST http://127.0.0.1:8000/v1/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "priority": "H",
    "due_date": "2024-12-31T23:59:59Z",
    "description": "Write comprehensive README and API docs"
  }'
```

**Get all tasks:**
```bash
curl http://127.0.0.1:8000/v1/tasks/
```

**Update a task:**
```bash
curl -X PATCH http://127.0.0.1:8000/v1/tasks/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Delete a task:**
```bash
curl -X DELETE http://127.0.0.1:8000/v1/tasks/1/
```

#### 4.5 Task Model Fields

The Task model includes the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Primary key (read-only) |
| `title` | String | Yes | Task title (max 255 characters) |
| `description` | Text | No | Task description |
| `completed` | Boolean | No | Task completion status (default: false) |
| `created_at` | DateTime | Auto | Task creation timestamp (read-only) |
| `updated_at` | DateTime | Auto | Task last update timestamp (read-only) |
| `due_date` | DateTime | No | Task due date and time |
| `priority` | String | No | Task priority: `'H'` (High), `'M'` (Medium), `'L'` (Low) (default: 'M') |
| `priority_display` | String | Auto | Human-readable priority (read-only) |
| `is_recurring` | Boolean | No | Whether the task is recurring (default: false) |
| `ai_insight` | Text | No | AI-generated behavioral insights (read-only) |

**Example Task JSON:**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "completed": false,
  "created_at": "2024-12-20T10:30:00Z",
  "updated_at": "2024-12-20T10:30:00Z",
  "due_date": "2024-12-31T23:59:59Z",
  "priority": "H",
  "priority_display": "High",
  "is_recurring": false,
  "ai_insight": null
}
```

## Implementation Challenges

During the development of this project, several technical challenges were encountered and resolved:

### 1. Cross-Origin Resource Sharing (CORS) Configuration

**Challenge:** The frontend running on `localhost:3000` initially couldn't communicate with the Django backend on `localhost:8000` due to CORS restrictions.

**Solution:** 
- Installed and configured `django-cors-headers` middleware
- Added `CORS_ALLOWED_ORIGINS` in `settings.py` to whitelist the frontend origin
- Configured Vite proxy to forward `/v1/*` requests to the backend, which also helps bypass CORS issues during development

### 2. REST Framework Template Configuration

**Challenge:** Encountered `TemplateDoesNotExist` errors when accessing API endpoints, as Django REST Framework couldn't find its templates for the browsable API.

**Solution:** 
- Added `'rest_framework'` to `INSTALLED_APPS` in Django settings
- This ensures REST Framework's templates and static files are properly registered and accessible

### 3. Frontend-Backend API Path Consistency

**Challenge:** Initially used `/api/tasks/` as the API path, but later needed to change to `/v1/tasks/` for versioning. This required updating multiple files across the frontend and backend.

**Solution:** 
- Updated `config/urls.py` to use `v1/` prefix
- Modified frontend `API_BASE_URL` constant and Vite proxy configuration
- Updated all API endpoint references and documentation comments

### 4. Material UI Layout Integration

**Challenge:** Initial layout had overlapping components and inconsistent spacing. Mixing Tailwind CSS classes with Material UI's `sx` prop caused styling conflicts.

**Solution:** 
- Standardized on Material UI's styling system using `sx` prop and `Stack`/`Grid` components
- Removed Tailwind CSS classes from React components
- Used Material UI's spacing system (`spacing={4}`) for consistent layout
- Implemented responsive Grid layout for proper component positioning

### 5. API Serializer Field Customization

**Challenge:** Need to display human-readable priority values (e.g., "High" instead of "H") in API responses while maintaining the database efficiency of storing single-character codes.

**Solution:** 
- Added `priority_display` field to `TaskSerializer` using `source='get_priority_display'`
- This leverages Django's built-in `get_FOO_display()` method for choice fields
- Marked it as `read_only` to prevent API input conflicts

## Future Improvements

The following features and enhancements are planned for future iterations:

### 1. AI Analysis Engine Implementation
- **Current State:** AI insights are currently simulated with placeholder text
- **Future:** Implement actual AI/ML analysis using:
  - Real-time analysis of task completion patterns
  - Predictive models for task difficulty estimation
  - Behavioral pattern recognition using scikit-learn or TensorFlow
  - Integration with OpenAI API or similar services for advanced insights

### 2. Email Reminder System
- **Current State:** Mentioned in features but not yet implemented
- **Future:** 
  - Integrate Celery asynchronous task scheduling
  - Configure SMTP settings for email delivery
  - Implement reminder logic based on task due dates

### 3. Unit Testing
- **Backend Unit Tests:**
  - Test Task model methods and validations using Django's TestCase
  - Test serializer serialization/deserialization logic
  - Test ViewSet methods (list, create, update, delete) with various inputs
  - Test custom queryset methods and filtering

- **Frontend Unit Tests:**
  - Test React components using React Testing Library
  - Test API handlers and error handling logic
 
