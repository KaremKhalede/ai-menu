export enum LoyaltyTransactionType {
  POINTS_EARNED = "POINTS_EARNED",
  POINTS_REDEEMED = "POINTS_REDEEMED",
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT",
  BONUS = "BONUS",
  REFUND = "REFUND",
}

export enum RewardType {
  FREE_ITEM = "FREE_ITEM",
  PERCENT_DISCOUNT = "PERCENT_DISCOUNT",
  FIXED_DISCOUNT = "FIXED_DISCOUNT",
  FREE_DELIVERY = "FREE_DELIVERY",
  CUSTOM = "CUSTOM",
}

export enum RedemptionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REVERSED = "REVERSED",
}

/**
 * Calculates the number of loyalty points earned for a given order total.
 * 
 * Strategy: Currently 1 currency unit = 1 point.
 * This function isolates the earning rule so it can easily be configured or extended in the future.
 */
export function calculateEarnedPoints(orderTotal: number): number {
  if (orderTotal <= 0) return 0;
  return Math.floor(orderTotal);
}
