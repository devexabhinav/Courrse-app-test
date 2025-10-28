import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// User interface
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  profileImage: string | null;
  bio: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileData {
  username?: string;
  bio?: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  lastUpdated: number | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  lastUpdated: null,
};

// Async thunk for getting user by ID
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`user/getinfo/${userId}`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch user');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, updates }: { userId: string; updates: UpdateProfileData }, { rejectWithValue }) => {
    try {
      console.log('🟡 Updating user profile:', { userId, updates });
      
      const response = await reduxApiClient.put(`user/update-profile/${userId}`, updates);
      
      if (!response.success) {
        const errorMessage = response.error?.message || 
                            response.error?.error?.message || 
                            'Failed to update profile';
        console.log('❌ Update profile error:', errorMessage);
        return rejectWithValue(errorMessage);
      }

      console.log('✅ Profile updated successfully:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ Update profile API error:', error);
      
      // Handle different error types
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return rejectWithValue('Network error: Unable to connect to server');
      }
      
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear user data
    clearUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.updateError = null;
      state.lastUpdated = null;
    },
    
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    
    // Clear update error specifically
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    
    // Reset loading states
    resetLoading: (state) => {
      state.loading = false;
      state.updateLoading = false;
    },
    
    // Update user profile locally (for optimistic updates)
    updateUserProfileLocal: (state, action: PayloadAction<UpdateProfileData>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // getUserById cases
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload.data || action.payload;
        state.error = null;
        state.lastUpdated = Date.now();
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
      })
      
      // updateUserProfile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.updateLoading = false;
        
        // Update current user with new data
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.data,
          };
        } else {
          // If no current user, set it from response
          state.currentUser = action.payload.data;
        }
        
        state.updateError = null;
        state.lastUpdated = Date.now();
        
        console.log('✅ User profile updated in store:', action.payload.data);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        console.error('❌ Update profile rejected:', action.payload);
      });
  },
});

export const { 
  clearUser, 
  clearError, 
  clearUpdateError,
  resetLoading, 
  updateUserProfileLocal 
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUpdateLoading = (state: { user: UserState }) => state.user.updateLoading;
export const selectUpdateError = (state: { user: UserState }) => state.user.updateError;
export const selectLastUpdated = (state: { user: UserState }) => state.user.lastUpdated;

export default userSlice.reducer;