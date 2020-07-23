import { BookResType, BookReqType } from '../../types';
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import BookService from '../../services/BookService';
import {
  transformToArray,
  createAsyncReducer,
  asyncState,
  AsyncState,
} from '../../lib/reducerUtils';

export interface BooksState {
  books: AsyncState<BookResType, Error>;
}

const initialState: BooksState = {
  books: asyncState.initial(),
};

export const GET_BOOKS_LIST = 'books/GET_BOOKS_LIST';
export const GET_BOOKS_LIST_SUCCESS = 'books/GET_BOOKS_LIST_SUCCESS';
export const GET_BOOKS_LIST_ERROR = 'books/GET_BOOKS_LIST_ERROR';

export const getBooksAsync = createAsyncAction(
  GET_BOOKS_LIST,
  GET_BOOKS_LIST_SUCCESS,
  GET_BOOKS_LIST_ERROR,
)<string, BookResType[], AxiosError>();

type BooksAction = ActionType<typeof getBooksAsync>;
const booksReducer = createReducer<BooksState, BooksAction>(
  initialState,
).handleAction(
  transformToArray(getBooksAsync),
  createAsyncReducer(getBooksAsync, 'books'),
);

export default booksReducer;

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksSaga(action: ReturnType<typeof getBooksAsync.request>) {
  try {
    const books: BookResType[] = yield call(
      BookService.getBooks,
      action.payload,
    );
    console.log('success', books);
    yield put(getBooksAsync.success(books));
  } catch (error) {
    yield put(getBooksAsync.failure(error));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(GET_BOOKS_LIST, getBooksSaga);
}
