import {StoreApi, UseBoundStore, create} from 'zustand';
import {persist} from 'zustand/middleware';

type TState = {
  user: User | null;
};

type Actions = {
  setUser: (user: User) => void;
  deleteUser: () => void;
};

export const initialState: TState = {
  user: null,
};

export const useAppStore: UseBoundStore<StoreApi<TState & Actions>> = create(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set(() => ({user})),
      deleteUser: () => set(() => ({user: null})),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({user: state.user}),
    },
  ),
);
