import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should handle successful async operation', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(asyncFn, []));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('should handle async operation errors', async () => {
    const error = new Error('Test error');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFn, []));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
  });

  it('should re-execute when dependencies change', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result, rerender } = renderHook(
      ({ dep }) => useAsync(asyncFn, [dep]),
      { initialProps: { dep: 1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(asyncFn).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });

    await waitFor(() => {
      expect(asyncFn).toHaveBeenCalledTimes(2);
    });
  });
});
