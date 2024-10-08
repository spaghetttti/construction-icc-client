// third-party
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { useDispatch as useAppDispatch, useSelector as useAppSelector, TypedUseSelectorHook } from 'react-redux';

// project import
import reducers from './reducers';
import { usersApi } from './reducers/usersSlice';
import { projectsApi } from './reducers/projectsSlice';
import { materialsApi } from './reducers/materialsSlice';
import { requestsApi } from './reducers/requestsSlice';
import { suppliersApi } from './reducers/suppliersSlice';
import { accountingReportsApi } from './reducers/accountingReportsSlice';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      usersApi.middleware,
      projectsApi.middleware,
      materialsApi.middleware,
      requestsApi.middleware,
      suppliersApi.middleware,
      accountingReportsApi.middleware
    )
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

const useDispatch = () => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, dispatch, useSelector, useDispatch };
