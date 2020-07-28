import React, { useCallback, useEffect } from 'react';
import { push, goBack } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/modules/rootReducer';
import Detail from '../components/Detail';
import { logout as logoutSaga } from '../redux/modules/auth';
import { getBooksAsync } from '../redux/modules/books';

interface DetailProps {
  id: string;
}

const DetailContainer: React.FC<DetailProps> = ({ id }) => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);
  const editBook = useCallback(
    (id) => {
      dispatch(push(`/edit/${id}`));
    },
    [dispatch],
  );

  const { data } = useSelector((state: RootState) => state.books.books);
  useEffect(() => {
      if (data === null) {
        dispatch(getBooksAsync.request());
      }
  }, [data, dispatch]);

  const book = data && data.find((item) => String(item.bookId) === id);
  return <Detail book={book} logout={logout} edit={editBook} goBack={back} />;
};

export default DetailContainer;
