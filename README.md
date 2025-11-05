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