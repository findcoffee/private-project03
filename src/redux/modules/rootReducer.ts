import { combineReducers, AnyAction, Reducer } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import books, {
  BooksState,
  addReducer,
  deleteReducer,
  editReducer,
} from './books';
import auth, { AuthState } from './auth';

export interface RootState {
  books: BooksState;
  auth: AuthState;
  router: Reducer<RouterState<unknown>, AnyAction>;
}

const rootReducer = (history: History<unknown>) =>
  combineReducers({
    books,
    addReducer,
    deleteReducer,
    editReducer,
    auth,
    router: connectRouter(history),
  });

export default rootReducer;
