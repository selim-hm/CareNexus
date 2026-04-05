import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../pages/Auth/stores/authSlice';

/**
 * AuthInitializer
 * Mounted once at the root of the app.
 * Restores user session from localStorage after a page reload.
 * Without this, the Redux store is empty on refresh even though
 * auth-token and auth-user are saved in localStorage.
 */
const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only hydrate if Redux store is empty (page reload scenario)
    if (!user && !token) {
      const savedToken = localStorage.getItem('auth-token');
      const savedUserRaw = localStorage.getItem('auth-user');

      if (savedToken && savedUserRaw) {
        try {
          const savedUser = JSON.parse(savedUserRaw);
          dispatch(setUser({ user: savedUser, token: savedToken }));
        } catch {
          // Corrupted data — clear it
          localStorage.removeItem('auth-user');
          localStorage.removeItem('auth-token');
          localStorage.removeItem('refresh-token');
        }
      }
    }
  }, []);  // Run only once on mount

  return null; // Renders nothing — purely for side effects
};

export default AuthInitializer;
