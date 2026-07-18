import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface OrderItemInput {
  dishId: string;
  quantity: number;
  addons: { name: string; price: number }[];
  price: number;
}

interface OrderInput {
  items: OrderItemInput[];
  total: number;
  tableNumber?: number;
  customerName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderInput = await request.json();

    const { items, total, tableNumber, customerName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 }
      );
    }

    // Get the first (or only) restaurant
    const restaurant = await db.restaurant.findFirst({
      select: { id: true },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "No restaurant configured" },
        { status: 400 }
      );
    }

    // Validate all dish IDs exist
    const dishIds = items.map((item) => item.dishId);
    const existingDishes = await db.dish.findMany({
      where: { id: { in: dishIds } },
      select: { id: true },
    });

    const existingDishIds = new Set(existingDishes.map((d) => d.id));
    const missingDishIds = dishIds.filter((id) => !existingDishIds.has(id));
    if (missingDishIds.length > 0) {
      return NextResponse.json(
        { error: `Invalid dish IDs: ${missingDishIds.join(", ")}` },
        { status: 400 }
      );
    }

    // Create the order with items in a transaction
    const order = await db.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          restaurantId: restaurant.id,
          total,
          tableNumber: tableNumber ?? null,
          customerName: customerName ?? null,
          status: "pending",
          items: {
            create: items.map((item) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.price,
              addons: JSON.stringify(item.addons ?? []),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update orderCount for each dish
      for (const item of items) {
        await tx.dish.update({
          where: { id: item.dishId },
          data: { orderCount: { increment: item.quantity } },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}