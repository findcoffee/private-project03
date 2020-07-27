import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import useToken from '../hooks/useToken';
import EditContainer from '../containers/EditContainer';

export interface EditParams {
  id: string;
}

const Edit = ({ match }: RouteComponentProps<EditParams>) => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <EditContainer id={match.params.id} />;
};

export default Edit;
