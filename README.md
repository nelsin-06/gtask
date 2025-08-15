# GTask - Task Management API

A modern and efficient task management REST API built with NestJS, TypeScript, and PostgreSQL. This application provides comprehensive task management capabilities with user authentication, real-time search, and robust API documentation.

## 🚀 Features

### Core Functionality
- **Complete Task Management**: Create, read, update, delete, and organize tasks
- **User Authentication**: JWT-based authentication with secure password hashing
- **Guest Mode**: Temporary user sessions for quick task management without registration
- **Advanced Search**: Case-insensitive search across task titles with partial matching
- **Pagination & Filtering**: Efficient data retrieval with sorting and status filtering
- **Status Management**: Track task progress with customizable status options

### Technical Features
- **RESTful API**: Well-structured endpoints following REST principles
- **OpenAPI Documentation**: Complete Swagger/OpenAPI documentation with interactive UI
- **Type Safety**: Full TypeScript implementation with strict typing
- **Database Relations**: Properly structured database with TypeORM
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Global exception handling with meaningful error responses
- **CORS Support**: Configured for cross-origin requests

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Reliable relational database
- **ORM**: [TypeORM](https://typeorm.io/) - TypeScript-first ORM
- **Authentication**: [JWT](https://jwt.io/) - JSON Web Tokens
- **Validation**: [class-validator](https://github.com/typestack/class-validator) - Decorator-based validation
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/) - API documentation
- **Password Hashing**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Secure password encryption

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git** (for cloning the repository)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nelsin-06/gtask.git
   cd gtask
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_username
   DB_PASS=your_postgres_password
   DB_NAME=gtask_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   
   # Application Configuration
   PORT=8080
   ```

4. **Set up the database**
   
   Make sure PostgreSQL is running and create a database:
   ```sql
   CREATE DATABASE gtask_db;
   ```
   
   **Note**: The application uses TypeORM with `synchronize: true` in development mode, which means the database tables will be created automatically when you start the application. In production, you should set `synchronize: false` and use proper migrations.

5. **Start the application**
   
   The application will automatically create the necessary database tables on first run:
   ```bash
   npm run start:dev
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Start the application in watch mode
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Other Commands
```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

**Swagger UI**: `http://localhost:8080/api-docs`

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Try-it-out functionality

## 🔐 Authentication

### JWT Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer your-jwt-token-here
```

### Guest Mode
For quick access without registration:

```http
POST /auth/guest
```

This creates a temporary user session with a valid JWT token.

## 📖 API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Login with credentials
- `POST /auth/guest` - Create a guest session

### Tasks
- `GET /tasks` - Get paginated tasks with filtering and search
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Query Parameters (GET /tasks)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `search` - Search term for task titles (case-insensitive)
- `status[]` - Filter by task status
- `sortField` - Field to sort by
- `sortOrder` - Sort direction (asc/desc)

## 🔍 Search Functionality

The search feature supports:
- **Partial matching**: "work" matches "homework", "workout", "work project"
- **Case-insensitive**: "WORK", "work", "Work" all return the same results
- **Real-time filtering**: Combined with other filters and pagination

Example:
```http
GET /tasks?search=project&status=pending&page=1&pageSize=5
```

## 🗃️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `isGuest` - Boolean flag for guest users
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Tasks Table
- `id` - Primary key
- `title` - Task title
- `description` - Task description
- `status` - Task status (pending, in_progress, completed)
- `user_id` - Foreign key to users table
- `active` - Soft delete flag
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Protection**: TypeORM parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Error Handling**: No sensitive information in error responses

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── decorators/      # Custom decorators
│   ├── dto/            # Data transfer objects
│   ├── guards/         # JWT guards
│   └── types/          # Type definitions
├── common/              # Shared utilities
│   ├── dto/            # Common DTOs
│   ├── filters/        # Exception filters
│   ├── helpers/        # Helper functions
│   └── interceptors/   # Response interceptors
├── config/              # Configuration files
├── database/            # Database module
├── tasks/               # Tasks module
│   ├── dto/            # Task DTOs
│   ├── entities/       # Task entity
│   ├── enums/          # Task enums
│   └── guards/         # Task-specific guards
└── users/               # Users module
    ├── dto/            # User DTOs
    └── entities/       # User entity
```

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure production database
3. Build the application
4. Start with PM2 or similar process manager

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nelson** - [@nelsin-06](https://github.com/nelsin-06)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) for the amazing framework
- [TypeORM](https://typeorm.io/) for the excellent ORM
- [PostgreSQL](https://www.postgresql.org/) for the reliable database
