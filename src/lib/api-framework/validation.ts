import { z } from 'zod';
import { ValidationError } from './errors';

export const validateBody = async <T>(req: Request, schema: z.ZodSchema<T>): Promise<T> => {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      throw new ValidationError('بيانات الطلب غير صالحة', result.error.flatten().fieldErrors);
    }
    
    return result.data;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError('تنسيق JSON غير صالح');
  }
};

export const validateQuery = <T>(req: Request, schema: z.ZodSchema<T>): T => {
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  
  const result = schema.safeParse(searchParams);
  
  if (!result.success) {
    throw new ValidationError('محددات البحث غير صالحة', result.error.flatten().fieldErrors);
  }
  
  return result.data;
};
