import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Import your reducers

import adminReducer from './slices/adminslice/adminSlice';
import adminActivityReducer from './slices/adminslice/adminActivitySlice';
import usersReducer from './slices/adminslice/all-user-details';
import userCourseSlice from './slices/adminslice/userCourseSlice';
import courseDetailReducer from './slices/adminslice/getinfoaboutcourse';
import chaptersReducer from './slices/adminslice/chaptersSlice'
import userManagementReducer from './slices/adminslice/userManagement'
import dashboardStatsReducer from './slices/adminslice/dashboardStatsSlice'
import courseAuditLogReducer from './slices/adminslice/auditcourselog';
import userReducer  from './slices/profile/profileinfo';
import usereditReducer from './slices/profile/profileedit';
import  homepageinfo from './slices/homepage/homepage';
import ratingReducer from './slices/adminslice/ratinguser';



const placeholderSlice = createSlice({
  name: "placeholder",
  initialState: {},
  reducers: {},
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      admin: adminReducer,
      placeholder: placeholderSlice.reducer,
      adminActivity: adminActivityReducer,
      users: usersReducer,
      userCourses: userCourseSlice,
      courseDetail: courseDetailReducer,
      chapters: chaptersReducer,
      userManagement: userManagementReducer,
      dashboardStats: dashboardStatsReducer,
      courseAuditLogs: courseAuditLogReducer,
      user: userReducer,
      useredit: usereditReducer,
      homepage: homepageinfo,
      ratings: ratingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
