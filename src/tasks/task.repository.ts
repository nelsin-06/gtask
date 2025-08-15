import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(data);
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { active: true },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id, active: true },
    });
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const result: UpdateResult = await this.taskRepository.update(id, data);

    if (result.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.update(id, { active: false });
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
}
