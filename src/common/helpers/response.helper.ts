import { ApiResponse } from '../dto/api-response.dto';

export class ResponseHelper {
  static success<T>(
    data: T,
    message = 'Success',
    path = '',
    method = '',
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static error(
    message: string,
    errors?: string[],
    path = '',
    method = '',
  ): ApiResponse {
    return {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    path = '',
    method = '',
  ): ApiResponse<{ items: T[]; pagination: any }> {
    return {
      success: true,
      message: 'Data retrieved successfully',
      data: {
        items: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }
}
