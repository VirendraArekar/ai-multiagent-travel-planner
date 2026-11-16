import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip, TripSummary } from '@/types';

interface TripState {
  currentTrip: Trip | null;
  trips: TripSummary[];
  filterDestination: string;
  filterStatus: string;
  isLoading: boolean;
}

const initialState: TripState = {
  currentTrip: null,
  trips: [],
  filterDestination: '',
  filterStatus: 'ALL',
  isLoading: false,
};

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    setTrips: (state, action: PayloadAction<TripSummary[]>) => {
      state.trips = action.payload;
    },
    setFilterDestination: (state, action: PayloadAction<string>) => {
      state.filterDestination = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrentTrip, setTrips, setFilterDestination, setFilterStatus, setLoading } = tripSlice.actions;
export default tripSlice.reducer;
