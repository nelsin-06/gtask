# Search Functionality for Tasks

## Overview

The task API now includes search functionality that allows users to filter tasks by title using a partial match.

## Usage

### Query Parameter

- **Parameter**: `search`
- **Type**: `string` (optional)
- **Description**: Search term to filter tasks by title
- **Example**: `homework`

### How it works

The search functionality uses a case-insensitive `ILike` query with wildcard matching (`%search%`), which means:

- It will match tasks that contain the search term anywhere in the title
- The search is **completely case-insensitive** (using PostgreSQL's `ILike` operator)
- Partial matches are supported
- Works regardless of whether the search term or title is in uppercase, lowercase, or mixed case

### Examples

1. **Search for tasks containing "homework"**:
   ```
   GET /tasks?search=homework&page=1&pageSize=10
   ```

2. **Case-insensitive search examples**:
   ```bash
   # These all return the same results:
   GET /tasks?search=HOMEWORK    # Matches "homework", "Homework", "HOMEWORK"
   GET /tasks?search=homework    # Matches "HOMEWORK", "Homework", "homework"  
   GET /tasks?search=HoMeWoRk    # Matches "homework", "HOMEWORK", "Homework"
   ```

3. **Combined with other filters**:
   ```
   GET /tasks?search=study&status=pending&sortField=created_at&sortOrder=desc&page=1&pageSize=5
   ```

4. **Search with pagination**:
   ```
   GET /tasks?search=project&page=2&pageSize=20
   ```

### Search Behavior

- **Empty/undefined search**: Returns all tasks (respecting other filters)
- **Partial matches**: "home" will match "homework", "home project", "at home"
- **Case insensitive**: "WORK" will match "work", "Work", "WoRk", "WORK" - completely insensitive to case
- **Title case insensitive**: Works regardless of how the task title is stored (uppercase, lowercase, mixed)
- **Multiple words**: Currently searches the exact phrase. For "home work", it will only match titles containing that exact phrase (case-insensitive)

### API Response

The response format remains the same as the standard paginated response:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Complete homework assignment",
      "description": "Math homework for chapter 5",
      "status": "pending",
      "created_at": "2025-08-15T14:30:00.000Z",
      "updated_at": "2025-08-15T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Swagger Documentation

The search parameter is fully documented in the Swagger UI at `/api-docs` with:
- Parameter description
- Example values
- Optional validation rules

### Performance Considerations

- The search uses database-level `LIKE` queries
- For better performance on large datasets, consider implementing full-text search
- The search is applied along with other filters (status, pagination) in a single query

### Security

- The search parameter is validated as a string
- SQL injection is prevented through TypeORM's query builder
- The search only applies to the task title field

## Future Enhancements

Potential improvements could include:
- Search across multiple fields (title + description)
- Full-text search capabilities
- Search result highlighting
- Search suggestions/autocomplete
