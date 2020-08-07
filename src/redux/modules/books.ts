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

export const pending = createAction('PENDING')();
export const success = createAction('SUCCESS')<BookResType[]>();
export const errorHandler = createAction('ERROR')<Error>();

export const list = createAction('GET_BOOKS_LIST')();
export const add = createAction('ADD_BOOK')<BookReqType>();
export const edit = createAction('EDIT_BOOK')<BookReqType, number>();
export const deleteBook = createAction('DELETE_BOOK')<number>();

const bookActions = {
  pending,
  success,
  errorHandler,
  list,
  add,
  edit,
  deleteBook,
};

type BooksAction = ActionType<typeof bookActions>;

const reducer = createReducer<BooksState, BooksAction>(initialState)
  .handleAction(pending, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction([list, add, edit, deleteBook], (state) => ({
    ...state,
    loading: false,
    error: null,
  }))
  .handleAction(errorHandler, (state, action) => ({
    ...state,
    books: null,
    loading: false,
    error: action.payload,
  }))
  .handleAction(success, (state, action) => ({
    ...state,
    books: action.payload,
    loading: false,
    error: null,
  }));

export default reducer;

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksSaga() {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
  } catch (error) {
    yield put(errorHandler(error));
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
    yield call(BookService.addBook, token, action.payload);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
    yield put(push('/'));
  } catch (error) {
    yield put(errorHandler(error));
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
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
  } catch (error) {
    yield put(errorHandler(error));
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
    yield call(BookService.editBook, token, action.meta, action.payload);
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(success(books));
    yield put(push('/'));
  } catch (error) {
    yield put(errorHandler(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery('GET_BOOKS_LIST', getBooksSaga);
  yield takeEvery('ADD_BOOK', addBookSaga);
  yield takeEvery('DELETE_BOOK', deleteBookSaga);
  yield takeEvery('EDIT_BOOK', editBookSaga);
}
