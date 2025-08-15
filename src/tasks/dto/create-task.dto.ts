import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsDateString,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatusEnum } from '../enums';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Create comprehensive documentation for the API endpoints',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatusEnum,
    example: TaskStatusEnum.PENDING,
    default: TaskStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatusEnum, {
    message: 'Status must be one of: pending, in_progress, completed',
  })
  status?: TaskStatusEnum;

  @ApiPropertyOptional({
    description: 'Task priority (1: Low, 2: Medium, 3: High)',
    example: 2,
    minimum: 1,
    maximum: 3,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Priority must be between 1 and 3' })
  @Max(3, { message: 'Priority must be between 1 and 3' })
  priority?: number;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2024-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  due_date?: string;
}
