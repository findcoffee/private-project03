import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import useToken from '../hooks/useToken';
import DetailContainer from '../containers/DetailContainer';

export interface DetailParams {
  id: string;
}

const Detail = ({ match, history }: RouteComponentProps<DetailParams>) => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }

  const goBack = (() => {
    history.goBack();
  });
  return <DetailContainer id={match.params.id} goBack={goBack} />;
};

export default Detail;
