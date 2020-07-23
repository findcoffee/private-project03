import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';
import { RootState } from '../redux/modules/rootReducer';
import { getBooksAsync } from '../redux/modules/books';
import { getTokenFromState } from '../redux/utils';

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  const token = getTokenFromState(useSelector((state:RootState) => state));
  //let tokenChecker = null;
  if (token === null) {
    //ToDo token null 이면 redirect login
  }
    // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  useEffect(() => {
    dispatch(getBooksAsync.request(token || ''));
  }, [token, dispatch]);
  
  const { books  } = useSelector((state: RootState) => state.books);
  //XXX. edit, delete param으로 넘기기 추가
  
  return (
    <>
      <List books={books.data} loading={books.loading} goAdd={goAdd} logout={logout} />
    </>
  );
};

export default ListContainer;
