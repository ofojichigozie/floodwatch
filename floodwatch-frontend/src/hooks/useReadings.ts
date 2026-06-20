import { useState, useEffect, useCallback } from 'react';
import { Reading } from '../types';
import { readingService } from '../services/api';
import { notify } from '../utils/notifications';

export const useReadings = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await readingService.getAll();
      setReadings(res.data.data ?? []);
    } catch {
      setError('Failed to fetch readings');
      notify.error('Failed to fetch readings');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReading = useCallback(async (id: string) => {
    try {
      await readingService.delete(id);
      setReadings((prev) => prev.filter((r) => r._id !== id));
      notify.success('Reading deleted');
    } catch {
      notify.error('Failed to delete reading');
    }
  }, []);

  const addReading = useCallback((reading: Reading) => {
    setReadings((prev) => [reading, ...prev]);
  }, []);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return { readings, loading, error, deleteReading, addReading, refetch: fetchReadings };
};
