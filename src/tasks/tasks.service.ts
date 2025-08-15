import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto, PaginatedResponse } from './dto';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: Partial<Task> = {
      ...createTaskDto,
      due_date: createTaskDto.due_date
        ? new Date(createTaskDto.due_date)
        : undefined,
    };
    return await this.taskRepository.create(taskData);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async findWithPagination(
    query: GetTasksQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    return await this.taskRepository.findWithPagination(query);
  }

  async findById(id: number): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const taskData: Partial<Task> = {
      ...updateTaskDto,
      due_date: updateTaskDto.due_date
        ? new Date(updateTaskDto.due_date)
        : undefined,
    };
    return await this.taskRepository.update(id, taskData);
  }

  async delete(id: number): Promise<void> {
    return await this.taskRepository.delete(id);
  }
}
