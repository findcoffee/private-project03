import React, { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/modules/rootReducer';
import Detail from '../components/Detail';
import { logout as logoutSaga } from '../redux/modules/auth';

interface DetailProps {
  id: string;
  goBack: () => void;
}

const DetailContainer: React.FC<DetailProps> = ({ id, goBack }) => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // const edit = useCallback(() => {
  //   dispatch(editBookSaga());
  // }, [dispatch]);
  const editBook = useCallback((id) => {
    console.log('Edit Book Clicked', id);
  }, []);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  useEffect(() => {
    return () => {
      console.log('Reload :');
    };
  }, []);

  const { books } = useSelector((state: RootState) => state.books);
  //const token = getTokenFromState(useSelector((state: RootState) => state));
  // dispatch(getBooksAsync.request(token || ''));

  const book =
    books.data &&
    books.data.find((item) => String(item.bookId) === id);
  return <Detail book={book} logout={logout} edit={editBook} goBack={goBack} />;
};

export default DetailContainer;
