// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Admin activities state
interface AdminActivityState {
  activities: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  stats: {
    totalLogins: number;
    totalLogouts: number;
    activeSessions: number;
    avgDuration: number;
  };
}

// Your existing user state (add your actual properties here)
interface UserState {
  // Add your existing user properties here
  user: any; // Replace with your actual user type
  users: any[]; // Replace with your actual users type
  loading: boolean;
  error: string | null;
  
  // Add admin activities
  adminActivities: AdminActivityState;
}

const initialAdminActivitiesState: AdminActivityState = {
  activities: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  stats: {
    totalLogins: 0,
    totalLogouts: 0,
    activeSessions: 0,
    avgDuration: 0,
  },
};

const initialState: UserState = {
  // Your existing user initialState
  user: null,
  users: [],
  loading: false,
  error: null,
  
  // Add admin activities
  adminActivities: initialAdminActivitiesState,
};

export const fetchAdminActivities = createAsyncThunk(
  'user/fetchAdminActivities',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`admin/activities?page=${page}&limit=10`);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch admin activities');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch admin activities');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Your existing user reducers
    clearError: (state) => {
      state.error = null;
    },
    // ... other existing reducers
    
    // Admin activities reducers
    clearAdminActivitiesError: (state) => { 
      state.adminActivities.error = null; 
    },
    resetAdminActivities: (state) => { 
      state.adminActivities.activities = [];
      state.adminActivities.totalCount = 0;
      state.adminActivities.currentPage = 1;
      state.adminActivities.totalPages = 0;
      state.adminActivities.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin activities
      .addCase(fetchAdminActivities.pending, (state) => {
        state.adminActivities.loading = true;
        state.adminActivities.error = null;
      })
      .addCase(fetchAdminActivities.fulfilled, (state, action) => {
        state.adminActivities.loading = false;
        
        const responseData = action.payload;
        const activitiesData = responseData?.data?.activities || [];
        const paginationData = responseData?.data?.pagination || {};
        
        state.adminActivities.activities = activitiesData;
        state.adminActivities.totalCount = paginationData.totalItems || 0;
        state.adminActivities.currentPage = paginationData.currentPage || 1;
        state.adminActivities.totalPages = paginationData.totalPages || 0;
        
        // Calculate stats
        state.adminActivities.stats.totalLogins = activitiesData.filter((a: any) => a.activity_type === 'login').length;
        state.adminActivities.stats.totalLogouts = activitiesData.filter((a: any) => a.activity_type === 'logout').length;
        state.adminActivities.stats.activeSessions = activitiesData.filter((a: any) => a.status === 'active').length;
        
        const totalDuration = activitiesData
          .filter((a: any) => a.session_duration)
          .reduce((sum: number, a: any) => sum + a.session_duration, 0);
        
        state.adminActivities.stats.avgDuration = state.adminActivities.stats.totalLogins > 0 ? Math.round(totalDuration / state.adminActivities.stats.totalLogins) : 0;
      })
      .addCase(fetchAdminActivities.rejected, (state, action) => {
        state.adminActivities.loading = false;
        state.adminActivities.error = action.payload as string;
        state.adminActivities.activities = [];
        state.adminActivities.totalCount = 0;
        state.adminActivities.currentPage = 1;
        state.adminActivities.totalPages = 0;
        state.adminActivities.stats = {
          totalLogins: 0,
          totalLogouts: 0,
          activeSessions: 0,
          avgDuration: 0,
        };
      });
  },
});

export const selectActivities = (state: { user: any }) => 
  state.user?.adminActivities?.activities || [];

export const selectTotalCount = (state: { user: any }) => 
  state.user?.adminActivities?.totalCount || 0;

export const selectCurrentPage = (state: { user: any }) => 
  state.user?.adminActivities?.currentPage || 1;

export const selectTotalPages = (state: { user: any }) => 
  state.user?.adminActivities?.totalPages || 0;

export const selectLoading = (state: { user: any }) => 
  state.user?.adminActivities?.loading || false;

export const selectError = (state: { user: any }) => 
  state.user?.adminActivities?.error || null;

export const selectStats = (state: { user: any }) => 
  state.user?.adminActivities?.stats || {
    totalLogins: 0,
    totalLogouts: 0,
    activeSessions: 0,
    avgDuration: 0,
  };
export default userSlice.reducer;