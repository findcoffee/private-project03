import { AnyAction } from 'redux';
import { BookResType, BookReqType } from '../../types';
import { getTokenFromState } from '../utils';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import BookService from '../../services/BookService';
import { createAction, ActionType, createReducer } from 'typesafe-actions';

export interface BooksState {
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: null,
  loading: false,
  error: null,
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

export const PENDING = 'books/PENDING';

export const pending = createAction(PENDING)();
export const list = createAction(GET_BOOKS_LIST)();
export const listSuccess = createAction(GET_BOOKS_LIST_SUCCESS)<BookResType[]>();
export const listError = createAction(GET_BOOKS_LIST_ERROR)<Error>();
export const add = createAction(ADD_BOOK)<BookReqType>();
export const addSuccess = createAction(ADD_BOOK_SUCCESS)<BookResType>();
export const addError = createAction(ADD_BOOK_ERROR)<Error>();
export const edit = createAction(EDIT_BOOK)<BookReqType, number>();
export const editSuccess = createAction(EDIT_BOOK_SUCCESS)<BookResType>();
export const editError = createAction(EDIT_BOOK_ERROR)<Error>();
export const deleteBook = createAction(DELETE_BOOK)<number>();
export const deleteBookSuccess = createAction(DELETE_BOOK_SUCCESS)<number>();
export const deleteBookError = createAction(DELETE_BOOK_ERROR)<Error>();

const bookActions = { 
  pending
  , list, listSuccess, listError
  , add, addSuccess, addError
  , edit, editSuccess, editError 
  , deleteBook, deleteBookSuccess, deleteBookError
};

type BooksAction = ActionType<typeof bookActions>;

const reducer = createReducer<BooksState, BooksAction>(initialState)
  .handleAction(pending, state => ({
    ...state,
    loading: true,
  }))
  .handleAction([list, add, edit, deleteBook], (state) => ({
    ...state,
    loading: false,
    error: null,
  }))
  .handleAction([listError, addError, editError, deleteBookError], (state, action) => ({
    ...state,
    books: null,
    loading: false,
    error: action.payload,
  }))
  .handleAction(listSuccess, (state, action) => ({
    ...state,
    books: action.payload,
    loading: false,
    error: null,    
  }))
  .handleAction(addSuccess, (state, action) => ({
    ...state,
    books: state.books!.concat(action.payload),
    loading: false,
    error: null,
  }))
  .handleAction(editSuccess, (state, action) => ({
    ...state,
    books: state.books!.map((book) =>
      book.bookId === action.payload.bookId ? action.payload : book,
    ),
    loading: false,
    error: null,
  }))
  .handleAction(deleteBookSuccess, (state, action) => ({
    ...state,
    books: state.books!.filter((book) => book.bookId !== action.payload),
    loading: false,
    error: null,
  }))
  ;

export default reducer;

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksSaga() {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(listSuccess(books));
  } catch (error) {
    yield put(listError(error));
  }
}

interface AddAction extends AnyAction {
  payload: BookReqType;
}

// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: AddAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const book: BookResType = yield call(
      BookService.addBook,
      token,
      action.payload,
    );
    yield put(addSuccess(book));
    yield put(push('/'));
  } catch (error) {
    yield put(addError(error));
  }
}

interface DeleteAction extends AnyAction {
  payload: number;
}

// [project] 책을 삭제하는 saga 함수를 작성했다.
function* deleteBookSaga(action: DeleteAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    yield call(BookService.deleteBook, token, action.payload);
    yield put(deleteBookSuccess(action.payload));
  } catch (error) {
    yield put(deleteBookError(error));
  }
}

interface EditAction extends AnyAction {
  payload: BookReqType;
  meta: number;
}

// [project] 책을 수정하는 saga 함수를 작성했다.
function* editBookSaga(action: EditAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const book: BookResType = yield call(
      BookService.editBook,
      token,
      action.meta,
      action.payload,
    );
    yield put(editSuccess(book));
    yield put(push('/'));
  } catch (error) {
    yield put(editError(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(GET_BOOKS_LIST, getBooksSaga);
  yield takeEvery(ADD_BOOK, addBookSaga);
  yield takeEvery(DELETE_BOOK, deleteBookSaga);
  yield takeEvery(EDIT_BOOK, editBookSaga);
}
