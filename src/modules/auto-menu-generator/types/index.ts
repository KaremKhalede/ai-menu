export type Step = 'input' | 'preview' | 'success';

export interface CuisineOption {
  value: string;
  label: string;
}

export interface PriceRangeOption {
  value: 'budget' | 'medium' | 'premium' | 'luxury';
  label: string;
  range: string;
  icon: string;
}
