import { AnyAction } from 'redux';
import { getType, AsyncActionCreatorBuilder } from 'typesafe-actions';
import { T } from 'antd/lib/upload/utils';

export type AsyncState<T, E = any> = {
  books: T[] | null;
  loading: boolean;
  error: E | null;
};

export const asyncState = {
  initial: <T, E = any>(initialData?: T[]): AsyncState<T, E> => ({
    loading: false,
    books: initialData || null,
    error: null,
  }),
  load: <T, E = any>(books?: T[]): AsyncState<T, E> => ({
    loading: true,
    books: books || null,
    error: null,
  }),
  success: <T, E = any>(books: T[]): AsyncState<T, E> => ({
    loading: false,
    books,
    error: null,
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    loading: false,
    books: null,
    error: error,
  }),
};

type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;
export function transformToArray<AC extends AnyAsyncActionCreator>(
  asyncActionCreator: AC,
) {
  const { request, success, failure } = asyncActionCreator;
  return [request, success, failure];
}

export function createAsyncReducer<
  S,
  AC extends AnyAsyncActionCreator,
  K extends keyof S
>(asyncActionCreator: AC, key: K) {
  return (state: S, action: AnyAction) => {
    console.log('state: ', state, 'action: ', action.payload);
    const [request, success, failure] = transformToArray(
      asyncActionCreator,
    ).map(getType);
    switch (action.type) {
      case request:
        return {
          ...state,
          [key]: asyncState.load(),
        };
      case success:
        return {
          ...state,
          [key]: asyncState.success(action.payload),
        };
      case failure:
        return {
          ...state,
          [key]: asyncState.error(action.payload),
        };
      default:
        return state;
    }
  };
}
