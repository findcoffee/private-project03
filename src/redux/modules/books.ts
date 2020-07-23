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

export const GET_BOOKS_LIST = 'books/GET_BOOKS_LIST';
export const GET_BOOKS_LIST_SUCCESS = 'books/GET_BOOKS_LIST_SUCCESS';
export const GET_BOOKS_LIST_ERROR = 'books/GET_BOOKS_LIST_ERROR';

export const CHANGE_INPUT = 'books/CHANGE_INPUT';

export const getBooksAsync = createAsyncAction(
  GET_BOOKS_LIST,
  GET_BOOKS_LIST_SUCCESS,
  GET_BOOKS_LIST_ERROR,
)<string, BookResType[], AxiosError>();

export const changeInput = createAction(CHANGE_INPUT, ({ key, value }) => ({
  key,
  value,
}))();

// const bookReducer = createReducer<BookState, ActionType<typeof changeInput>>(
//   initialInputState,
// ).handleAction(changeInput, (state, action) => ({
//   ...state,
//   [action.payload.key]: action.payload.value,
// }));

type BooksAction = ActionType<typeof getBooksAsync>;
const booksReducer = createReducer<BooksState, BooksAction>(
  initialState,
).handleAction(
  transformToArray(getBooksAsync),
  createAsyncReducer(getBooksAsync, 'books'),
);

// const reducer = (state = initialState, action: BooksAction) => {
//   switch (action.type) {
//     case GET_BOOKS_LIST:
//     case GET_BOOKS_LIST_SUCCESS:
//     case GET_BOOKS_LIST_ERROR:
//       console.log('reducer type: action', action, 'state:', state);
//       return booksReducer;
//     default:
//       return state;
//   }
// };

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
// [project] 책을 추가하는 saga 함수를 작성했다.
// [project] 책을 삭제하는 saga 함수를 작성했다.
// [project] 책을 수정하는 saga 함수를 작성했다.

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(GET_BOOKS_LIST, getBooksSaga);
}
