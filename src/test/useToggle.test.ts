// src/test/useToggle.test.ts
// Test 2 (Hook): useToggle starts at the given initial value and flips on each call.
// This is a pure logic test — no rendering needed, just renderHook.

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../hooks/useToggle';

describe('useToggle', () => {
  it('starts at false by default', () => {
    const { result } = renderHook(() => useToggle());

    const [value] = result.current;
    expect(value).toBe(false);
  });

  it('starts at true when initialValue is true', () => {
    const { result } = renderHook(() => useToggle(true));

    const [value] = result.current;
    expect(value).toBe(true);
  });

  it('flips from false to true when toggle is called', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    const [value] = result.current;
    expect(value).toBe(true);
  });

  it('flips back to false on a second call', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });
    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    const [value] = result.current;
    expect(value).toBe(false);
  });
});
