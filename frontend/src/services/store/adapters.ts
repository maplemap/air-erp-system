import {StoreApi, UseBoundStore, create} from 'zustand';
import {persist} from 'zustand/middleware';
import {STORAGE_KEY} from '@/constants.ts';

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
      name: STORAGE_KEY.APP_DATA,
      partialize: (state) => ({user: state.user}),
    },
  ),
);
