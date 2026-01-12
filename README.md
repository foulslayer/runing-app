# Run Backend
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/foulslayer/run-backend)

## Overview

This repository contains the backend service for a run tracking application, built with the [NestJS](https://nestjs.com/) framework. It provides a RESTful API for user authentication, profile management, and recording run history. The application uses TypeORM to interact with a PostgreSQL database and Passport.js for handling authentication with JWTs.

## Features

*   **Authentication:** Secure user authentication using Passport.js with local (username/password) and JWT strategies.
*   **User Management:** Endpoints for creating, retrieving, and deleting user accounts.
*   **Run History Tracking:** Create, retrieve, and delete run history records, including distance, speed, time, and date. Each record is associated with a user.
*   **Database Integration:** Uses TypeORM for object-relational mapping with a PostgreSQL database.
*   **Validation:** DTOs with `class-validator` to ensure incoming request data is valid.
*   **CORS Enabled:** Configured to allow requests from specific frontend origins.

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A running PostgreSQL instance

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/foulslayer/run-backend.git
    cd run-backend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  **Database Setup:**
    Ensure you have a PostgreSQL database created. The application is configured to connect to a database named `runDB`.

2.  **Database Connection:**
    The database connection details are currently hardcoded in `src/app.module.ts`. You will need to update them to match your local PostgreSQL configuration.

    ```typescript
    // src/app.module.ts
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Datait2024!', // <-- Update this password
      database: 'runDB',
      entities: [User, Historik],
      synchronize: true, // `synchronize: true` is for development only
    }),
    ```
    For production environments, it is strongly recommended to manage these credentials using environment variables instead of hardcoding them.

## Usage

### Running the Application

*   **Development mode with watch:**
    ```bash
    npm run start:dev
    ```
    The server will start on `http://localhost:3000` and automatically restart on file changes.

*   **Production mode:**
    ```bash
    # Build the application
    npm run build

    # Start the production server
    npm run start:prod
    ```
