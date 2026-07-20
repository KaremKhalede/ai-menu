import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QuantityControls } from '@/modules/smart-cart/components/QuantityControls';

describe('QuantityControls integration component', () => {
  it('should render quantity value and respond to minus/plus click events', () => {
    const handleDecrease = vi.fn();
    const handleIncrease = vi.fn();

    render(
      <QuantityControls
        quantity={3}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />
    );

    // Assert quantity is visible
    expect(screen.getByText('3')).toBeInTheDocument();

    // Click decrease
    const buttons = screen.getAllByRole('button');
    // First button is Minus, second is Plus
    fireEvent.click(buttons[0]);
    expect(handleDecrease).toHaveBeenCalledTimes(1);

    // Click increase
    fireEvent.click(buttons[1]);
    expect(handleIncrease).toHaveBeenCalledTimes(1);
  });
});
