import { create } from "zustand";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  dob?: Date;

  // Actions
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setDob: (dob: Date) => void;
  updateUserData: (
    data: Partial<
      Omit<UserState, "setFirstName" | "setLastName" | "setEmail" | "setDob" | "updateUserData">
    >
  ) => void;
}

// Create the store with mock data for development
const useUserStore = create<UserState>((set) => ({
  // Mock data - in production, this would be loaded from an API or auth context
  firstName: "Toby",
  lastName: "Belhome",
  email: "contact@bundui.io",
  dob: undefined,

  // Actions to update the store
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setDob: (dob) => set({ dob }),
  updateUserData: (data) => set((state) => ({ ...state, ...data }))
}));

export default useUserStore;
