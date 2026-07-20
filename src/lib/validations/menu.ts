import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  nameEn: z.string().max(100).optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createDishSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  nameEn: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().default(""),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().url().optional().nullable(),
  categoryId: z.string().min(1, "Category ID is required"),
  rating: z.number().min(0).max(5).optional().default(4.5),
  orderCount: z.number().int().min(0).optional().default(0),
  tags: z.string().optional().default("[]"),
  isAvailable: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  addons: z.string().optional().default("[]"),
  pairings: z.string().optional().default("[]"),
});

export const updateDishSchema = createDishSchema.partial();
