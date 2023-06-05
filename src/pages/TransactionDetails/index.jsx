import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { selectAuth, selectProfile, selectTransactionDetails } from '../../utils/selectors';
import { useEffect, useRef, useState } from 'react';
import { fetchOrUpdateProfile } from '../../features/profile';
import {
  editTransactionDetails,
  fetchOrUpdateTransactionDetails,
} from '../../features/transactionDetails';
import { useParams } from 'react-router';
import { formatMonth } from '../../utils/helpers';

const TransactionDetails = () => {
  /* Get the auth key in the store */
  const auth = useSelector(selectAuth);

  /* Get the transaction ID in the URL params */
  const transactionId = useParams('id').id;

  /* React state to hold the formated version of the date */
  const [formatedDate, setFormatedDate] = useState(null);

  /* Redux dispatcher */
  const dispatch = useDispatch();

  /* Dispatch fetch action to get profile data */
  useEffect(() => {
    dispatch(fetchOrUpdateProfile(auth.data?.body.token));
    dispatch(fetchOrUpdateTransactionDetails(auth.data?.body.token, transactionId));
  }, [auth, transactionId, dispatch]);

  /* Get the profile data using redux selector */
  const profileData = useSelector(selectProfile).data?.body ?? {};

  /* Get the transaction data using redux selector */
  const transactionData = useSelector(selectTransactionDetails).data?.body ?? {};

  const { balance } = profileData;

  /* Format the date as soon as we get it */
  useEffect(() => {
    const dateToFormat = new Date(transactionData.date);

    setFormatedDate(
      `${formatMonth(
        dateToFormat.getUTCMonth()
      )} ${dateToFormat.getUTCDate()}th, ${dateToFormat.getUTCFullYear()}`
    );
  }, [transactionData.date]);

  /* Text inputs refs */
  const categoryField = useRef(null);
  const notesField = useRef(null);

  /* Text inputs react states that holds their value */
  const [categoryValue, setCategoryValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  /* Fill the text inputs with the values saved in redux store */
  useEffect(() => {
    setCategoryValue(transactionData.category);
    setNotesValue(transactionData.notes);
  }, [transactionData.category, transactionData.notes]);

  /* Input error controller using boolean in react state */
  const [emptyCategoryError, setEmptyCategoryError] = useState(false);

  /**
   * Dispatch the action with the given text inputs.
   * @function submitForm
   */
  const submitForm = (e) => {
    e.preventDefault();
    setEmptyCategoryError(false);

    if (categoryValue !== '') {
      const data = {
        category: categoryValue,
        notes: notesValue,
      };

      dispatch(editTransactionDetails(auth.data?.body.token, transactionId, data));
    }

    if (categoryValue === '') {
      setEmptyCategoryError(true);
    }
  };

  return (
    <main className="main bg-dark">
      <div className="account-banner">
        <h3 className="account-banner__title">Argent Bank Checking (x8349)</h3>
        <p className="account-banner__amount">
          {Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(balance)}
        </p>
        <p className="account-banner__description">Available Balance</p>
      </div>
      <div className="details">
        <div className="details__infos">
          <div className="details__infos__top">
            <p className="details__infos__top__amount">${transactionData.amount}</p>
            <p className="details__infos__top__description">{transactionData.description}</p>
          </div>
          <div className="details__infos__bottom">
            <p className="details__infos__bottom__date">
              Date : <span className="details__infos__bottom__date__date">{formatedDate}</span>
            </p>
            <p className="details__infos__bottom__transaction-type">
              Transaction type :{' '}
              <span className="details__infos__bottom__transaction-type__type">
                {transactionData.transactionType}
              </span>
            </p>
          </div>
        </div>
        <div className="details__edit">
          <form className="details__edit__form">
            <div className="details__edit__form__input-wrapper">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                ref={categoryField}
                onChange={() => {
                  const value = categoryField.current.value;
                  setCategoryValue(value);
                }}
                id="category"
                defaultValue={transactionData.category}
                placeholder="Category..."
              />
              {emptyCategoryError ? (
                <p className="empty-error">Veuillez remplir ce champ.</p>
              ) : null}
            </div>
            <div className="details__edit__form__input-wrapper">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                ref={notesField}
                onChange={() => {
                  const value = notesField.current.value;
                  setNotesValue(value);
                }}
                rows="3"
                cols="50"
                defaultValue={transactionData.notes}
                placeholder="Notes..."
              />
            </div>
            <button onClick={submitForm} className="details__edit__form__submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default TransactionDetails;
