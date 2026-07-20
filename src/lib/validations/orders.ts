import { z } from "zod";

export const OrderStatusEnum = z.enum([
  "pending", 
  "preparing", 
  "ready", 
  "completed", 
  "cancelled"
]);

export const updateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
});
