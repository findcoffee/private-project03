import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Edit from '../components/Edit';
import { RootState } from '../redux/modules/rootReducer';
import { goBack, push } from 'connected-react-router';
import { logout as logoutSaga } from '../redux/modules/auth';
import { edit, list } from '../redux/modules/books'
import { BookReqType } from '../types';

interface EditContainerParams {
  id: string;
}

const EditContainer = ({ id }: EditContainerParams) => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);
  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);
  
  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const editHandler = useCallback(
    (book: BookReqType, id: number) => {
      dispatch(edit(id, book));
      dispatch(push('/'));
    },
    [dispatch],
  );

  const { books, loading } = useSelector(
    (state: RootState) => state.books,
  );
  useEffect(() => {
    if (books === null) {
      dispatch(list());
    }
  }, [books, dispatch]);

  const book = books && books.find((item) => String(item.bookId) === id);
  return (
    <Edit
      book={book}
      loading={loading}
      logout={logout}
      edit={editHandler}
      goBack={back}
    />
  );
};

export default EditContainer;
