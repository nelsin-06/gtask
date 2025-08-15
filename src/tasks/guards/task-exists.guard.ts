import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { TaskRepository } from '../task.repository';

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
