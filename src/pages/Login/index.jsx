import { useRef, useState } from 'react';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth';
import { selectAuth } from '../../utils/selectors';
import { Navigate } from 'react-router';

const Login = () => {
  /* Get the auth key in the store */
  const auth = useSelector(selectAuth);

  const dispatch = useDispatch();

  const usernameField = useRef(null);
  const passwordField = useRef(null);

  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const [emptyUsernameError, setEmptyUsernameError] = useState(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);

  /**
   * Dispatch the action with the given text inputs.
   * @function submitForm
   */
  const submitForm = () => {
    setEmptyUsernameError(false);
    setEmptyPasswordError(false);

    if (usernameValue !== '' && passwordValue !== '') {
      const credentials = {
        email: usernameValue,
        password: passwordValue,
      };

      dispatch(login(credentials));
    }

    if (usernameValue === '') {
      setEmptyUsernameError(true);
    }

    if (passwordValue === '') {
      setEmptyPasswordError(true);
    }
  };
  
  /* If authentication succeeded, redirect to the profile page. */
  return auth.data?.status === 200 ? (
    <Navigate to="/profile" />
  ) : (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form>
          {auth.data?.status === 400 ? <p className="error">{auth.data.message}</p> : null}
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              ref={usernameField}
              onChange={() => {
                const value = usernameField.current.value;
                setUsernameValue(value);
              }}
              type="text"
              id="username"
            />
            {emptyUsernameError ? <p className="empty-error">Veuillez remplir ce champ.</p> : null}
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordField}
              onChange={() => {
                const value = passwordField.current.value;
                setPasswordValue(value);
              }}
              type="password"
              id="password"
            />
            {emptyPasswordError ? <p className="empty-error">Veuillez remplir ce champ.</p> : null}
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div onClick={submitForm} className="sign-in-button">
            Sign In
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
