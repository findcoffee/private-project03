import { AnyAction } from 'redux';
import { BookResType, BookReqType } from '../../types';
import { getTokenFromState } from '../utils';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import BookService from '../../services/BookService';

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

export const GET_BOOKS_LIST = 'books/GET_BOOKS_LIST' as const;
export const GET_BOOKS_LIST_SUCCESS = 'books/GET_BOOKS_LIST_SUCCESS' as const;
export const GET_BOOKS_LIST_ERROR = 'books/GET_BOOKS_LIST_ERROR' as const;

export const ADD_BOOK = 'books/ADD_BOOK' as const;
export const ADD_BOOK_SUCCESS = 'books/ADD_BOOK_SUCCESS' as const;
export const ADD_BOOK_ERROR = 'books/ADD_BOOK_ERROR' as const;

export const EDIT_BOOK = 'books/EDIT_BOOK' as const;
export const EDIT_BOOK_SUCCESS = 'books/EDIT_BOOK_SUCCESS' as const;
export const EDIT_BOOK_ERROR = 'books/EDIT_BOOK_ERROR' as const;

export const DETAIL_BOOK = 'books/DETAIL_BOOK' as const;
export const DETAIL_BOOK_SUCCESS = 'books/DETAIL_BOOK_SUCCESS' as const;
export const DETAIL_BOOK_ERROR = 'books/DETAIL_BOOK_ERROR' as const;

export const DELETE_BOOK = 'books/DELETE_BOOK' as const;
export const DELETE_BOOK_SUCCESS = 'books/DELETE_BOOK_SUCCESS' as const;
export const DELETE_BOOK_ERROR = 'books/DELETE_BOOK_ERROR' as const;

export const PENDING = 'books/PENDING' as const;

export const pending = () => ({
  type: PENDING,
});

export const list = () => ({
  type: GET_BOOKS_LIST,
});
export const listSuccess = (books: BookResType[]) => ({
  type: GET_BOOKS_LIST_SUCCESS,
  payload: books,
});
export const listError = (error: Error) => ({
  type: GET_BOOKS_LIST_ERROR,
  payload: error,
});
export const add = (book: BookReqType) => ({
  type: ADD_BOOK,
  payload: book,
});
export const addSuccess = (book: BookResType) => ({
  type: ADD_BOOK_SUCCESS,
  payload: book,
});
export const addError = (error: Error) => ({
  type: ADD_BOOK_ERROR,
  payload: error,
});
export const edit = (id: number, book: BookReqType) => ({
  type: EDIT_BOOK,
  payload: book,
  meta: id,
});
export const editSuccess = (book: BookResType) => ({
  type: EDIT_BOOK_SUCCESS,
  payload: book,
});
export const editError = (error: Error) => ({
  type: EDIT_BOOK_ERROR,
  payload: error,
});
export const deleteBook = (id: number) => ({
  type: DELETE_BOOK,
  payload: id,
});
export const deleteBookSuccess = (id: number) => ({
  type: DELETE_BOOK_SUCCESS,
  payload: id,
});
export const deleteBookError = (error: Error) => ({
  type: DELETE_BOOK_ERROR,
  payload: error,
});

type BooksAction =
  | ReturnType<typeof list>
  | ReturnType<typeof listSuccess>
  | ReturnType<typeof listError>
  | ReturnType<typeof add>
  | ReturnType<typeof addSuccess>
  | ReturnType<typeof addError>
  | ReturnType<typeof edit>
  | ReturnType<typeof editSuccess>
  | ReturnType<typeof editError>
  | ReturnType<typeof deleteBook>
  | ReturnType<typeof deleteBookSuccess>
  | ReturnType<typeof deleteBookError>
  | ReturnType<typeof pending>;

const reducer = (
  state: BooksState = initialState,
  action: BooksAction,
): BooksState => {
  switch (action.type) {
    case PENDING:
      return {
        ...state,
        loading: true,
      };
    case GET_BOOKS_LIST:
    case ADD_BOOK:
    case EDIT_BOOK:
    case DELETE_BOOK:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case GET_BOOKS_LIST_SUCCESS:
      return {
        ...state,
        books: action.payload,
        loading: false,
        error: null,
      };
    case ADD_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books!.concat(action.payload),
        loading: false,
        error: null,
      };
    case EDIT_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books!.map((book) =>
          book.bookId === action.payload.bookId ? action.payload : book,
        ),
        loading: false,
        error: null,
      };
    case DELETE_BOOK_SUCCESS:
      return {
        ...state,
        books: state.books!.filter((book) => book.bookId !== action.payload),
        loading: false,
        error: null,
      };
    case GET_BOOKS_LIST_ERROR:
    case ADD_BOOK_ERROR:
    case EDIT_BOOK_ERROR:
    case DELETE_BOOK_ERROR:
      return {
        ...state,
        books: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

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
