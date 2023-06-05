import { useSelector } from 'react-redux';
import { selectAuth } from '../../utils/selectors';
import { Navigate } from 'react-router';

export const ProtectedRoute = ({ children }) => {
  /* Get the auth key in the store */
  const auth = useSelector(selectAuth);

  if (!auth.data?.body.token) {
    return <Navigate to="/login" />;
  }

  return children;
};
