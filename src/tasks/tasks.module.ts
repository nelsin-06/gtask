import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './task.repository';
import { Task } from './entities/task.entity';
import { TaskExistsGuard } from './guards';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, TaskRepository, TaskExistsGuard],
  controllers: [TasksController],
})
export class TasksModule {}
