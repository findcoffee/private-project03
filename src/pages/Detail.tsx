import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import useToken from '../hooks/useToken';
import DetailContainer from '../containers/DetailContainer';

export interface DetailParams {
  id: string;
}

const Detail = ({ match }: RouteComponentProps<DetailParams>) => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }

  return <DetailContainer id={match.params.id} />;
};

export default Detail;
