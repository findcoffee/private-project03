import { BookResType, BookReqType } from '../../types';
import {
  createAsyncAction,
  createReducer,
  ActionType,
  createAction,
} from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import BookService from '../../services/BookService';

export interface BookState {
  book: BookReqType | null;
  loading: boolean;
  error: Error | null;
}

const initialInputState: BookState = {
  book: null,
  loading: false,
  error: null,
};

export const ADD_BOOK = 'books/ADD_BOOK';
export const ADD_BOOK_SUCCESS = 'books/ADD_BOOK_SUCCESS';
export const ADD_BOOK_ERROR = 'books/ADD_BOOK_ERROR';

export const EDIT_BOOK = 'books/EDIT_BOOK';
export const EDIT_BOOK_SUCCESS = 'books/EDIT_BOOK_SUCCESS';
export const EDIT_BOOK_ERROR = 'books/EDIT_BOOK_ERROR';

export const DETAIL_BOOK = 'books/DETAIL_BOOK';
export const DETAIL_BOOK_SUCCESS = 'books/DETAIL_BOOK_SUCCESS';
export const DETAIL_BOOK_ERROR = 'books/DETAIL_BOOK_ERROR';

export const CHANGE_INPUT = 'books/CHANGE_INPUT';

export const addBookAsync = createAsyncAction(
  ADD_BOOK,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_ERROR,
)<string, BookReqType, AxiosError>();

type BookAction = ActionType<typeof addBookAsync>;

export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}))();

const bookReducer = createReducer<BookState, ActionType<typeof changeInput>>(
  initialInputState,
).handleAction(changeInput, (state, action) => ({
  ...state,
  [action.payload.key]: action.payload.value,
}));
export default bookReducer;
// [project] 책을 추가하는 saga 함수를 작성했다.
// [project] 책을 삭제하는 saga 함수를 작성했다.
// [project] 책을 수정하는 saga 함수를 작성했다.
// function* editBookSaga() {
//   console.log('Edit Book Saga');
// }

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
// export function* sagas() {
//   yield takeEvery(, editBookSaga);
// }
