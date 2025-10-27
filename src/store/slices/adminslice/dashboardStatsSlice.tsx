import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboardStats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get('user/dashboard-stats');
      
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch dashboard statistics');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const dashboardStatsSlice = createSlice({
  name: 'dashboardStats',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearDashboardStats: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetDashboardStats: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
    // Optional: Update specific stats without refetching
    updateStatsManually: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard statistics';
        state.data = null;
      });
  },
});

// Export actions
export const { 
  clearDashboardStats, 
  clearError, 
  resetDashboardStats,
  updateStatsManually 
} = dashboardStatsSlice.actions;

// Export selectors
export const selectDashboardStats = (state) => state.dashboardStats.data;
export const selectDashboardStatsLoading = (state) => state.dashboardStats.loading;
export const selectDashboardStatsError = (state) => state.dashboardStats.error;
export const selectDashboardStatsLastFetched = (state) => state.dashboardStats.lastFetched;

// Export specific data selectors for easier access
export const selectTotalUsers = (state) => state.dashboardStats.data?.summary?.totalUsers || 0;
export const selectTotalAdmins = (state) => state.dashboardStats.data?.summary?.totalAdmins || 0;
export const selectTotalChapters = (state) => state.dashboardStats.data?.summary?.totalChapters || 0;
export const selectTotalCourses = (state) => state.dashboardStats.data?.summary?.totalCourses || 0;
export const selectActiveCourses = (state) => state.dashboardStats.data?.summary?.activeCourses || 0;
export const selectInactiveCourses = (state) => state.dashboardStats.data?.summary?.inactiveCourses || 0;

// Detailed selectors
export const selectUserStats = (state) => state.dashboardStats.data?.users || {};
export const selectChapterStats = (state) => state.dashboardStats.data?.chapters || {};
export const selectCourseStats = (state) => state.dashboardStats.data?.courses || {};

// User role specific selectors
export const selectAdminUsers = (state) => state.dashboardStats.data?.users?.byRole?.admin || 0;
export const selectRegularUsers = (state) => state.dashboardStats.data?.users?.byRole?.user || 0;
export const selectVerifiedUsers = (state) => state.dashboardStats.data?.users?.userVerification?.verified || 0;
export const selectUnverifiedUsers = (state) => state.dashboardStats.data?.users?.userVerification?.unverified || 0;
export const selectApprovedAdmins = (state) => state.dashboardStats.data?.users?.adminStatus?.approved || 0;
export const selectRejectedAdmins = (state) => state.dashboardStats.data?.users?.adminStatus?.rejected || 0;
export const selectPendingAdmins = (state) => state.dashboardStats.data?.users?.adminStatus?.pending || 0;

// Course status selectors
export const selectDraftCourses = (state) => state.dashboardStats.data?.courses?.draft || 0;

export default dashboardStatsSlice.reducer;