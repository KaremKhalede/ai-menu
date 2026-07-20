import { CacheManager } from "@/lib/cache/CacheManager";
import { CacheKeyBuilder } from "@/lib/cache/CacheKeyBuilder";

export interface CartItem {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  tenantId: string;
  customerId?: string;
  items: CartItem[];
  total: number;
}

export class CartService {
  /**
   * Retrieves the active cart from Cache (Redis). 
   * A cart is uniquely identified by cartId (which could map 1:1 to an AiSession or a Web User session).
   */
  public static async getCart(cartId: string, tenantId: string, customerId?: string): Promise<Cart> {
    const key = CacheKeyBuilder.cart(cartId);
    let cart = await CacheManager.get<Cart>(key);
    
    if (!cart) {
      cart = {
        id: cartId,
        tenantId,
        customerId,
        items: [],
        total: 0
      };
      await CacheManager.set(key, cart, 86400); // 24 hour TTL
    }
    
    return cart;
  }

  public static async saveCart(cart: Cart): Promise<void> {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    await CacheManager.set(CacheKeyBuilder.cart(cart.id), cart, 86400);
  }

  public static async addItem(cartId: string, tenantId: string, item: CartItem, customerId?: string): Promise<Cart> {
    const cart = await this.getCart(cartId, tenantId, customerId);
    
    const existingItem = cart.items.find(i => i.dishId === item.dishId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    
    await this.saveCart(cart);
    return cart;
  }

  public static async clearCart(cartId: string): Promise<void> {
    await CacheManager.delete(CacheKeyBuilder.cart(cartId));
  }
}
