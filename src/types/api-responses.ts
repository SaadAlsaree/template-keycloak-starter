export enum ErrorType {
  Failure = 0,
  Validation = 1,
  Problem = 2,
  NotFound = 3,
  Conflict = 4
}

export interface ApiError {
  code: string;
  description: string;
  type: ErrorType;
}

export interface ValidationErrorDetail {
  code: string;
  description: string;
}

export interface ApiResponse<T = unknown> {
  succeeded: boolean;
  data?: T | null;
  message: string;
  code: string;
  errors: ValidationErrorDetail[];
}

export interface ApiResult<TValue = unknown> {
  isSuccess: boolean;
  isFailure: boolean;
  error: ApiError;
  value?: TValue;
}

export interface PagedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface MessageResponse {
  message: string;
  code: string;
}

export interface FileResponse {
  // Can be blob, arraybuffer, or base64 string depending on fetch setup
  stream: File | Blob | string | any;
  contentType: string;
}
