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

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('paginated')
  findWithPagination(
    @Query() query: GetTasksQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    return this.tasksService.findWithPagination(query);
  }

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
}
