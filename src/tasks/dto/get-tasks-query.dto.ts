import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsEnum,
} from 'class-validator';

import { TaskSortFields, SortOrder } from '../enums';

export class GetTasksQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be greater than 0' })
  page: number;

  @Type(() => Number)
  @IsInt({ message: 'Page size must be an integer' })
  @Min(1, { message: 'Page size must be greater than 0' })
  pageSize: number;

  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  @IsEnum(TaskSortFields, {
    message: `Sort field must be one of: ${Object.values(TaskSortFields).join(', ')}`,
  })
  sortField?: TaskSortFields = TaskSortFields.CREATED_AT;

  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  @IsIn([SortOrder.ASC, SortOrder.DESC], {
    message: 'Sort order must be either "asc" or "desc"',
  })
  @Transform(({ value }): string => {
    if (typeof value === 'string') {
      return value.toLowerCase() as SortOrder;
    }
    return value as string;
  })
  sortOrder?: SortOrder = SortOrder.DESC;
}
