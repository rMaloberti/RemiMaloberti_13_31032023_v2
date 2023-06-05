import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { selectAuth, selectProfile, selectTransactions } from '../../utils/selectors';
import { useEffect } from 'react';
import { fetchOrUpdateProfile } from '../../features/profile';
import TransactionRow from '../../components/TransactionRow';
import { fetchOrUpdateTransactionsList } from '../../features/transactions';

const Transactions = () => {
  /* Get the auth key in the store */
  const auth = useSelector(selectAuth);

  const dispatch = useDispatch();

  /* Dispatch fetch action to get profile data */
  useEffect(() => {
    dispatch(fetchOrUpdateProfile(auth.data?.body.token));
    dispatch(fetchOrUpdateTransactionsList(auth.data?.body.token));
  }, [auth, dispatch]);

  const profileData = useSelector(selectProfile).data?.body ?? {};
  const transactionsData = useSelector(selectTransactions).data?.body ?? [];

  const { balance } = profileData;

  return (
    <main className="main bg-dark">
      <div className="account-banner">
        <h3 className="account-banner__title">Argent Bank Checking (x8349)</h3>
        <p className="account-banner__amount">
          {Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(balance)}
        </p>
        <p className="account-banner__description">Available Balance</p>
      </div>
      <div className="transactions">
        <table className="transactions__table">
          <thead>
            <tr className="transactions__table__header">
              <th className="transactions__table__header__cell"></th>
              <th className="transactions__table__header__cell">DATE</th>
              <th className="transactions__table__header__cell">DESCRIPTION</th>
              <th className="transactions__table__header__cell">AMOUNT</th>
              <th className="transactions__table__header__cell">BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {transactionsData.map((transactionData, index) => {
              let userBalance = balance;

              for (let i = 0; i < index; i++) {
                userBalance += transactionsData[i].amount;
              }

              return (
                <TransactionRow
                  key={index}
                  transactionData={transactionData}
                  userBalance={userBalance}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Transactions;
