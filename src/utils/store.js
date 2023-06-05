import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth';
import profileReducer from '../features/profile';
import transactionsReducer from '../features/transactions';
import transactionDetailsReducer from '../features/transactionDetails';

/* Create the global redux store */
export default configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    transactions: transactionsReducer,
    transactionDetails: transactionDetailsReducer,
  },
});
