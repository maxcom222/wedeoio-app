import { useSelector, useDispatch } from 'react-redux';

const withAdmin = (Page) => {
  const Auth = (props) => {
    const user = useSelector((state: any) => state.auth.user);
    return user && user?.name && !user?.isAdmin ? <Page {...props} /> : null;
  };

  return Auth;
};

export default withAdmin;
