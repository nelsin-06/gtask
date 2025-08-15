import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import {
  CreateTaskDto,
  UpdateTaskDto,
  GetTasksQueryDto,
  PaginatedResponse,
} from './dto';
import { TaskExistsGuard } from './guards';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Create a new task for the authenticated user (including guests)',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async create(@Body() createTaskDto: CreateTaskDto, @UserId() userId: number) {
    // Allow both regular users and guests to create tasks
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Retrieve all tasks for the authenticated user with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Page size (default: 10)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['created_at', 'updated_at', 'due_date'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Task' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 10 },
            totalItems: { type: 'number', example: 50 },
            totalPages: { type: 'number', example: 5 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  findAll(
    @UserId() userId: number,
    @Query() query: GetTasksQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    return this.tasksService.findWithPaginationByUserId(query, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieve a specific task by ID',
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({ status: 200, description: 'Task found', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @UseGuards(TaskExistsGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ): Promise<Task | null> {
    return this.tasksService.findByIdAndUserId(id, userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update task',
    description: 'Update an existing task',
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @UseGuards(TaskExistsGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserId() userId: number,
  ): Promise<Task | null> {
    return this.tasksService.updateByUserIdAndTaskId(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task',
    description: 'Delete a specific task by ID',
  })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @UseGuards(TaskExistsGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ): Promise<void> {
    return this.tasksService.deleteByUserIdAndTaskId(id, userId);
  }
}
