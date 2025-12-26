import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand'

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      // Simulate an API call to fetch user data
      const user = await getCurrentUser()
      
      if (user) set({ user: user as unknown as User, isAuthenticated: true });
      else set({ user: null, isAuthenticated: false });
    } catch (error) {
        
      set({ user: null, isAuthenticated: false });
    } finally {
        set({ isLoading: false });
    }
  },
}))

export default useAuthStore;