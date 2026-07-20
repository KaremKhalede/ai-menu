'use client';

import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantityControlsProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function QuantityControls({ quantity, onDecrease, onIncrease }: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onDecrease}
        className="h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-white/10 text-foreground cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </Button>
      <span className="w-8 text-center text-sm font-bold text-foreground">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onIncrease}
        className="h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-white/10 text-foreground cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
