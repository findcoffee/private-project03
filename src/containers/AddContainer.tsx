import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Add from '../components/Add';
import { logout as logoutSaga } from '../redux/modules/auth';
import { goBack, push } from 'connected-react-router';
import { BookReqType } from '../types';
import { add } from '../redux/modules/books';

const AddContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);
  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const addHandler = useCallback(
    (book: BookReqType) => {
      dispatch(add(book));
      dispatch(push('/'));
    },
    [dispatch],
  );

  return <Add loading={false} logout={logout} goBack={back} add={addHandler} />;
};

export default AddContainer;
