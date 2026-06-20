import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from './useAuth';
import { notify } from '../utils/notifications';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await authService.login(email, password);
      const { token, admin } = res.data.data!;
      login(token, admin);
      notify.success(`Welcome back, ${admin.username}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed';
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};
