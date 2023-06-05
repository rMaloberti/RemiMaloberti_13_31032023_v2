import argentBankLogo from '../../assets/argentBankLogo.png';
import { Link } from 'react-router-dom';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '../../utils/selectors';
import * as authActions from '../../features/auth';

const Nav = () => {
  /* Get the auth key in the store */
  const auth = useSelector(selectAuth);

  const dispatch = useDispatch();

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img className="main-nav-logo-image" src={argentBankLogo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        {auth.data?.status === 200 ? (
          <div>
            <Link className="main-nav-item" to="/profile">
              <i className="fa fa-user-circle"></i>
              Tony
            </Link>
            <div onClick={() => dispatch(authActions.logout())} className="main-nav-item">
              <i className="fa fa-sign-out"></i>
              Sign Out
            </div>
          </div>
        ) : (
          <Link className="main-nav-item" to="/login">
            <i className="fa fa-user-circle"></i> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
