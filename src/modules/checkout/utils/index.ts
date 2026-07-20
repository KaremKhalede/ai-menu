export function formatPrice(price: number): string {
  return price.toLocaleString('ar-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
