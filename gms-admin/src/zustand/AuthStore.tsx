import { create } from "zustand";

interface AuthStore {
  user: string | null;
  setUser: (user: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem("office-supply-admin-user") || null,
  setUser: (user) => {
    localStorage.setItem("office-supply-admin-user", user);
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("office-supply-admin-user");
    set({ user: null });
  },
}));

export default useAuthStore;
