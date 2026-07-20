import { NextResponse } from 'next/server';
import { ApiError } from './errors';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: any;
}

export const apiSuccess = <T>(data: T, meta?: any, status = 200) => {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status }
  );
};

export const apiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  console.error('[Unhandled API Error]', error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'حدث خطأ داخلي في الخادم',
      },
    },
    { status: 500 }
  );
};
