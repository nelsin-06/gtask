import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './task.repository';
import { Task } from './entities/task.entity';
import { TaskExistsGuard } from './guards';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule, UsersModule],
  providers: [TasksService, TaskRepository, TaskExistsGuard],
  controllers: [TasksController],
})
export class TasksModule {}
