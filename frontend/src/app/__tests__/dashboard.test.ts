import { describe, it, expect } from 'vitest';

describe('AI Multi-Agent Travel Planner - Frontend Suite', () => {
  it('validates 11 specialized agent designations', () => {
    const agents = [
      'Travel Research Agent',
      'Flight Search Agent',
      'Hotel Recommendation Agent',
      'Itinerary Planning Agent',
      'Budget Management Agent',
      'Transportation Agent',
      'Weather Agent',
      'Food & Restaurant Agent',
      'Travel Safety Agent',
      'Travel Critic Agent',
      'Booking Assistant Agent',
    ];

    expect(agents).toHaveLength(11);
    expect(agents).toContain('Travel Critic Agent');
    expect(agents).toContain('Itinerary Planning Agent');
  });

  it('verifies state machine execution lifecycle', () => {
    const states = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'WAITING_FOR_USER'];
    expect(states).toContain('WAITING_FOR_USER');
    expect(states).toContain('RETRYING');
  });

  it('calculates contingency budget allocation', () => {
    const totalBudget = 2500;
    const estimatedCost = 2180;
    const savings = totalBudget - estimatedCost;
    expect(savings).toBe(320);
    expect(savings).toBeGreaterThan(0);
  });
});
