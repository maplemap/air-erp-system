import {StoreApi, UseBoundStore, create} from 'zustand';
import {SearchFlightsParams} from '@/modules/customer/services/api/adapters';

type TState = {
  bookFlightId: string | null;
  flightDetails: FlightDetails | null;
  searchParams: SearchFlightsParams | null;
};

type Actions = {
  setFlightDetails: (data: FlightDetails) => void;
  setBookFlightId: (id: string) => void;
  clearBookFlightId: () => void;
  setSearchParams: (params: SearchFlightsParams) => void;
  clearSearchParams: () => void;
};

export const initialState: TState = {
  bookFlightId: null,
  searchParams: null,
  flightDetails: null,
};

export const useCustomerStore: UseBoundStore<StoreApi<TState & Actions>> =
  create((set) => ({
    ...initialState,
    setSearchParams: (params) => set(() => ({searchParams: params})),
    setFlightDetails: (data) => set(() => ({flightDetails: data})),
    setBookFlightId: (data) => set(() => ({bookFlightId: data})),
    clearBookFlightId: () =>
      set(() => ({
        bookFlightId: initialState.bookFlightId,
        flightDetails: initialState.flightDetails,
      })),
    clearSearchParams: () =>
      set(() => ({searchParams: initialState.searchParams})),
  }));
