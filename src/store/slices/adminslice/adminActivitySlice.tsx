
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
  AdminActivityState,
  initialAdminActivityState,
  AdminActivitiesResponse
} from '@/types/adminType/admintype';
import { reduxApiClient } from '@/lib/redux-api';

 
const initialState: AdminActivityState = initialAdminActivityState;


export const getAllAdminActivities = createAsyncThunk(
  'adminActivity/getAllAdminActivities',
  async (
    params: { 
      page?: number; 
      limit?: number; 
      activity_type?: string; 
      admin_id?: number 
    } = {},
    { rejectWithValue }
  ) => {
    try {
    
      const { page = 1, limit = 50, activity_type, admin_id } = params;
      
      // Use the reduxApiClient instead of useApiClient hook
      const response = await reduxApiClient.get('user/getlogs', {
        page,
        limit,
        activity_type,
        admin_id
      });

      if (response.success && response.data) {
        return response.data; // Return the data object directly
      } else {
        return rejectWithValue('Invalid response format from server');
      }
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to fetch admin activities';
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const adminActivitySlice = createSlice({
  name: 'adminActivity',
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 0;
      state.hasMore = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Admin Activities
      .addCase(getAllAdminActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAdminActivities.fulfilled,
        (state, action: PayloadAction<AdminActivitiesResponse>) => {
          state.loading = false;
          state.activities = action.payload.activities;
          state.totalCount = action.payload.totalCount;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.hasMore = action.payload.hasMore;
        }
      )
      .addCase(getAllAdminActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.activities = [];
        state.totalCount = 0;
        state.currentPage = 1;
        state.totalPages = 0;
        state.hasMore = false;
      });
  },
});

export const { clearActivities, clearError } = adminActivitySlice.actions;
export default adminActivitySlice.reducer;