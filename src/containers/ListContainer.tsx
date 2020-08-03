import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';
import { RootState } from '../redux/modules/rootReducer';
import { deleteBook, list } from '../redux/modules/books';

const ListContainer: React.FC =  () => {
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const deleteHandler = useCallback((id: number) => {
      dispatch(deleteBook(id));
    },
    [dispatch],
  );
  const state = useSelector((state: RootState) => state.books);
  const { books, loading } = state;

  useEffect(() => {
    if (books) return;
    dispatch(list());
  }, [books, dispatch]);

  return (
    <>
      <List
        books={books}
        loading={loading}
        goAdd={goAdd}
        logout={logout}
        deleteBook={deleteHandler}
      />
    </>
  );
};

export default ListContainer;
