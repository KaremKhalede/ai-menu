import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Category, Dish, Addon } from "@/lib/types";

function safeParseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function transformDish(dish: {
  id: string;
  name: string;
  nameEn: string | null;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  rating: number;
  orderCount: number;
  tags: string;
  isAvailable: boolean;
  isFeatured: boolean;
  addons: string;
  pairings: string;
}): Dish {
  return {
    id: dish.id,
    name: dish.name,
    nameEn: dish.nameEn ?? undefined,
    description: dish.description,
    price: dish.price,
    image: dish.image ?? undefined,
    categoryId: dish.categoryId,
    rating: dish.rating,
    orderCount: dish.orderCount,
    tags: safeParseJSON<string[]>(dish.tags, []),
    isAvailable: dish.isAvailable,
    isFeatured: dish.isFeatured,
    addons: safeParseJSON<Addon[]>(dish.addons, []),
    pairings: safeParseJSON<string[]>(dish.pairings, []),
  };
}

function transformCategory(category: {
  id: string;
  name: string;
  nameEn: string | null;
  icon: string | null;
  sortOrder: number;
  dishes: ReturnType<typeof transformDish>[];
}): Category {
  return {
    id: category.id,
    name: category.name,
    nameEn: category.nameEn ?? undefined,
    icon: category.icon ?? undefined,
    sortOrder: category.sortOrder,
    dishes: category.dishes,
  };
}

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        dishes: {
          where: { isAvailable: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    const transformedCategories: Category[] = categories.map((category) =>
      transformCategory({
        ...category,
        dishes: category.dishes.map(transformDish),
      })
    );

    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu data" },
      { status: 500 }
    );
  }
}