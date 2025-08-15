# Task Exists Guard Documentation

## Overview
The `TaskExistsGuard` is a custom NestJS guard that ensures a task exists before allowing operations that require a valid `taskId` parameter.

## Features
- **Automatic Validation**: Checks if a task exists before executing the route handler
- **Clean Error Responses**: Returns standardized 404 errors for non-existent tasks
- **ID Validation**: Validates that the provided ID is a valid integer
- **Reusable**: Can be applied to any endpoint that uses `:id` parameter for tasks

## Implementation

### Guard Class
```typescript
@Injectable()
export class TaskExistsGuard implements CanActivate {
  constructor(private readonly taskRepository: TaskRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const taskId = parseInt(request.params.id, 10);

    if (!taskId || isNaN(taskId)) {
      throw new NotFoundException('Invalid task ID provided');
    }

    const exists = await this.taskRepository.exists(taskId);
    if (!exists) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return true;
  }
}
```

### Applied to Endpoints
The guard is applied to the following endpoints that require task existence validation:

1. **GET /tasks/:id** - Get single task
2. **PUT /tasks/:id** - Update task
3. **DELETE /tasks/:id** - Delete task (soft delete)

### Controller Usage
```typescript
@Get(':id')
@UseGuards(TaskExistsGuard)
findById(@Param('id', ParseIntPipe) id: number): Promise<Task | null> {
  return this.tasksService.findById(id);
}

@Put(':id')
@UseGuards(TaskExistsGuard)
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateTaskDto: UpdateTaskDto,
): Promise<Task | null> {
  return this.tasksService.update(id, updateTaskDto);
}

@Delete(':id')
@UseGuards(TaskExistsGuard)
delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
  return this.tasksService.delete(id);
}
```

## Error Responses

### Non-existent Task (404 Not Found)
```json
{
  "success": false,
  "message": "Task with ID 999 not found",
  "errors": ["Task with ID 999 not found"],
  "timestamp": "2025-08-15T07:22:22.986Z",
  "path": "/tasks/999",
  "method": "GET"
}
```

### Invalid Task ID (404 Not Found)
```json
{
  "success": false,
  "message": "Invalid task ID provided",
  "errors": ["Invalid task ID provided"],
  "timestamp": "2025-08-15T07:22:50.903Z",
  "path": "/tasks/invalid",
  "method": "GET"
}
```

## Benefits

1. **Consistency**: All endpoints that require task existence validation use the same logic
2. **Early Validation**: Prevents unnecessary service/repository calls for non-existent tasks
3. **Clean Code**: Removes the need for null checks in service methods
4. **Standardized Errors**: Provides consistent error responses across all protected endpoints
5. **Performance**: Efficient database query using COUNT instead of full entity retrieval
6. **Soft Delete Aware**: Only considers active tasks (respects the soft delete implementation)

## Testing

The guard has been tested with:
- ✅ Valid existing task IDs
- ✅ Non-existent task IDs  
- ✅ Invalid ID formats (non-numeric)
- ✅ All HTTP methods (GET, PUT, DELETE)
- ✅ Proper error response formatting
- ✅ Normal operation flow when task exists

## Integration Notes

- The guard is automatically registered in the `TasksModule` providers
- It uses the existing `TaskRepository.exists()` method
- Works seamlessly with the global exception filter and response interceptor
- Respects the soft delete implementation (only validates active tasks)
