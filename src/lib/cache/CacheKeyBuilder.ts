export class CacheKeyBuilder {
  static menu(restaurantId: string): string {
    return `MENU:${restaurantId}`;
  }

  static activePromotions(restaurantId: string): string {
    return `PROMOTIONS:ACTIVE:${restaurantId}`;
  }

  static analyticsData(restaurantId: string): string {
    return `ANALYTICS:${restaurantId}`;
  }

  static cart(cartId: string): string {
    return `CART:${cartId}`;
  }
}
