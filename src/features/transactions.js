import { createSlice } from '@reduxjs/toolkit';
import { selectTransactions } from '../utils/selectors';

const initialState = {
  status: 'void',
  data: null,
  error: null,
};

/* Transactions feature slice */
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    /* Action: transactions/fetching */
    fetching: (draft) => {
      if (draft.status === 'void') {
        draft.status = 'pending';
        return;
      }
      if (draft.status === 'rejected') {
        draft.error = null;
        draft.status = 'pending';
        return;
      }
      if (draft.status === 'resolved') {
        draft.status = 'updating';
        return;
      }
      return;
    },
    /* Action: transactions/rejected */
    resolved: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.data = action.payload;
        draft.status = 'resolved';
        return;
      }
      return;
    },
    /* Action: profile/rejected */
    rejected: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.error = action.payload;
        draft.data = null;
        draft.status = 'rejected';
        return;
      }
      return;
    },
  },
});

const { actions, reducer } = transactionsSlice;

export const { fetching, resolved, rejected } = actions;

export default reducer;

/**
 * Async function to send a POST request to the API to get the transactionsList data.
 * @function fetchOrUpdateTransactionsList
 *
 * @param {string} authToken The authentication token stored in the auth store.
 * @returns {void} Returns void if a request is already running.
 */
export const fetchOrUpdateTransactionsList = (authToken) => {
  return async (dispatch, getState) => {
    const status = selectTransactions(getState()).status;

    if (status === 'pending' || status === 'updating') {
      return;
    }

    dispatch(fetching());

    try {
      const response = await fetch('http://localhost:3001/api/v1/transactions/list', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      dispatch(rejected(error));
    }
  };
};
