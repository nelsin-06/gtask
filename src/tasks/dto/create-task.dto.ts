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
import { TaskStatusEnum } from '../enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatusEnum, {
    message: 'Status must be one of: pending, in_progress, completed',
  })
  status?: TaskStatusEnum;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Priority must be between 1 and 3' })
  @Max(3, { message: 'Priority must be between 1 and 3' })
  priority?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  due_date?: string;
}
