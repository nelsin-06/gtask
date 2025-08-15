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

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @UserId() userId: number) {
    // Allow both regular users and guests to create tasks
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(
    @UserId() userId: number,
    @Query() query: GetTasksQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    return this.tasksService.findWithPaginationByUserId(query, userId);
  }

  @Get(':id')
  @UseGuards(TaskExistsGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ): Promise<Task | null> {
    return this.tasksService.findByIdAndUserId(id, userId);
  }

  @Put(':id')
  @UseGuards(TaskExistsGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserId() userId: number,
  ): Promise<Task | null> {
    return this.tasksService.updateByUserIdAndTaskId(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @UseGuards(TaskExistsGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ): Promise<void> {
    return this.tasksService.deleteByUserIdAndTaskId(id, userId);
  }
}
