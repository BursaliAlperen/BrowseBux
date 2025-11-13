import { createContext } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: async () => {},
  logout: () => {},
});
