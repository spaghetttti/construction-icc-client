// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import user, { usersApi } from './usersSlice';
import project, { projectsApi } from './projectsSlice';
import material, { materialsApi } from './materialsSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  user,
  project,
  material,
  [usersApi.reducerPath]: usersApi.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [materialsApi.reducerPath]: materialsApi.reducer
});

export default reducers;
