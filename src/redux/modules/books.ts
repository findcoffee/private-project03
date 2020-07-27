import { BookResType, BookReqType } from '../../types';
import { getTokenFromState } from '../utils';
import {
  createAsyncAction,
  createReducer,
  ActionType,
  createAction,
} from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import BookService from '../../services/BookService';
import {
  transformToArray,
  createAsyncReducer,
  asyncState,
  AsyncState,
} from '../../lib/reducerUtils';
import { AnyAction } from 'redux';

export interface BooksState {
  books: AsyncState<BookResType, Error>;
}

const initialState: BooksState = {
  books: asyncState.initial(),
};

export const GET_BOOKS_LIST = 'books/GET_BOOKS_LIST';
export const GET_BOOKS_LIST_SUCCESS = 'books/GET_BOOKS_LIST_SUCCESS';
export const GET_BOOKS_LIST_ERROR = 'books/GET_BOOKS_LIST_ERROR';

export const ADD_BOOK = 'books/ADD_BOOK';
export const ADD_BOOK_SUCCESS = 'books/ADD_BOOK_SUCCESS';
export const ADD_BOOK_ERROR = 'books/ADD_BOOK_ERROR';

export const EDIT_BOOK = 'books/EDIT_BOOK';
export const EDIT_BOOK_SUCCESS = 'books/EDIT_BOOK_SUCCESS';
export const EDIT_BOOK_ERROR = 'books/EDIT_BOOK_ERROR';

export const DETAIL_BOOK = 'books/DETAIL_BOOK';
export const DETAIL_BOOK_SUCCESS = 'books/DETAIL_BOOK_SUCCESS';
export const DETAIL_BOOK_ERROR = 'books/DETAIL_BOOK_ERROR';

export const DELETE_BOOK = 'books/DELETE_BOOK';
export const DELETE_BOOK_SUCCESS = 'books/DELETE_BOOK_SUCCESS';
export const DELETE_BOOK_ERROR = 'books/DELETE_BOOK_ERROR';

export const getBooksAsync = createAsyncAction(
  GET_BOOKS_LIST,
  GET_BOOKS_LIST_SUCCESS,
  GET_BOOKS_LIST_ERROR,
)<void, BookResType[], AxiosError>();

type BooksAction = ActionType<typeof getBooksAsync>;
export const booksReducer = createReducer<BooksState, BooksAction>(
  initialState,
).handleAction(
  transformToArray(getBooksAsync),
  createAsyncReducer(getBooksAsync, 'books'),
);

export default booksReducer;

export interface ReqPrams {
  token: string;
  book: BookReqType;
}

export const addBookAsync = createAsyncAction(
  ADD_BOOK,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_ERROR,
)<BookReqType, BookResType[], AxiosError>();
type AddAction = ActionType<typeof addBookAsync>;
export const addReducer = createReducer<BooksState, AddAction>(
  initialState,
).handleAction(
  transformToArray(addBookAsync),
  createAsyncReducer(addBookAsync, 'books'),
);

export const deleteBookAsync = createAsyncAction(
  DELETE_BOOK,
  DELETE_BOOK_SUCCESS,
  DELETE_BOOK_ERROR,
)<number, BookResType[], AxiosError>();
type DeleteAction = ActionType<typeof deleteBookAsync>;
export const deleteReducer = createReducer<BooksState, DeleteAction>(
  initialState,
).handleAction(
  transformToArray(deleteBookAsync),
  createAsyncReducer(deleteBookAsync, 'books'),
);

export interface EditParams {
  book: BookReqType;
  id: number;
}

export const editBookAsync = createAsyncAction(
  EDIT_BOOK,
  EDIT_BOOK_SUCCESS,
  EDIT_BOOK_ERROR,
)<EditParams, BookResType[], AxiosError>();
type EditActionn = ActionType<typeof editBookAsync>;
export const editReducer = createReducer<BooksState, EditActionn>(
  initialState,
).handleAction(
  transformToArray(editBookAsync),
  createAsyncReducer(editBookAsync, 'books'),
);

export interface DelBook {
  type: typeof DELETE_BOOK;
  payload: number;
}

export interface EditBook {
  type: typeof EDIT_BOOK;
  payload: BookResType;
}

export interface AddBook {
  type: typeof ADD_BOOK;
  payload: BookResType;
}

export type BookStateTypes = DelBook | EditBook | AddBook;

export function delbookManage(id: number): BookStateTypes {
  return {
    type: DELETE_BOOK,
    payload: id,
  };
}

// export const reducer = (state = initialState, action: BookStateTypes): BooksState {
//   switch (action.type) {
//     case DELETE_BOOK:
//       return {
//         ...state,
//         books: {
//           books: state.books.books?.filter((book) => { book.bookId !== action.payload }),
//           loading: false,
//           error: null,
//         }

//       };
//       default:
//         return state;
//   }
// };

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksSaga(action: ReturnType<typeof getBooksAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(getBooksAsync.success(books));
  } catch (error) {
    yield put(getBooksAsync.failure(error));
  }
}

// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: ReturnType<typeof addBookAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState);
    yield call(BookService.addBook, token, action.payload);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(addBookAsync.success(books));
    yield put(push('/'));
  } catch (error) {
    yield put(deleteBookAsync.failure(error));
  }
}

// [project] 책을 삭제하는 saga 함수를 작성했다.
function* deleteBookSaga(action: ReturnType<typeof deleteBookAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState);
    yield call(BookService.deleteBook, token, action.payload);
    const books = yield call(BookService.getBooks, token);
    yield put(deleteBookAsync.success(books));
  } catch (error) {
    yield put(deleteBookAsync.failure(error));
  }
}
// [project] 책을 수정하는 saga 함수를 작성했다.
function* editBookSaga(action: ReturnType<typeof editBookAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState);
    yield call(
      BookService.editBook,
      token,
      action.payload.id,
      action.payload.book,
    );
    const books = yield call(BookService.getBooks, token);
    yield put(editBookAsync.success(books));
  } catch (error) {
    yield put(editBookAsync.failure(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(GET_BOOKS_LIST, getBooksSaga);
  yield takeEvery(ADD_BOOK, addBookSaga);
  yield takeEvery(DELETE_BOOK, deleteBookSaga);
  yield takeEvery(EDIT_BOOK, editBookSaga);
}
