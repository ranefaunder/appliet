export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
  status: number;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message?: string;
    details?: unknown;
  };
  status: number;
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;
