// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import user, { usersApi } from './usersSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  user,
  [usersApi.reducerPath]: usersApi.reducer
});

export default reducers;
