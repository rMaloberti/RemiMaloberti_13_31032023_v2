import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { selectAuth, selectProfile } from '../../utils/selectors';
import { useEffect, useRef, useState } from 'react';
import { editProfile, fetchOrUpdateProfile } from '../../features/profile';
import { useNavigate } from 'react-router';

const Profile = () => {
  /* Get the auth key in the store */
  const auth = useSelector(selectAuth);

  /* React router navigate */
  const navigate = useNavigate();

  /* Redux dispatcher */
  const dispatch = useDispatch();

  /* Text inputs refs */
  const firstNameField = useRef(null);
  const lastNameField = useRef(null);

  /* Text inputs react states that holds their value */
  const [firstNameValue, setFirstNameValue] = useState('');
  const [lastNameValue, setLastNameValue] = useState('');

  /* Observer that tells if the edition is active using a boolean in react state */
  const [editingName, setEditingName] = useState(false);

  /**
   * Validate the form and dispatch the edit profile action.
   * @function submitForm
   */
  const submitForm = () => {
      const newData = {
        firstName: firstNameValue !== '' ? firstNameValue : firstName,
        lastName: lastNameValue !== '' ? lastNameValue : lastName,
      };

      dispatch(editProfile(auth.data?.body.token, newData));
    
    setEditingName(false);
  };

  /* Dispatch fetch action to get the profile data in the sotre */
  useEffect(() => {
    dispatch(fetchOrUpdateProfile(auth.data?.body.token));
  }, [auth, dispatch]);

  /* Get the profile data using redux selector */
  const profileData = useSelector(selectProfile).data?.body ?? {};

  const { firstName, lastName, balance } = profileData;

  return (
    <main className="main bg-dark">
      <div className="header">
        {editingName ? (
          <h1>Welcome back</h1>
        ) : (
          <h1>
            Welcome back
            <br />
            {`${firstName} ${lastName}!`}
          </h1>
        )}

        {editingName ? (
          <div className="edit-section">
            <div className="edit-section__textfields">
              <input
                ref={firstNameField}
                onChange={() => {
                  const value = firstNameField.current.value;
                  setFirstNameValue(value);
                }}
                type="text"
                className="first-name-input"
                placeholder={firstName}
              />
              <input
                ref={lastNameField}
                onChange={() => {
                  const value = lastNameField.current.value;
                  setLastNameValue(value);
                }}
                type="text"
                className="last-name-input"
                placeholder={lastName}
              />
            </div>
            <div className="edit-section__buttons">
              <button onClick={submitForm} className="save-button">
                Save
              </button>
              <button onClick={() => setEditingName(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} className="edit-button">
            Edit Name
          </button>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">
            {Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(balance)}
          </p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button
            onClick={() => {
              navigate('/transactions');
            }}
            className="transaction-button"
          >
            View transactions
          </button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
