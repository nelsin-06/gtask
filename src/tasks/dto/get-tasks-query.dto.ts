import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsEnum,
} from 'class-validator';

export enum TaskSortFields {
  ID = 'id',
  TITLE = 'title',
  STATUS = 'status',
  PRIORITY = 'priority',
  DUE_DATE = 'due_date',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

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
