import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto, PaginatedResponse } from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const taskData: Partial<Task> = {
      ...createTaskDto,
      due_date: createTaskDto.due_date
        ? new Date(createTaskDto.due_date)
        : undefined,
      user: user,
    };
    return await this.taskRepository.create(taskData);
  }

  async createForUser(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<Task> {
    const taskData: Partial<Task> = {
      ...createTaskDto,
      due_date: createTaskDto.due_date
        ? new Date(createTaskDto.due_date)
        : undefined,
      user: { id: userId } as User,
    };
    return await this.taskRepository.create(taskData);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async findByUserId(userId: number): Promise<Task[]> {
    return await this.taskRepository.findAllByUser(userId);
  }

  async findAllByUser(userId: number): Promise<Task[]> {
    return await this.taskRepository.findAllByUser(userId);
  }

  async findWithPagination(
    query: GetTasksQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    return await this.taskRepository.findWithPagination(query);
  }

  async findWithPaginationByUserId(
    query: GetTasksQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<Task>> {
    return await this.taskRepository.findWithPaginationByUser(query, userId);
  }

  async findWithPaginationByUser(
    query: GetTasksQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<Task>> {
    return await this.taskRepository.findWithPaginationByUser(query, userId);
  }

  async findById(id: number): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Task | null> {
    return await this.taskRepository.findByIdAndUserId(id, userId);
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

  async updateByUserIdAndTaskId(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task | null> {
    const taskData: Partial<Task> = {
      ...updateTaskDto,
      due_date: updateTaskDto.due_date
        ? new Date(updateTaskDto.due_date)
        : undefined,
    };
    return await this.taskRepository.updateByUserIdAndTaskId(
      id,
      taskData,
      userId,
    );
  }

  async delete(id: number): Promise<void> {
    return await this.taskRepository.delete(id);
  }

  async deleteByUserIdAndTaskId(id: number, userId: number): Promise<void> {
    return await this.taskRepository.deleteByUserIdAndTaskId(id, userId);
  }
}
