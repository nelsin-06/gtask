import { TaskStatusEnum } from '../enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @ApiProperty({
    description: 'Task unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    maxLength: 100,
  })
  @Column({ length: 100 })
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Create comprehensive documentation for the API endpoints',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatusEnum,
    example: TaskStatusEnum.PENDING,
  })
  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.PENDING,
  })
  status: TaskStatusEnum;

  @ApiProperty({
    description: 'Task priority (1: Low, 2: Medium, 3: High)',
    example: 2,
    minimum: 1,
    maximum: 3,
  })
  @Column({ type: 'smallint', default: 3 })
  priority: number;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @ApiProperty({
    description: 'Whether the task is active',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ApiProperty({
    description: 'Task creation timestamp',
    example: '2024-08-15T08:30:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Task last update timestamp',
    example: '2024-08-15T10:30:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
