import { create } from "zustand";

interface AuthStore {
  user: string | null;
  setUser: (user: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem("office-supply-user") || null,
  setUser: (user) => {
    localStorage.setItem("office-supply-user", user);
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("office-supply-user");
    set({ user: null });
  },
}));

export default useAuthStore;
