import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Import your reducers
import adminReducer from "./slices/adminslice/adminSlice";
import adminActivityReducer from "./slices/adminslice/adminActivitySlice";
import usersReducer from "./slices/adminslice/all-user-details";
import userCourseSlice from "./slices/adminslice/userCourseSlice";
import courseDetailReducer from "./slices/adminslice/getinfoaboutcourse";

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
