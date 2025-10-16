import { configureStore, createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import your counter reducer
import counterReducer from './slices/userSlice';

// Temporary placeholder slice until you add your own slices
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {},
  reducers: {},
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
      counter: counterReducer,  // ← Added counter reducer
      placeholder: placeholderSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Export pre-typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;