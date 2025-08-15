import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, In, ILike } from 'typeorm';
import { Task } from './entities/task.entity';
import { GetTasksQueryDto, PaginatedResponse } from './dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(data);
    const savedTask = await this.taskRepository.save(task);

    // Return task without user relation to avoid exposing sensitive data
    const result = await this.taskRepository.findOne({
      where: { id: savedTask.id },
    });

    return result!; // We know it exists since we just created it
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { active: true },
      relations: ['user'],
    });
  }

  async findAllByUser(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { active: true, user: { id: userId } },
      // Remove relations to avoid exposing user data
    });
  }

  async findById(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id, active: true },
      // Remove relations to avoid exposing user data
    });
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id, active: true, user: { id: userId } },
      // Remove relations to avoid exposing user data
    });
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const result: UpdateResult = await this.taskRepository.update(id, data);

    if (result.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async updateByUserIdAndTaskId(
    id: number,
    data: Partial<Task>,
    userId: number,
  ): Promise<Task | null> {
    const result: UpdateResult = await this.taskRepository.update(
      { id, user: { id: userId }, active: true },
      data,
    );

    if (result.affected === 0) {
      return null;
    }

    return await this.findByIdAndUserId(id, userId);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.update(id, { active: false });
  }

  async deleteByUserIdAndTaskId(id: number, userId: number): Promise<void> {
    await this.taskRepository.update(
      { id, user: { id: userId }, active: true },
      { active: false },
    );
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.taskRepository.count({
      where: { id, active: true },
    });
    return count > 0;
  }

  async restore(id: number): Promise<void> {
    await this.taskRepository.update(id, { active: true });
  }

  async findDeleted(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { active: false },
    });
  }

  async findWithPagination(
    query: GetTasksQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    const { page, pageSize, sortField, sortOrder, status, search } = query;
    const skip = (page - 1) * pageSize;

    // Create order object with proper typing
    const orderField = sortField || 'created_at';
    const orderDirection = (sortOrder || 'desc').toUpperCase() as
      | 'ASC'
      | 'DESC';
    const order: Record<string, 'ASC' | 'DESC'> = {};
    order[orderField] = orderDirection;

    // Build where clause with status filtering and search
    const whereClause: Record<string, any> = { active: true };
    if (status && status.length > 0) {
      whereClause.status = In(status);
    }
    if (search) {
      whereClause.title = ILike(`%${search}%`);
    }

    const [data, totalItems] = await this.taskRepository.findAndCount({
      where: whereClause,
      order,
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findWithPaginationByUser(
    query: GetTasksQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<Task>> {
    const { page, pageSize, sortField, sortOrder, status, search } = query;
    const skip = (page - 1) * pageSize;

    // Create order object with proper typing
    const orderField = sortField || 'created_at';
    const orderDirection = (sortOrder || 'desc').toUpperCase() as
      | 'ASC'
      | 'DESC';
    const order: Record<string, 'ASC' | 'DESC'> = {};
    order[orderField] = orderDirection;

    // Build where clause with status filtering, user filtering, and search
    const whereClause: Record<string, any> = {
      active: true,
      user: { id: userId },
    };
    if (status && status.length > 0) {
      whereClause.status = In(status);
    }
    if (search) {
      whereClause.title = ILike(`%${search}%`);
    }

    const [data, totalItems] = await this.taskRepository.findAndCount({
      where: whereClause,
      order,
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
