// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import user, { usersApi } from './usersSlice';
import project, { projectsApi } from './projectsSlice';
import material, { materialsApi } from './materialsSlice';
import request, { requestsApi } from './requestsSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  user,
  project,
  material,
  request,
  [usersApi.reducerPath]: usersApi.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [materialsApi.reducerPath]: materialsApi.reducer,
  [requestsApi.reducerPath]: requestsApi.reducer
});

export default reducers;
