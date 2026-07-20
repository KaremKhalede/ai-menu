export type Step = 1 | 2 | 3;

export interface OrderItemPayload {
  dishId: string;
  dishName: string;
  quantity: number;
  addons: { name: string; price: number }[];
  price: number;
}

export interface OrderPayload {
  customerName?: string;
  tableNumber?: number;
  total: number;
  items: OrderItemPayload[];
}
