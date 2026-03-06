import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComparisonRow } from './ComparisonRow';

function renderRow(thisValue: number, avgValue: number): void {
  render(<ComparisonRow label="Score" thisValue={thisValue} avgValue={avgValue} />);
}

describe('ComparisonRow', () => {
  it('renders the label', () => {
    renderRow(80, 70);
    expect(screen.getByText('Score')).toBeDefined();
  });

  it('renders thisValue', () => {
    renderRow(87, 72);
    expect(screen.getByText('87')).toBeDefined();
  });

  it('renders avgValue formatted to one decimal', () => {
    renderRow(87, 72.333);
    expect(screen.getByText('72.3')).toBeDefined();
  });

  it('shows above-average indicator when thisValue >= avgValue', () => {
    renderRow(90, 72);
    expect(screen.getByText(/above/i)).toBeDefined();
  });

  it('shows below-average indicator when thisValue < avgValue', () => {
    renderRow(60, 72);
    expect(screen.getByText(/below/i)).toBeDefined();
  });
});
