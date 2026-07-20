export interface TaxProvider {
  /**
   * Calculates taxes based on the provided subtotal and restaurant context.
   * Extensible for future integrations like external tax APIs or localized rules.
   */
  calculateTax(restaurantId: string, taxableSubtotal: number): Promise<number>;
}

export class StandardTaxProvider implements TaxProvider {
  /**
   * Default implementation for testing and MVP.
   * Assumes a flat 10% tax rate across the board.
   */
  async calculateTax(restaurantId: string, taxableSubtotal: number): Promise<number> {
    const taxRate = 0.10; // 10% flat rate
    return Number((taxableSubtotal * taxRate).toFixed(2));
  }
}
