# Tasks API Endpoint Specification

## GET /tasks/paginated - Retrieve Tasks with Pagination and Sorting

### Overview
This endpoint retrieves a paginated list of active tasks with optional sorting capabilities. It follows RESTful conventions and provides comprehensive pagination metadata.

### Endpoint Details
- **URL**: `/tasks/paginated`
- **Method**: `GET`
- **Content-Type**: `application/json`
- **Authentication**: Not required (can be added later)

### Query Parameters

| Parameter   | Type       | Required | Default      | Description                                          |
|-------------|------------|----------|--------------|------------------------------------------------------|
| `page`      | integer    | Yes      | N/A          | Page number (must be ≥ 1)                          |
| `pageSize`  | integer    | Yes      | N/A          | Number of items per page (must be ≥ 1)             |
| `sortField` | string     | No       | `created_at` | Field to sort by (see allowed values below)        |
| `sortOrder` | string     | No       | `desc`       | Sort direction: `asc` or `desc` (case-insensitive) |
| `status`    | string[]   | No       | N/A          | Filter by task status(es) - array of enum values   |

### Allowed Sort Fields
- `id` - Task ID
- `title` - Task title
- `status` - Task status (pending, in_progress, completed)
- `priority` - Task priority (1-5)
- `due_date` - Task due date
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Allowed Status Values
- `pending` - Task is pending
- `in_progress` - Task is in progress
- `completed` - Task is completed

**Note**: The `status` parameter accepts an array and can be provided in multiple ways:
- Single value: `status=pending`
- Multiple values: `status=pending&status=in_progress`
- Array format: `status[]=pending&status[]=completed`

### Request Examples

#### Basic pagination (required parameters only)
```
GET /tasks/paginated?page=1&pageSize=10
```

#### With sorting by title (ascending)
```
GET /tasks/paginated?page=1&pageSize=10&sortField=title&sortOrder=asc
```

#### With sorting by priority (descending)
```
GET /tasks/paginated?page=2&pageSize=5&sortField=priority&sortOrder=desc
```

#### With sorting by due date
```
GET /tasks/paginated?page=1&pageSize=20&sortField=due_date&sortOrder=asc
```

#### Filter by single status
```
GET /tasks/paginated?page=1&pageSize=10&status=pending
```

#### Filter by multiple statuses
```
GET /tasks/paginated?page=1&pageSize=10&status=pending&status=in_progress
```

#### Combined filtering and sorting
```
GET /tasks/paginated?page=1&pageSize=10&status=pending&status=completed&sortField=priority&sortOrder=desc
```

### Response Format

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Complete API documentation",
        "description": "Write comprehensive API docs for the tasks endpoint",
        "status": "pending",
        "priority": 2,
        "due_date": "2025-08-20T10:00:00.000Z",
        "active": true,
        "created_at": "2025-08-15T01:00:00.000Z",
        "updated_at": "2025-08-15T01:00:00.000Z"
      },
      {
        "id": 2,
        "title": "Review code changes",
        "description": "Review the pagination implementation",
        "status": "in_progress",
        "priority": 1,
        "due_date": "2025-08-16T15:30:00.000Z",
        "active": true,
        "created_at": "2025-08-15T02:00:00.000Z",
        "updated_at": "2025-08-15T02:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "message": "Tasks retrieved successfully"
}
```

#### Pagination Metadata Explanation
- `page`: Current page number
- `pageSize`: Number of items per page
- `totalItems`: Total number of active tasks
- `totalPages`: Total number of pages available
- `hasNextPage`: Boolean indicating if there's a next page
- `hasPreviousPage`: Boolean indicating if there's a previous page

### Error Responses

#### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Page must be greater than 0",
  "errors": [
    "Page must be greater than 0",
    "Page size must be greater than 0"
  ],
  "timestamp": "2025-08-15T01:23:45.123Z",
  "path": "/tasks/paginated"
}
```

#### Invalid Sort Field (400 Bad Request)
```json
{
  "success": false,
  "message": "Sort field must be one of: id, title, status, priority, due_date, created_at, updated_at",
  "errors": [
    "Sort field must be one of: id, title, status, priority, due_date, created_at, updated_at"
  ],
  "timestamp": "2025-08-15T01:23:45.123Z",
  "path": "/tasks/paginated"
}
```

#### Invalid Sort Order (400 Bad Request)
```json
{
  "success": false,
  "message": "Sort order must be either \"asc\" or \"desc\"",
  "errors": [
    "Sort order must be either \"asc\" or \"desc\""
  ],
  "timestamp": "2025-08-15T01:23:45.123Z",
  "path": "/tasks/paginated"
}
```

#### Invalid Status Value (400 Bad Request)
```json
{
  "success": false,
  "message": "Each status must be one of: pending, in_progress, completed",
  "errors": [
    "Each status must be one of: pending, in_progress, completed"
  ],
  "timestamp": "2025-08-15T01:23:45.123Z",
  "path": "/tasks/paginated"
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": [
    "Internal server error"
  ],
  "timestamp": "2025-08-15T01:23:45.123Z",
  "path": "/tasks/paginated"
}
```

### Implementation Features

#### Soft Delete Support
- Only returns tasks where `active = true`
- Soft-deleted tasks are automatically excluded from results

#### Type Safety
- Full TypeScript support with proper type definitions
- Runtime validation using class-validator decorators
- Automatic type conversion for query parameters

#### Performance Considerations
- Uses database-level pagination (LIMIT/OFFSET)
- Efficient COUNT query for total items
- Indexed sorting on common fields (recommended)

### HTTP Status Codes
- `200 OK` - Successful response with data
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server-side error

### Integration Notes

#### Frontend Integration Example (JavaScript/TypeScript)
```javascript
// Basic request
const response = await fetch('/tasks/paginated?page=1&pageSize=10');
const result = await response.json();

if (result.success) {
  const { data, pagination } = result.data;
  console.log('Tasks:', data);
  console.log('Has more pages:', pagination.hasNextPage);
}

// With sorting
const sortedResponse = await fetch(
  '/tasks/paginated?page=1&pageSize=10&sortField=priority&sortOrder=desc'
);
```

#### curl Examples
```bash
# Basic pagination
curl "http://localhost:8080/tasks/paginated?page=1&pageSize=10"

# With sorting
curl "http://localhost:8080/tasks/paginated?page=1&pageSize=10&sortField=title&sortOrder=asc"

# Filter by single status
curl "http://localhost:8080/tasks/paginated?page=1&pageSize=10&status=pending"

# Filter by multiple statuses
curl "http://localhost:8080/tasks/paginated?page=1&pageSize=10&status=pending&status=in_progress"

# Combined filtering and sorting
curl "http://localhost:8080/tasks/paginated?page=1&pageSize=10&status=completed&sortField=priority&sortOrder=desc"

# Large page size with filtering
curl "http://localhost:8080/tasks/paginated?page=1&pageSize=50&status=pending&status=in_progress&sortField=due_date&sortOrder=asc"
```

### Validation Rules Summary
1. **page**: Must be a positive integer (≥ 1)
2. **pageSize**: Must be a positive integer (≥ 1)
3. **sortField**: Must be one of the allowed enum values
4. **sortOrder**: Must be either "asc" or "desc" (case-insensitive)
5. **status**: Must be an array of valid TaskStatusEnum values (`pending`, `in_progress`, `completed`)

### Related Endpoints
- `GET /tasks` - Get all tasks (without pagination)
- `GET /tasks/:id` - Get single task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Soft delete task

---

**Last Updated**: August 15, 2025  
**API Version**: 1.0  
**Ready for Developer Handoff**: ✅
